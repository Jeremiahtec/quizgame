"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { Clock, Trophy } from "lucide-react"
import { getSocket } from "@/lib/socket-client"

type Answer = {
  id: string
  text: string
  isCorrect: boolean
}

type Question = {
  id: string
  question: string
  answers: Answer[]
  timeLimit: number
}

type Quiz = {
  title: string
  questions: Question[]
}

type PlayerAnswer = {
  playerId: string
  answerId: string
  timeToAnswer: number
}

const ANSWER_COLORS = [
  "bg-gradient-to-br from-chart-1 to-chart-1/80 hover:from-chart-1/90 hover:to-chart-1/70 text-white shadow-xl",
  "bg-gradient-to-br from-chart-2 to-chart-2/80 hover:from-chart-2/90 hover:to-chart-2/70 text-white shadow-xl",
  "bg-gradient-to-br from-chart-3 to-chart-3/80 hover:from-chart-3/90 hover:to-chart-3/70 text-white shadow-xl",
  "bg-gradient-to-br from-chart-4 to-chart-4/80 hover:from-chart-4/90 hover:to-chart-4/70 text-white shadow-xl",
]

export function GamePlay() {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [playerAnswers, setPlayerAnswers] = useState<PlayerAnswer[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<any>(null)
  const [score, setScore] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(null)

  useEffect(() => {
    const quizData = localStorage.getItem("currentQuiz")
    const pin = localStorage.getItem("gamePin")
    const socket = getSocket()

    if (quizData) {
      const loadedQuiz = JSON.parse(quizData)
      setQuiz(loadedQuiz)
      setIsHost(true)
    } else {
      const playerData = localStorage.getItem("currentPlayer")
      if (playerData) setCurrentPlayer(JSON.parse(playerData))
    }

    const onQuestionStarted = (index: number, question: Question) => {
      setCurrentQuestionIndex(index)
      setSelectedAnswer(null)
      setShowResults(false)
      setCorrectAnswerId(null)
      setTimeLeft(question.timeLimit)
      setStartTime(Date.now())
      // Ensure quiz exists for answer rendering
      setQuiz((q) => {
        if (q) return q
        return { title: localStorage.getItem("currentQuizTitle") || "Quiz", questions: [question] }
      })
    }

    const onQuestionEnded = (correctId: string, _scores: Record<string, number>) => {
      setCorrectAnswerId(correctId)
      setShowResults(true)
    }

    const onGameEnded = (finalScores: Array<{ playerId: string; name: string; score: number }>) => {
      localStorage.setItem("finalScores", JSON.stringify(finalScores))
      router.push("/results")
    }

    socket.on("questionStarted", onQuestionStarted)
    socket.on("questionEnded", onQuestionEnded)
    socket.on("gameEnded", onGameEnded)

    setStartTime(Date.now())

    return () => {
      socket.off("questionStarted", onQuestionStarted)
      socket.off("questionEnded", onQuestionEnded)
      socket.off("gameEnded", onGameEnded)
    }
  }, [router])

  // Socket-driven; no polling needed

  // Timer countdown
  useEffect(() => {
    if (showResults) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentQuestionIndex, quiz, showResults, isHost])

  const handleAnswerSelect = (answerId: string) => {
    if (selectedAnswer || showResults) return

    setSelectedAnswer(answerId)
    const pin = localStorage.getItem("gamePin") || ""
    const socket = getSocket()
    socket.emit("submitAnswer", pin, socket.id, answerId)
  }

  const handleShowResults = () => {
    // Host should not force; server emits questionEnded
    setShowResults(true)
  }

  const handleNextQuestion = () => {
    const pin = localStorage.getItem("gamePin") || ""
    const socket = getSocket()
    socket.emit("nextQuestion", pin)
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading game...</p>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg">
            <Trophy className="h-5 w-5 text-accent" />
            <span className="font-mono font-black text-xl">{score}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
          <Progress value={progress} className="w-32 h-2 mt-1 shadow-md" />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-muted to-muted/50 shadow-lg">
          <Clock className={`h-5 w-5 ${timeLeft <= 5 ? "text-destructive animate-pulse" : "text-muted-foreground"}`} />
          <span className={`font-mono font-black text-2xl ${timeLeft <= 5 ? "text-destructive animate-pulse" : ""}`}>
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Question */}
      <Card className="p-8 mb-8 rounded-3xl shadow-2xl border-2 animate-scale-in">
        <h2 className="text-3xl md:text-5xl font-black text-center text-balance leading-tight">
          {currentQuestion.question}
        </h2>
      </Card>

      {/* Answers */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {currentQuestion.answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer.id
          const isCorrect = answer.isCorrect
          const showCorrect = showResults && (correctAnswerId ? answer.id === correctAnswerId : isCorrect)
          const showIncorrect = showResults && isSelected && !showCorrect

          return (
            <Button
              key={answer.id}
              onClick={() => handleAnswerSelect(answer.id)}
              disabled={!!selectedAnswer || showResults}
              className={`h-32 text-xl font-bold transition-all rounded-3xl ${ANSWER_COLORS[index]} ${
                isSelected
                  ? "ring-4 ring-white ring-offset-4 ring-offset-background scale-105 animate-bounce-subtle"
                  : "hover:scale-105"
              } ${showCorrect ? "ring-4 ring-accent ring-offset-4 ring-offset-background scale-105" : ""} ${
                showIncorrect ? "opacity-50 scale-95" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black shadow-lg">
                  {index + 1}
                </div>
                <span className="flex-1 text-left">{answer.text}</span>
                {showCorrect && <span className="text-3xl">✓</span>}
              </div>
            </Button>
          )
        })}
      </div>

      {/* Host Controls */}
      {isHost && (
        <div className="flex justify-center gap-4">
          {!showResults && (
            <Button
              onClick={handleShowResults}
              size="lg"
              variant="outline"
              className="shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-card rounded-2xl"
            >
              Show Results
            </Button>
          )}
          {showResults && (
            <Button
              onClick={handleNextQuestion}
              size="lg"
              className="shadow-xl hover:shadow-2xl transition-all hover:scale-105 gradient-purple-blue rounded-2xl"
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? "Next Question" : "Show Final Results"}
            </Button>
          )}
        </div>
      )}

      {/* Player waiting message */}
      {!isHost && showResults && (
        <div className="text-center text-muted-foreground animate-pulse">
          <p className="font-medium">Waiting for next question...</p>
        </div>
      )}
    </div>
  )
}
