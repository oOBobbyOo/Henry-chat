'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex h-full min-w-0 cursor-pointer items-center gap-1.5 px-3 text-[12px] font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-cyan-300/40 focus-visible:outline-none focus-visible:ring-inset dark:text-zinc-200 dark:hover:bg-white/4 dark:hover:text-white"
    >
      <Sun className="size-3.5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-3.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="hidden sm:dark:inline">亮色</span>
      <span className="hidden sm:inline dark:hidden">暗色</span>
    </button>
  )
}
