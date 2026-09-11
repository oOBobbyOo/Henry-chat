import './globals.css'
import { dir } from 'i18next'
import { I18nProvider } from 'next-i18next/client'
import { initServerI18next, getT, getResources } from 'next-i18next/server'
import { Toaster } from 'sonner'

import i18nConfig from '@/i18n.config'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

initServerI18next(i18nConfig)

export async function generateMetadata() {
  return {
    title: 'HenryStudio',
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
        className={`h-full antialiased`}
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
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </I18nProvider>
  )
}
