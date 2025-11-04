import { type NextRequest, NextResponse } from "next/server"
import { getQuiz } from "@/lib/quiz-storage"
import { createGameSession } from "@/app/api/socket/route"

export async function POST(request: NextRequest) {
  try {
    const { quizId } = await request.json()

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID required" }, { status: 400 })
    }

    const quiz = getQuiz(quizId)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const gamePin = createGameSession(quizId)
    if (!gamePin) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    return NextResponse.json({ gamePin, quiz })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 })
  }
}
