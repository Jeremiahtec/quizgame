"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getSocket } from "@/lib/socket-client"

export function WaitingRoom() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [playerCount, setPlayerCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const playerData = localStorage.getItem("currentPlayer")
    const pin = localStorage.getItem("gamePin")
    if (playerData) {
      const player = JSON.parse(playerData)
      setPlayerName(player.name)
    } else {
      router.push("/join")
      return
    }
    if (!pin) {
      router.push("/join")
      return
    }

    const socket = getSocket()
    const onPlayerJoined = () => setPlayerCount((c) => c + 1)
    const onPlayerLeft = () => setPlayerCount((c) => Math.max(0, c - 1))
    const onGameStarted = () => {
      setStarted(true)
      setTimeout(() => router.push("/play"), 1200)
    }

    socket.on("playerJoined", onPlayerJoined)
    socket.on("playerLeft", onPlayerLeft)
    socket.on("gameStarted", onGameStarted)

    return () => {
      socket.off("playerJoined", onPlayerJoined)
      socket.off("playerLeft", onPlayerLeft)
      socket.off("gameStarted", onGameStarted)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-2xl border-2 animate-scale-in">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shadow-xl animate-pulse-glow">
            <Users className="h-10 w-10 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {playerName}!</h1>
            {started ? (
              <p className="text-accent font-semibold animate-pulse">Game starting...</p>
            ) : (
              <p className="text-muted-foreground">You're in! Waiting for the host to start the game...</p>
            )}
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className={`h-5 w-5 ${started ? "animate-none text-accent" : "animate-spin"}`} />
            <span>
              {playerCount} {playerCount === 1 ? "player" : "players"} in lobby
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
