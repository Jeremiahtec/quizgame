import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Users, Trophy, Zap } from "lucide-react"
import { GameHeader } from "@/components/game-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <GameHeader />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-sm font-semibold shadow-lg">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Interactive Quiz Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-balance bg-gradient-to-r from-primary via-chart-2 to-accent bg-clip-text text-transparent">
            Make learning awesome with live quizzes
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl leading-relaxed">
            Create engaging quizzes, host live games, and watch your audience compete in real-time
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 gradient-purple-blue"
            >
              <Link href="/create">Create Quiz</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-card hover:bg-muted transition-all hover:scale-105 shadow-lg"
            >
              <Link href="/join">Join Game</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <div
            className="flex flex-col gap-4 p-6 rounded-2xl bg-card border shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-chart-1 to-chart-1/70 flex items-center justify-center shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-muted-foreground leading-relaxed">
              Real-time gameplay with instant scoring and live leaderboards
            </p>
          </div>

          <div
            className="flex flex-col gap-4 p-6 rounded-2xl bg-card border shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-chart-2 to-chart-2/70 flex items-center justify-center shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold">Multiplayer Fun</h3>
            <p className="text-muted-foreground leading-relaxed">
              Host games for unlimited players with simple join codes
            </p>
          </div>

          <div
            className="flex flex-col gap-4 p-6 rounded-2xl bg-card border shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-chart-4 to-chart-4/70 flex items-center justify-center shadow-lg">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold">Competitive Edge</h3>
            <p className="text-muted-foreground leading-relaxed">Points for speed and accuracy keep players engaged</p>
          </div>
        </div>
      </div>
      {/* <h2 className="text-3xl font-bold text-center">Join the Fun!</h2> */}
    </div>
  )
}
