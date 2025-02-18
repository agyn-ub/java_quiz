interface WebAppUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
}

interface WebApp {
	initData: string
	initDataUnsafe: {
		user?: WebAppUser
	}
	ready: () => void
	expand: () => void
	close: () => void
}

declare global {
	interface Window {
		Telegram: {
			WebApp: WebApp
		}
	}
}

export {} 