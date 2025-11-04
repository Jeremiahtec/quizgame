import type { Quiz } from "./types"
import fs from "fs"
import path from "path"

const QUIZZES_FILE = path.join(process.cwd(), "data", "quizzes.json")

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load all quizzes from file
export function loadQuizzes(): Quiz[] {
  ensureDataDir()
  try {
    if (fs.existsSync(QUIZZES_FILE)) {
      const data = fs.readFileSync(QUIZZES_FILE, "utf-8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading quizzes:", error)
  }
  return []
}

// Save all quizzes to file
export function saveQuizzes(quizzes: Quiz[]): void {
  ensureDataDir()
  try {
    fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzes, null, 2))
  } catch (error) {
    console.error("Error saving quizzes:", error)
    throw error
  }
}

// Get a single quiz by ID
export function getQuiz(id: string): Quiz | null {
  const quizzes = loadQuizzes()
  return quizzes.find((q) => q.id === id) || null
}

// Create a new quiz
export function createQuiz(quiz: Omit<Quiz, "id" | "createdAt">): Quiz {
  const quizzes = loadQuizzes()
  const newQuiz: Quiz = {
    ...quiz,
    id: Date.now().toString(),
    createdAt: Date.now(),
  }
  quizzes.push(newQuiz)
  saveQuizzes(quizzes)
  return newQuiz
}

// Update an existing quiz
export function updateQuiz(id: string, updates: Partial<Omit<Quiz, "id" | "createdAt">>): Quiz | null {
  const quizzes = loadQuizzes()
  const index = quizzes.findIndex((q) => q.id === id)
  if (index === -1) return null

  quizzes[index] = { ...quizzes[index], ...updates }
  saveQuizzes(quizzes)
  return quizzes[index]
}

// Delete a quiz
export function deleteQuiz(id: string): boolean {
  const quizzes = loadQuizzes()
  const filtered = quizzes.filter((q) => q.id !== id)
  if (filtered.length === quizzes.length) return false

  saveQuizzes(filtered)
  return true
}
