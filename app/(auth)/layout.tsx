import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeModeToggle } from '@/components/theme/theme-mode-toggle'

import { AnimatedCharacters } from './_components/AnimatedCharacters'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid max-h-screen min-h-screen overflow-hidden lg:grid-cols-2">
      {/* Left Content Section with Animated Characters */}
      <div className="relative hidden flex-col justify-center bg-linear-to-br from-gray-400 via-gray-500 to-gray-600 p-12 text-white lg:flex dark:from-white/90 dark:via-white/80 dark:to-white/70 dark:text-gray-900">
        <div className="relative z-20 flex h-[500px] items-end justify-center">
          <AnimatedCharacters />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        ></div>
      </div>

      {/* Right Login Section */}
      <div className="bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>

      {/* Switcher */}
      <div className="absolute top-10 right-10 flex items-center gap-2">
        <ThemeModeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  )
}
