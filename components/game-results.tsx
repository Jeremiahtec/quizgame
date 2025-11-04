"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award, Home, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"

type PlayerScore = {
  id: string
  name: string
  score: number
}

const PODIUM_COLORS = [
  "bg-gradient-to-br from-chart-3 to-chart-3/80 text-white shadow-xl", // Gold
  "bg-gradient-to-br from-chart-2 to-chart-2/80 text-white shadow-xl", // Silver
  "bg-gradient-to-br from-chart-1 to-chart-1/80 text-white shadow-xl", // Bronze
]

const MEDAL_ICONS = [Trophy, Medal, Award]

export function GameResults() {
  const router = useRouter()
  const [players, setPlayers] = useState<PlayerScore[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<any>(null)
  const [isHost, setIsHost] = useState(false)

  useEffect(() => {
    // Check if host
    const quizData = localStorage.getItem("currentQuiz")
    if (quizData) {
      setIsHost(true)
    }

    // Get current player
    const playerData = localStorage.getItem("currentPlayer")
    if (playerData) {
      setCurrentPlayer(JSON.parse(playerData))
    }

    // Load final scores from server payload stored by play page
    const finalScores = localStorage.getItem("finalScores")
    if (finalScores) {
      const mapped: PlayerScore[] = JSON.parse(finalScores).map((p: any) => ({
        id: p.playerId,
        name: p.name,
        score: p.score,
      }))
      mapped.sort((a, b) => b.score - a.score)
      setPlayers(mapped)
    }

    // Trigger confetti for top 3
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }, 500)
  }, [])

  const handlePlayAgain = () => {
    // Clear game state
    localStorage.removeItem("gameStarted")
    localStorage.removeItem("gameEnded")
    localStorage.removeItem("currentQuestionIndex")
    localStorage.removeItem("showResults")
    localStorage.removeItem("playerAnswers")
    localStorage.removeItem("playerScore")
    localStorage.removeItem("currentPlayer")
    localStorage.removeItem("finalScores")

    if (isHost) {
      router.push("/create")
    } else {
      router.push("/join")
    }
  }

  const topThree = players.slice(0, 3)
  const restOfPlayers = players.slice(3)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col items-center gap-8 animate-slide-up">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-2 bg-gradient-to-r from-primary via-chart-2 to-accent bg-clip-text text-transparent">
            Game Over!
          </h1>
          <p className="text-xl text-muted-foreground font-semibold">Final Results</p>
        </div>

        {/* Podium - Top 3 */}
        {topThree.length > 0 && (
          <div className="w-full max-w-3xl">
            <div className="grid grid-cols-3 gap-4 items-end mb-8">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center gap-3 animate-scale-in" style={{ animationDelay: "0.2s" }}>
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center shadow-xl">
                    <Medal className="h-8 w-8 text-white" />
                  </div>
                  <Card className={`w-full p-4 text-center ${PODIUM_COLORS[1]} rounded-2xl`}>
                    <p className="font-bold text-lg truncate">{topThree[1].name}</p>
                    <p className="text-2xl font-black font-mono">{topThree[1].score}</p>
                    <p className="text-sm opacity-90 font-semibold">2nd Place</p>
                  </Card>
                  <div className="w-full h-24 bg-gradient-to-t from-chart-2/30 to-chart-2/10 rounded-t-2xl shadow-lg" />
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center gap-3 animate-scale-in" style={{ animationDelay: "0.1s" }}>
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-chart-3 to-chart-3/70 flex items-center justify-center shadow-2xl animate-pulse-glow">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                  <Card className={`w-full p-4 text-center ${PODIUM_COLORS[0]} rounded-2xl`}>
                    <p className="font-bold text-xl truncate">{topThree[0].name}</p>
                    <p className="text-3xl font-black font-mono">{topThree[0].score}</p>
                    <p className="text-sm opacity-90 font-semibold">Winner!</p>
                  </Card>
                  <div className="w-full h-32 bg-gradient-to-t from-chart-3/30 to-chart-3/10 rounded-t-2xl shadow-xl" />
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center gap-3 animate-scale-in" style={{ animationDelay: "0.3s" }}>
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-chart-1 to-chart-1/70 flex items-center justify-center shadow-xl">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <Card className={`w-full p-4 text-center ${PODIUM_COLORS[2]} rounded-2xl`}>
                    <p className="font-bold text-lg truncate">{topThree[2].name}</p>
                    <p className="text-2xl font-black font-mono">{topThree[2].score}</p>
                    <p className="text-sm opacity-90 font-semibold">3rd Place</p>
                  </Card>
                  <div className="w-full h-20 bg-gradient-to-t from-chart-1/30 to-chart-1/10 rounded-t-2xl shadow-lg" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rest of Players */}
        {restOfPlayers.length > 0 && (
          <Card className="w-full max-w-2xl p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold mb-4">All Players</h3>
            <div className="flex flex-col gap-2">
              {restOfPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-muted to-muted/50 shadow-md hover:shadow-lg transition-all hover:scale-102"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono font-bold w-8">{index + 4}</span>
                    <span className="font-semibold">{player.name}</span>
                  </div>
                  <span className="font-black font-mono text-lg">{player.score}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Your Score (for players) */}
        {currentPlayer && !isHost && (
          <Card className="w-full max-w-md p-6 border-2 border-primary rounded-2xl shadow-2xl animate-pulse-glow">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Your Score</p>
              <p className="text-5xl font-black font-mono mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {players.find((p) => p.id === currentPlayer.id)?.score || 0}
              </p>
              <p className="text-muted-foreground font-semibold">
                Rank: {players.findIndex((p) => p.id === currentPlayer.id) + 1} of {players.length}
              </p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handlePlayAgain}
            size="lg"
            className="gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105 gradient-purple-blue rounded-2xl"
          >
            <RotateCcw className="h-5 w-5" />
            Play Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 bg-card hover:scale-105 transition-all shadow-lg rounded-2xl"
            onClick={() => router.push("/")}
          >
            <Home className="h-5 w-5" />
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}
