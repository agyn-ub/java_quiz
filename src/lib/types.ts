export interface Question {
  id: number
  question: string
  score: number
  correctAnswer: string
  options: string[]
  difficulty: string
}

export interface Category {
  id: number
  name: string
  nameRu: string
  slug: string
} 