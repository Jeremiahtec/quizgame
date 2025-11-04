import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export function GameHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          SQI x Jerryquiz
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
    </header>
  )
}
