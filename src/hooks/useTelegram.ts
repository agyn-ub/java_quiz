'use client'

import { useEffect, useState } from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready(): void
        initDataUnsafe: {
          user?: TelegramUser
        }
      }
    }
  }
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Tell Telegram WebApp we're ready
    window.Telegram?.WebApp?.ready()

    // Get user data
    const webAppUser = window.Telegram?.WebApp?.initDataUnsafe?.user
    if (webAppUser) {
      setUser(webAppUser)
    }
  }, [])

  return { user }
} 