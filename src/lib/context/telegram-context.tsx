'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface TelegramContext {
	user: WebAppUser | null
	isLoading: boolean
}

interface WebAppUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
}

export const TelegramContext = createContext<TelegramContext>({
	user: null,
	isLoading: true,
})

export function TelegramProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<WebAppUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const initializeWebApp = () => {
			if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
				const tg = window.Telegram.WebApp
				tg.ready()
				
				if (tg.initDataUnsafe?.user) {
					setUser(tg.initDataUnsafe.user)
					// Save user to database
					fetch('/api/auth/telegram', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							telegramId: tg.initDataUnsafe.user.id.toString(),
							firstName: tg.initDataUnsafe.user.first_name,
							lastName: tg.initDataUnsafe.user.last_name,
							username: tg.initDataUnsafe.user.username,
						}),
					})
				}
			}
			setIsLoading(false)
		}

		const timer = setTimeout(initializeWebApp, 1000)
		return () => clearTimeout(timer)
	}, [])

	return (
		<TelegramContext.Provider value={{ user, isLoading }}>
			{children}
		</TelegramContext.Provider>
	)
}

export const useTelegram = () => useContext(TelegramContext) 