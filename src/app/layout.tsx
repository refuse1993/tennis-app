import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '테니스랭크',
  description: '테니스 매치 기록 및 랭킹 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900`}>
      <Providers>{children}</Providers>
      </body>
    </html>
  )
}