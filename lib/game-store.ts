import useSWR from "swr"

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
  title: string
  questions: Question[]
}

export type Player = {
  id: string
  name: string
  joinedAt: number
  score?: number
}

export type GameState = {
  gamePin: string | null
  quiz: Quiz | null
  players: Player[]
  currentQuestionIndex: number
  gameStarted: boolean
  gameEnded: boolean
  showResults: boolean
}

// Local storage fetcher
const fetcher = (key: string) => {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

// Custom hooks for game state
export function useGamePin() {
  const { data, mutate } = useSWR("gamePin", fetcher, {
    refreshInterval: 500,
    fallbackData: null,
  })

  const setGamePin = (pin: string) => {
    localStorage.setItem("gamePin", pin)
    mutate(pin)
  }

  return { gamePin: data, setGamePin }
}

export function useQuiz() {
  const { data, mutate } = useSWR("currentQuiz", fetcher, {
    refreshInterval: 500,
    fallbackData: null,
  })

  const setQuiz = (quiz: Quiz) => {
    localStorage.setItem("currentQuiz", JSON.stringify(quiz))
    mutate(quiz)
  }

  return { quiz: data, setQuiz }
}

export function usePlayers() {
  const { data, mutate } = useSWR("gamePlayers", fetcher, {
    refreshInterval: 500,
    fallbackData: [],
  })

  const addPlayer = (player: Player) => {
    const players = data || []
    const updated = [...players, player]
    localStorage.setItem("gamePlayers", JSON.stringify(updated))
    mutate(updated)
  }

  const clearPlayers = () => {
    localStorage.setItem("gamePlayers", JSON.stringify([]))
    mutate([])
  }

  return { players: data || [], addPlayer, clearPlayers }
}

export function useCurrentPlayer() {
  const { data, mutate } = useSWR("currentPlayer", fetcher, {
    fallbackData: null,
  })

  const setCurrentPlayer = (player: Player) => {
    localStorage.setItem("currentPlayer", JSON.stringify(player))
    mutate(player)
  }

  const clearCurrentPlayer = () => {
    localStorage.removeItem("currentPlayer")
    mutate(null)
  }

  return { currentPlayer: data, setCurrentPlayer, clearCurrentPlayer }
}

export function useGameState() {
  const { data: gameStarted, mutate: mutateStarted } = useSWR("gameStarted", fetcher, {
    refreshInterval: 100,
    fallbackData: false,
  })

  const { data: gameEnded, mutate: mutateEnded } = useSWR("gameEnded", fetcher, {
    refreshInterval: 100,
    fallbackData: false,
  })

  const { data: showResults, mutate: mutateResults } = useSWR("showResults", fetcher, {
    refreshInterval: 100,
    fallbackData: false,
  })

  const { data: currentQuestionIndex, mutate: mutateIndex } = useSWR("currentQuestionIndex", fetcher, {
    refreshInterval: 100,
    fallbackData: 0,
  })

  const startGame = () => {
    localStorage.setItem("gameStarted", "true")
    mutateStarted(true)
  }

  const endGame = () => {
    localStorage.setItem("gameEnded", "true")
    mutateEnded(true)
  }

  const setShowResults = (show: boolean) => {
    localStorage.setItem("showResults", String(show))
    mutateResults(show)
  }

  const setCurrentQuestionIndex = (index: number) => {
    localStorage.setItem("currentQuestionIndex", String(index))
    mutateIndex(index)
  }

  const resetGame = () => {
    localStorage.removeItem("gameStarted")
    localStorage.removeItem("gameEnded")
    localStorage.removeItem("showResults")
    localStorage.removeItem("currentQuestionIndex")
    localStorage.removeItem("playerAnswers")
    localStorage.removeItem("playerScore")
    mutateStarted(false)
    mutateEnded(false)
    mutateResults(false)
    mutateIndex(0)
  }

  return {
    gameStarted: gameStarted === "true" || gameStarted === true,
    gameEnded: gameEnded === "true" || gameEnded === true,
    showResults: showResults === "true" || showResults === true,
    currentQuestionIndex:
      typeof currentQuestionIndex === "string" ? Number.parseInt(currentQuestionIndex) : currentQuestionIndex || 0,
    startGame,
    endGame,
    setShowResults,
    setCurrentQuestionIndex,
    resetGame,
  }
}

export function usePlayerScore() {
  const { data, mutate } = useSWR("playerScore", fetcher, {
    fallbackData: 0,
  })

  const addScore = (points: number) => {
    const currentScore = typeof data === "string" ? Number.parseInt(data) : data || 0
    const newScore = currentScore + points
    localStorage.setItem("playerScore", String(newScore))
    mutate(newScore)
  }

  const resetScore = () => {
    localStorage.setItem("playerScore", "0")
    mutate(0)
  }

  return {
    score: typeof data === "string" ? Number.parseInt(data) : data || 0,
    addScore,
    resetScore,
  }
}
