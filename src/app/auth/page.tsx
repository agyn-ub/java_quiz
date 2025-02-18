'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/hooks/useTelegram'
import { LoadingState } from '@/components/ui/loading-state'

export default function Auth() {
  const router = useRouter()
  const { user } = useTelegram()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || isAuthenticating) return

    const authenticate = async () => {
      try {
        setIsAuthenticating(true)
        setAuthError(null)

        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Authentication failed')
        }

        // Store user data in localStorage
        localStorage.setItem('telegram_id', user.id.toString())
        
        // Redirect to home page
        router.replace('/')
      } catch (error) {
        console.error('Authentication error:', error)
        setAuthError(error instanceof Error ? error.message : 'Authentication failed')
        setIsAuthenticating(false)
      }
    }

    authenticate()
  }, [user, router, isAuthenticating])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Авторизация через Telegram
        </h1>

        {authError ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">{authError}</p>
            <button
              onClick={() => {
                setIsAuthenticating(false)
                setAuthError(null)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        ) : (
          <div className="text-center">
            {isAuthenticating ? (
              <LoadingState text="Авторизация..." />
            ) : (
              <p className="text-gray-600">
                Пожалуйста, войдите через Telegram
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 