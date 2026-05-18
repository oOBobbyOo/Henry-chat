export default function RankingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="relative mx-auto w-full max-w-[1280px] space-y-8 px-3 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 xl:px-8">{children}</div>
}
