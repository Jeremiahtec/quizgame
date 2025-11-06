"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Google } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl border-2 animate-scale-in text-center">
        <h1 className="text-3xl font-black mb-2">Sign in</h1>
        <p className="text-muted-foreground mb-6">Sign in to save and manage your quizzes</p>
        <Button
          size="lg"
          className="gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105 gradient-purple-blue rounded-2xl w-full"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Google className="h-5 w-5" />
          Continue with Google
        </Button>
      </Card>
    </div>
  )
}


