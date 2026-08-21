import { AppLayout } from '@/components/app-layout'

export default function TokenHubLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppLayout>{children}</AppLayout>
}
