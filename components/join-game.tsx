"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSocket } from "@/lib/socket-client"

export function JoinGame() {
  const router = useRouter()
  const [gamePin, setGamePin] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [step, setStep] = useState<"pin" | "name">("pin")
  const [error, setError] = useState("")

  const verifyPin = () => {
    setError("")
    if (!gamePin.trim() || gamePin.trim().length !== 6) {
      setError("Please enter a valid 6-digit PIN")
      return
    }
    setStep("name")
  }

  const joinGame = () => {
    setError("")
    if (!playerName.trim()) {
      setError("Please enter your name")
      return
    }
    const socket = getSocket()
    const doJoin = () => {
      socket.emit("joinGame", gamePin, playerName.trim(), (success: boolean, err?: string) => {
        if (!success) {
          setError(err || "Failed to join game")
          return
        }
        const player = { id: socket.id, name: playerName.trim(), joinedAt: Date.now() }
        localStorage.setItem("currentPlayer", JSON.stringify(player))
        localStorage.setItem("gamePin", gamePin)
        router.push("/waiting")
      })
    }
    if (socket.connected) {
      doJoin()
    } else {
      const timeout = setTimeout(() => setError("Connection timeout. Please try again."), 5000)
      socket.once("connect", () => {
        clearTimeout(timeout)
        doJoin()
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md animate-scale-in">
        <div className="mb-8">
          <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <Card className="p-8 rounded-3xl shadow-2xl border-2">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-black mb-2">{step === "pin" ? "Join Game" : "Enter Your Name"}</h1>
              <p className="text-muted-foreground leading-relaxed">
                {step === "pin" ? "Enter the game PIN to join" : "Choose a name to display in the game"}
              </p>
            </div>

            {step === "pin" ? (
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Game PIN"
                  value={gamePin}
                  onChange={(e) => setGamePin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-3xl font-mono tracking-wider h-16 rounded-2xl shadow-lg border-2 focus:ring-4 focus:ring-primary/20"
                  maxLength={6}
                  onKeyDown={(e) => e.key === "Enter" && verifyPin()}
                />
                {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}
                <Button
                  onClick={verifyPin}
                  size="lg"
                  className="gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105 gradient-purple-blue rounded-2xl"
                >
                  Continue
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
                  className="text-center text-xl h-14 rounded-2xl shadow-lg border-2 focus:ring-4 focus:ring-primary/20"
                  maxLength={20}
                  onKeyDown={(e) => e.key === "Enter" && joinGame()}
                  autoFocus
                />
                {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}
                <Button
                  onClick={joinGame}
                  size="lg"
                  className="gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105 gradient-purple-blue rounded-2xl"
                >
                  <LogIn className="h-5 w-5" />
                  Join Game
                </Button>
                <Button variant="ghost" onClick={() => setStep("pin")} className="hover:scale-105 transition-transform">
                  Back
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
