import { AppFooter } from '@/components/app-footer'
import { AppHeader } from '@/components/app-header'

export function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <AppFooter />
    </div>
  )
}
