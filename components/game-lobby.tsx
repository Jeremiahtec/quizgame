"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, Copy, Check, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { getSocket } from "@/lib/socket-client"

type Player = {
  id: string
  name: string
  joinedAt: number
}

export function GameLobby() {
  const router = useRouter()
  const [gamePin, setGamePin] = useState("")
  const [quizTitle, setQuizTitle] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const quizData = localStorage.getItem("currentQuiz")
    const pin = localStorage.getItem("gamePin")
    if (!quizData || !pin) {
      router.push("/create")
      return
    }
    const quiz = JSON.parse(quizData)
    setQuizTitle(quiz.title)
    setGamePin(pin)

    const socket = getSocket()
    // Ensure host is part of the room to receive game events
    socket.emit("joinGame", pin, "HOST", () => {})
    const onPlayerJoined = (player: Player) => {
      if ((player as any).name === "HOST") return
      setPlayers((prev) => {
        if (prev.some((p) => p.id === player.id)) return prev
        return [...prev, { id: player.id, name: player.name, joinedAt: Date.now() }]
      })
    }
    const onPlayerLeft = (playerId: string) => {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId))
    }
    socket.on("playerJoined", onPlayerJoined)
    socket.on("playerLeft", onPlayerLeft)

    return () => {
      socket.off("playerJoined", onPlayerJoined)
      socket.off("playerLeft", onPlayerLeft)
    }
  }, [router])

  const copyPin = () => {
    navigator.clipboard.writeText(gamePin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const startGame = () => {
    if (players.length === 0) {
      alert("Wait for at least one player to join!")
      return
    }
    const socket = getSocket()
    socket.emit("startGame", gamePin)
    router.push("/play")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Added animation to container */}
      <div className="flex flex-col items-center gap-8 animate-slide-up">
        {/* Game PIN Display */}
        {/* Enhanced card with gradient border effect and shadows */}
        <Card className="w-full p-8 text-center rounded-3xl shadow-2xl border-2 animate-pulse-glow">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-muted-foreground">Join at</h2>
            <p className="text-sm text-muted-foreground font-mono">
              {typeof window !== "undefined" && window.location.origin}/join
            </p>
            <div className="flex items-center justify-center gap-4">
              {/* Enhanced PIN display with gradient text */}
              <div className="text-6xl md:text-8xl font-black tracking-wider font-mono bg-gradient-to-r from-primary via-chart-2 to-accent bg-clip-text text-transparent">
                {gamePin}
              </div>
              {/* Added hover animation to copy button */}
              <Button
                variant="outline"
                size="icon"
                onClick={copyPin}
                className="h-12 w-12 bg-card hover:scale-110 transition-transform shadow-lg"
              >
                {copied ? <Check className="h-6 w-6 text-accent" /> : <Copy className="h-6 w-6" />}
              </Button>
            </div>
            {/* Enhanced title with bold font */}
            <h1 className="text-2xl md:text-3xl font-black mt-4">{quizTitle}</h1>
          </div>
        </Card>

        {/* Players List */}
        {/* Enhanced card styling */}
        <Card className="w-full p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Added gradient background to icon */}
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Players</h3>
                <p className="text-sm text-muted-foreground">
                  {players.length} {players.length === 1 ? "player" : "players"} joined
                </p>
              </div>
            </div>
            {/* Enhanced button with gradient and animation */}
            <Button
              onClick={startGame}
              size="lg"
              className="gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105 gradient-purple-blue"
            >
              <Play className="h-5 w-5" />
              Start
            </Button>
          </div>

          {players.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
              <p>Waiting for players to join...</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {player.name}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
