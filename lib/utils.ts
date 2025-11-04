import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateScore(timeLeft: number, timeLimit: number, isCorrect: boolean): number {
  if (!isCorrect) return 0

  const basePoints = 1000
  const timeBonus = Math.floor((timeLeft / timeLimit) * 500)
  return basePoints + timeBonus
}

export function generateGamePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
