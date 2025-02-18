'use client'

import { useEffect } from 'react'

export function TelegramInitializer() {
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const tg = window.Telegram.WebApp
			tg.ready()
			
			// Set some default styles for the Telegram WebApp
			
		}
	}, [])

	return null
} 