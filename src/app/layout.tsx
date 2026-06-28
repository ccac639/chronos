import type { Metadata, Viewport } from 'next'
import './globals.css'
import { LangProvider } from '@/lib/lang-context'

export const metadata: Metadata = {
  title: '风尘录 Chronos',
  description: 'AI驱动的沉浸式历史模拟学习平台',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#161b22',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-xuan text-ink-800 font-sans">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
