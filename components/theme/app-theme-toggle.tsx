import { Moon, Sun } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { useTheme } from 'next-themes'

export function AppThemeToggle() {
  const { t } = useT('common')

  const { resolvedTheme, setTheme } = useTheme()

  const isLight = resolvedTheme !== 'dark'

  return (
    <div
      role="group"
      aria-label={t('Theme')}
      className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-[rgba(12,24,36,0.08)] bg-[rgba(15,23,42,0.04)] p-[3px] text-[#4e6585] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_1px_0_rgba(12,24,36,0.05)] transition-colors dark:border-white/8 dark:bg-white/6 dark:text-[#8fa5c4]"
    >
      <button
        type="button"
        aria-pressed={isLight}
        title={t('Light')}
        onClick={() => setTheme('light')}
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition focus-visible:ring-2 focus-visible:outline-none ${
          isLight
            ? 'bg-white text-[#091423] shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:bg-white/12 dark:text-white'
            : 'hover:text-zinc-800 dark:hover:text-zinc-200'
        }`}
      >
        <Sun
          className="h-3.5 w-3.5"
          strokeWidth={1.9}
        />
      </button>
      <button
        type="button"
        aria-pressed={!isLight}
        title={t('Dark')}
        onClick={() => setTheme('dark')}
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition focus-visible:ring-2 focus-visible:outline-none ${
          !isLight
            ? 'bg-white text-[#091423] shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:bg-white/12 dark:text-white'
            : 'hover:text-zinc-800 dark:hover:text-zinc-200'
        }`}
      >
        <Moon
          className="h-3.5 w-3.5"
          strokeWidth={1.9}
        />
      </button>
    </div>
  )
}
