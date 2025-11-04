import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import type { NextRequest } from "next/server"
import type { ServerToClientEvents, ClientToServerEvents, GameSession, Player } from "@/lib/types"
import { getQuiz } from "@/lib/quiz-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Store active game sessions in memory
const gameSessions = new Map<string, GameSession>()

// App Router route segment config replaces pages `export const config`

let io: SocketIOServer<ClientToServerEvents, ServerToClientEvents> | null = null

export async function GET(req: NextRequest) {
  if (!io) {
    // @ts-ignore - Next.js socket handling
    const httpServer: HTTPServer = (req as any).socket.server
    io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    })

    io.on("connection", (socket) => {
      console.log("[v0] Client connected:", socket.id)

      // Join game
      socket.on("joinGame", (gamePin, playerName, callback) => {
        console.log("[v0] Player joining:", playerName, "to game:", gamePin)
        const session = gameSessions.get(gamePin)

        if (!session) {
          callback(false, "Game not found")
          return
        }

        if (session.gameStarted) {
          callback(false, "Game already started")
          return
        }

        const player: Player = {
          id: socket.id,
          name: playerName,
          score: 0,
          answers: {},
        }

        session.players[socket.id] = player
        socket.join(gamePin)

        callback(true)
        io?.to(gamePin).emit("playerJoined", player)
      })

      // Start game
      socket.on("startGame", (gamePin) => {
        console.log("[v0] Starting game:", gamePin)
        const session = gameSessions.get(gamePin)
        if (!session) return

        session.gameStarted = true
        session.currentQuestionIndex = 0
        session.questionStartTime = Date.now()

        io?.to(gamePin).emit("gameStarted")
        io?.to(gamePin).emit("questionStarted", 0, session.quiz.questions[0])
      })

      // Submit answer
      socket.on("submitAnswer", (gamePin, playerId, answerId) => {
        console.log("[v0] Answer submitted:", playerId, answerId)
        const session = gameSessions.get(gamePin)
        if (!session || !session.players[playerId]) return

        const player = session.players[playerId]
        const question = session.quiz.questions[session.currentQuestionIndex]
        const correctAnswer = question.answers.find((a) => a.isCorrect)

        // Store answer
        player.answers[session.currentQuestionIndex] = answerId

        // Calculate score (bonus for speed)
        if (answerId === correctAnswer?.id && session.questionStartTime) {
          const timeElapsed = Date.now() - session.questionStartTime
          const timeBonus = Math.max(0, 1000 - timeElapsed / 10)
          player.score += Math.round(1000 + timeBonus)
        }

        io?.to(gamePin).emit("playerAnswered", playerId, answerId)
      })

      // Next question
      socket.on("nextQuestion", (gamePin) => {
        console.log("[v0] Moving to next question")
        const session = gameSessions.get(gamePin)
        if (!session) return

        const currentQuestion = session.quiz.questions[session.currentQuestionIndex]
        const correctAnswer = currentQuestion.answers.find((a) => a.isCorrect)
        const scores = Object.fromEntries(Object.entries(session.players).map(([id, p]) => [id, p.score]))

        io?.to(gamePin).emit("questionEnded", correctAnswer?.id || "", scores)

        // Move to next question or end game
        setTimeout(() => {
          session.currentQuestionIndex++

          if (session.currentQuestionIndex >= session.quiz.questions.length) {
            session.gameEnded = true
            const finalScores = Object.values(session.players)
              .map((p) => ({ playerId: p.id, name: p.name, score: p.score }))
              .sort((a, b) => b.score - a.score)

            io?.to(gamePin).emit("gameEnded", finalScores)
          } else {
            session.questionStartTime = Date.now()
            io?.to(gamePin).emit(
              "questionStarted",
              session.currentQuestionIndex,
              session.quiz.questions[session.currentQuestionIndex],
            )
          }
        }, 3000)
      })

      // End game
      socket.on("endGame", (gamePin) => {
        console.log("[v0] Ending game:", gamePin)
        const session = gameSessions.get(gamePin)
        if (!session) return

        session.gameEnded = true
        const finalScores = Object.values(session.players)
          .map((p) => ({ playerId: p.id, name: p.name, score: p.score }))
          .sort((a, b) => b.score - a.score)

        io?.to(gamePin).emit("gameEnded", finalScores)
        gameSessions.delete(gamePin)
      })

      socket.on("disconnect", () => {
        console.log("[v0] Client disconnected:", socket.id)
        // Remove player from all games
        for (const [gamePin, session] of gameSessions.entries()) {
          if (session.players[socket.id]) {
            delete session.players[socket.id]
            io?.to(gamePin).emit("playerLeft", socket.id)
          }
        }
      })
    })
  }

  return new Response("Socket.IO server running", { status: 200 })
}

// Helper function to create a new game session
export function createGameSession(quizId: string): string | null {
  const quiz = getQuiz(quizId)
  if (!quiz) return null

  const gamePin = Math.floor(100000 + Math.random() * 900000).toString()
  const session: GameSession = {
    gamePin,
    quizId,
    quiz,
    players: {},
    currentQuestionIndex: 0,
    gameStarted: false,
    gameEnded: false,
    questionStartTime: null,
  }

  gameSessions.set(gamePin, session)
  return gamePin
}
