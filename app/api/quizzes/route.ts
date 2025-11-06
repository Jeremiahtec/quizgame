import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/server-auth-options"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json([], { status: 200 })
    const quizzes = await prisma.quiz.findMany({
      where: { ownerId: session.user.id },
      include: { questions: { include: { answers: true }, orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(quizzes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load quizzes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const body = await request.json()
    const { title, questions } = body

    if (!title || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid quiz data" }, { status: 400 })
    }

    const created = await prisma.quiz.create({
      data: {
        title,
        ownerId: session.user.id,
        questions: {
          create: questions.map((q: any, idx: number) => ({
            text: q.question,
            timeLimit: q.timeLimit || 20,
            order: idx,
            answers: {
              create: (q.answers || []).map((a: any, aIdx: number) => ({
                text: a.text,
                isCorrect: !!a.isCorrect,
                order: aIdx,
              })),
            },
          })),
        },
      },
      include: { questions: { include: { answers: true }, orderBy: { order: "asc" } } },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
