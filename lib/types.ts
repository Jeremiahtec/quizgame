export type Answer = {
  id: string
  text: string
  isCorrect: boolean
}

export type Question = {
  id: string
  question: string
  answers: Answer[]
  timeLimit: number
}

export type Quiz = {
  id: string
  title: string
  questions: Question[]
  createdAt: number
}

export type Player = {
  id: string
  name: string
  score: number
  answers: Record<number, string> // questionIndex -> answerId
}

export type GameSession = {
  gamePin: string
  quizId: string
  quiz: Quiz
  players: Record<string, Player>
  currentQuestionIndex: number
  gameStarted: boolean
  gameEnded: boolean
  questionStartTime: number | null
}

// Socket.IO event types
export type ServerToClientEvents = {
  playerJoined: (player: Player) => void
  playerLeft: (playerId: string) => void
  gameStarted: () => void
  questionStarted: (questionIndex: number, question: Question) => void
  playerAnswered: (playerId: string, answerId: string) => void
  questionEnded: (correctAnswerId: string, scores: Record<string, number>) => void
  gameEnded: (finalScores: Array<{ playerId: string; name: string; score: number }>) => void
  error: (message: string) => void
}

export type ClientToServerEvents = {
  joinGame: (gamePin: string, playerName: string, callback: (success: boolean, error?: string) => void) => void
  startGame: (gamePin: string) => void
  submitAnswer: (gamePin: string, playerId: string, answerId: string) => void
  nextQuestion: (gamePin: string) => void
  endGame: (gamePin: string) => void
}
