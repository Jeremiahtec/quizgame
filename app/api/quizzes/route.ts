import { type NextRequest, NextResponse } from "next/server"
import { loadQuizzes, createQuiz } from "@/lib/quiz-storage"

export async function GET() {
  try {
    const quizzes = loadQuizzes()
    return NextResponse.json(quizzes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load quizzes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, questions } = body

    if (!title || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid quiz data" }, { status: 400 })
    }

    const quiz = createQuiz({ title, questions })
    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
