"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MyQuizzesPage() {
  const { data: session } = useSession()
  const { data: quizzes, isLoading } = useSWR(session ? "/api/quizzes" : null, fetcher)

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 text-center">
          <p className="mb-4">Please sign in to view your quizzes.</p>
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Quizzes</h1>
        <Button asChild>
          <Link href="/create">Create New</Link>
        </Button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : !quizzes || quizzes.length === 0 ? (
        <Card className="p-8 text-center">No quizzes yet.</Card>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((q: any) => (
            <Card key={q.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{q.title}</p>
                <p className="text-sm text-muted-foreground">{q.questions.length} questions</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/create">Edit</Link>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


