interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready(): void
        close(): void
        expand(): void
        MainButton: {
          show(): void
          hide(): void
          setText(text: string): void
          onClick(fn: () => void): void
          offClick(fn: () => void): void
          enable(): void
          disable(): void
        }
        BackButton: {
          show(): void
          hide(): void
          onClick(fn: () => void): void
          offClick(fn: () => void): void
        }
        initDataUnsafe: {
          user?: TelegramUser
          start_param?: string
          auth_date?: number
          hash?: string
        }
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        headerColor: string
        backgroundColor: string
        colorScheme: 'light' | 'dark'
        platform: string
        setHeaderColor(color: string): void
        setBackgroundColor(color: string): void
        enableClosingConfirmation(): void
        disableClosingConfirmation(): void
        onEvent(eventType: string, eventHandler: () => void): void
        offEvent(eventType: string, eventHandler: () => void): void
        sendData(data: string): void
        openLink(url: string, options?: { try_instant_view?: boolean }): void
        openTelegramLink(url: string): void
        showAlert(message: string, callback?: () => void): void
        showConfirm(message: string, callback?: (confirmed: boolean) => void): void
        showPopup(params: {
          title?: string
          message: string
          buttons?: Array<{
            id: string | number
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
            text: string
          }>
        }, callback?: (buttonId: string | number) => void): void
      }
    }
  }
}

export {} 