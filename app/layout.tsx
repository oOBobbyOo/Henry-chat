import './globals.css'
import { dir } from 'i18next'
import { I18nProvider } from 'next-i18next/client'
import { initServerI18next, getT, getResources } from 'next-i18next/server'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import i18nConfig from '@/i18n.config'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

initServerI18next(i18nConfig)

export async function generateMetadata() {
  return {
    title: 'Henry AI chat',
    description: 'AI Chat application',
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { i18n, lng } = await getT()
  const resources = getResources(i18n)

  return (
    <I18nProvider
      language={lng}
      resources={resources}
    >
      <html
        lang={lng}
        dir={dir(lng)}
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="flex h-full flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <main className="h-full">{children}</main>

              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "Helvetica Neue", Arial, sans-serif',
                  },
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </I18nProvider>
  )
}
