"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"

export function GameHeader() {
  const { data: session } = useSession()
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          SQI x Jerryquiz
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          {session?.user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my-quizzes">My Quizzes</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => signIn("google", { callbackUrl: "/" })}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
