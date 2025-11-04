"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

const ANSWER_COLORS = [
  "bg-gradient-to-br from-chart-1 to-chart-1/80 hover:from-chart-1/90 hover:to-chart-1/70 text-white shadow-lg",
  "bg-gradient-to-br from-chart-2 to-chart-2/80 hover:from-chart-2/90 hover:to-chart-2/70 text-white shadow-lg",
  "bg-gradient-to-br from-chart-3 to-chart-3/80 hover:from-chart-3/90 hover:to-chart-3/70 text-white shadow-lg",
  "bg-gradient-to-br from-chart-4 to-chart-4/80 hover:from-chart-4/90 hover:to-chart-4/70 text-white shadow-lg",
]

export function QuizBuilder() {
  const router = useRouter()
  const [quizTitle, setQuizTitle] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "",
      answers: [
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
        { id: "3", text: "", isCorrect: false },
        { id: "4", text: "", isCorrect: false },
      ],
      timeLimit: 20,
    },
  ])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]

  const updateQuestion = (text: string) => {
    const updated = [...questions]
    updated[currentQuestionIndex].question = text
    setQuestions(updated)
  }

  const updateAnswer = (answerId: string, text: string) => {
    const updated = [...questions]
    const answer = updated[currentQuestionIndex].answers.find((a) => a.id === answerId)
    if (answer) answer.text = text
    setQuestions(updated)
  }

  const toggleCorrectAnswer = (answerId: string) => {
    const updated = [...questions]
    updated[currentQuestionIndex].answers.forEach((a) => {
      a.isCorrect = a.id === answerId
    })
    setQuestions(updated)
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: String(questions.length + 1),
      question: "",
      answers: [
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
        { id: "3", text: "", isCorrect: false },
        { id: "4", text: "", isCorrect: false },
      ],
      timeLimit: 20,
    }
    setQuestions([...questions, newQuestion])
    setCurrentQuestionIndex(questions.length)
  }

  const deleteQuestion = (index: number) => {
    if (questions.length === 1) return
    const updated = questions.filter((_, i) => i !== index)
    setQuestions(updated)
    if (currentQuestionIndex >= updated.length) {
      setCurrentQuestionIndex(updated.length - 1)
    }
  }

  const startGame = () => {
    if (!quizTitle.trim()) {
      alert("Please add a quiz title")
      return
    }
    if (questions.some((q) => !q.question.trim())) {
      alert("Please fill in all questions")
      return
    }
    if (questions.some((q) => q.answers.some((a) => !a.text.trim()))) {
      alert("Please fill in all answers")
      return
    }
    if (questions.some((q) => !q.answers.some((a) => a.isCorrect))) {
      alert("Please mark a correct answer for each question")
      return
    }

    // Create quiz on server, then create a game session and go to lobby
    const create = async () => {
      const resQuiz = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: quizTitle, questions }),
      })
      if (!resQuiz.ok) {
        alert("Failed to create quiz")
        return
      }
      const quiz = await resQuiz.json()

      const resGame = await fetch("/api/games/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: quiz.id }),
      })
      if (!resGame.ok) {
        alert("Failed to create game session")
        return
      }
      const { gamePin } = await resGame.json()

      localStorage.setItem("currentQuiz", JSON.stringify(quiz))
      localStorage.setItem("gamePin", gamePin)
      router.push("/lobby")
    }

    void create()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col gap-1">
            <Input
              placeholder="Enter quiz title..."
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="text-2xl font-bold border-0 px-0 h-auto focus-visible:ring-0"
            />
            <p className="text-sm text-muted-foreground">
              {questions.length} {questions.length === 1 ? "question" : "questions"}
            </p>
          </div>
        </div>
        <Button
          onClick={startGame}
          size="lg"
          className="gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105 gradient-purple-blue"
        >
          <Play className="h-5 w-5" />
          Start Game
        </Button>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Question List Sidebar */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Questions</h3>
            <Button
              onClick={addQuestion}
              size="sm"
              variant="outline"
              className="gap-2 bg-card hover:scale-105 transition-transform shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {questions.map((q, index) => (
              <Card
                key={q.id}
                className={`p-3 cursor-pointer transition-all rounded-xl shadow-md hover:shadow-lg ${
                  index === currentQuestionIndex
                    ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                    : "hover:bg-muted hover:scale-102"
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Question {index + 1}</p>
                    <p className="text-xs text-muted-foreground truncate">{q.question || "Empty question"}</p>
                  </div>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteQuestion(index)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Question Editor */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Question</label>
                <Input
                  placeholder="Enter your question..."
                  value={currentQuestion.question}
                  onChange={(e) => updateQuestion(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time Limit (seconds)</label>
                <Input
                  type="number"
                  min="5"
                  max="120"
                  value={currentQuestion.timeLimit}
                  onChange={(e) => {
                    const updated = [...questions]
                    updated[currentQuestionIndex].timeLimit = Number.parseInt(e.target.value) || 20
                    setQuestions(updated)
                  }}
                  className="w-32"
                />
              </div>
            </div>
          </Card>

          <div>
            <label className="text-sm font-medium mb-3 block">Answers (click to mark as correct)</label>
            <div className="grid md:grid-cols-2 gap-4">
              {currentQuestion.answers.map((answer, index) => (
                <Card
                  key={answer.id}
                  className={`p-6 cursor-pointer transition-all rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 ${
                    answer.isCorrect
                      ? "ring-4 ring-accent ring-offset-2 ring-offset-background animate-bounce-subtle"
                      : ""
                  }`}
                  onClick={() => toggleCorrectAnswer(answer.id)}
                >
                  <div className="flex flex-col gap-3">
                    <div
                      className={`h-12 w-12 rounded-2xl ${ANSWER_COLORS[index]} flex items-center justify-center font-bold text-xl transition-transform hover:scale-110`}
                    >
                      {index + 1}
                    </div>
                    <Input
                      placeholder={`Answer ${index + 1}...`}
                      value={answer.text}
                      onChange={(e) => {
                        e.stopPropagation()
                        updateAnswer(answer.id, e.target.value)
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {answer.isCorrect && <p className="text-xs text-accent font-medium">✓ Correct Answer</p>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
