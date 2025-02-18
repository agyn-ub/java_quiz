'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'

interface QuizResult {
  id: number
  score: number
  completedAt: string
  club: {
    id: number
    name: string
    icon: string
  }
}

export function UserResults() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const telegramId = localStorage.getItem('telegram_id')
        const response = await fetch(`/api/quiz/user-results?telegramId=${telegramId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch results')
        }

        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Error fetching results:', error)
        setError('Не удалось загрузить результаты')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton className="h-24" count={3} />
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <p className="text-gray-600">У вас пока нет результатов</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-4 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src={result.club.icon}
                  alt={result.club.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">{result.club.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(result.completedAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{result.score}</p>
              <p className="text-sm text-gray-500">правильных</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 