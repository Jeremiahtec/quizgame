import { type NextRequest, NextResponse } from "next/server"
import { getQuiz, updateQuiz, deleteQuiz } from "@/lib/quiz-storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quiz = getQuiz(params.id)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }
    return NextResponse.json(quiz)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const quiz = updateQuiz(params.id, body)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }
    return NextResponse.json(quiz)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = deleteQuiz(params.id)
    if (!success) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 })
  }
}
