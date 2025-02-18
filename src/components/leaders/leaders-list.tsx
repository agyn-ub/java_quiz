'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Category {
  id: number
  name: string
  nameRu: string
  slug: string
}

interface Score {
  id: number
  score: number
  correctAnswers: number
  completedAt: string
  category: {
    id: number
    name: string
    nameRu: string
  }
  user: {
    firstName: string
    lastName: string | null
    username: string | null
  }
}

export function LeadersList() {
  const [scores, setScores] = useState<Score[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.categories)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Не удалось загрузить категории')
      }
    }
    fetchCategories()
  }, [])

  // Fetch scores based on selected category
  useEffect(() => {
    const fetchScores = async () => {
      try {
        setIsLoading(true)
        
        const url = selectedCategory 
          ? `/api/quiz/results?categoryId=${selectedCategory}`
          : '/api/quiz/results'
        
        const response = await fetch(url, { cache: 'no-store' })
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard')
        }

        setScores(data.topScores || [])
        setError(null)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setError('Не удалось загрузить таблицу лидеров')
      } finally {
        setIsLoading(false)
      }
    }

    fetchScores()
  }, [selectedCategory])

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Попробовать снова
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Все категории
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.nameRu}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Загрузка результатов...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((score, index) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center font-semibold text-gray-600">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {score.user.firstName} {score.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {score.category.nameRu}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    {score.score} баллов
                  </p>
                  <p className="text-sm text-gray-500">
                    {score.correctAnswers} правильных
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 