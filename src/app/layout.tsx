import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TelegramScript } from '@/components/telegram/TelegramScript'
import { TelegramProvider } from '@/lib/context/telegram-context'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Real Madrid Quiz",
  description: "Test your knowledge about Real Madrid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <TelegramScript />
        <TelegramProvider>
          {children}
        </TelegramProvider>
      </body>
    </html>
  );
}
