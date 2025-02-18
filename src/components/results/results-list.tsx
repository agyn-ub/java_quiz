'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTelegram } from '@/hooks/useTelegram'
import { Category } from '@/lib/types'

interface Score {
  id: number
  score: number
  correctAnswers: number
  completedAt: string
  category: {
    id: number
    name: string
    nameRu: string
  } | null
  user: {
    firstName: string
    lastName: string | null
    username: string | null
  }
}

export function ResultsList() {
  const { user } = useTelegram()
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
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch scores based on selected category
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const url = user 
          ? `/api/quiz/results?telegramId=${user.id}${selectedCategory ? `&categoryId=${selectedCategory}` : ''}`
          : selectedCategory 
            ? `/api/quiz/results?categoryId=${selectedCategory}`
            : '/api/quiz/results'
        
        const response = await fetch(url, { cache: 'no-store' })
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch results')
        }
        
        setScores(data.topScores)
      } catch (error) {
        console.error('Error fetching results:', error)
        setError('Произошла ошибка при загрузке результатов')
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchScores()
    }
  }, [user, selectedCategory])

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>
  }

  if (!user) return null

  return (
    <div className="space-y-6">
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
          {scores.map((score) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {score.category?.nameRu}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(score.completedAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                  </p>
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