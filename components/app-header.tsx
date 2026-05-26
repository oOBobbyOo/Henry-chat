import Link from 'next/link'

import { Award } from 'lucide-react'

import { ProfileDropdownMenu } from './profile-dropdown-menu'
import { ThemeToggle } from './theme/theme-toggle'

export function AppHeader() {
  return (
    <header className="sticky top-3 z-50 px-4 lg:px-5">
      <div className="bg-color-none mx-auto flex min-h-[68px] w-full max-w-[calc(var(--app-content-max-width)-2rem)] items-center justify-between gap-4 rounded-[20px] border border-gray-200 bg-transparent px-4 py-2.5 shadow-sm saturate-145 backdrop-blur-xl lg:max-w-[calc(var(--app-content-max-width)-2.5rem)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(13,20,33,0.78),rgba(8,13,24,0.68))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_42px_rgba(2,6,23,0.2)]">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-2.5 lg:gap-3">
          <div className="flex min-w-0 flex-col justify-center py-0.5">
            <span className="inline-flex h-5 w-fit items-center self-start rounded-full border border-gray-200 bg-gray-100/50 px-2 text-[10px] tracking-[0.14em] text-gray-400 uppercase dark:border-white/6 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] dark:text-(--ui-text-tertiary) dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              Plaza
            </span>
            <div className="mt-1 flex min-w-0 items-center gap-2.5">
              <h1
                title="广场"
                className="font-ui-display truncate text-[22px] leading-none font-semibold tracking-tight text-gray-900 dark:text-(--ui-text-primary)"
              >
                广场
              </h1>
              <p
                title="先找方向，再进入真正的生产闭环"
                className="max-w-[20ch] truncate text-[11px] leading-[1.35] text-gray-500 dark:text-(--ui-text-muted)"
              >
                方向确认后生产
              </p>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="inline-flex h-10 items-center overflow-hidden rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm backdrop-blur-xl dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(12,20,34,0.96),rgba(8,13,24,0.9))] dark:text-zinc-100 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_38px_rgba(2,8,24,0.24)]">
            <Link
              href="/rankings"
              className="inline-flex h-full min-w-0 items-center gap-1.5 px-3 text-[12px] font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-cyan-300/40 focus-visible:outline-none focus-visible:ring-inset dark:text-zinc-200 dark:hover:bg-white/4 dark:hover:text-white"
            >
              <Award className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-white/70" />
              <span className="hidden max-w-[86px] truncate sm:inline">排行榜</span>
            </Link>
            <span className="h-5 w-px shrink-0 bg-gray-200 dark:bg-white/8"></span>
            {/* Theme toggle */}
            <ThemeToggle />
            <span className="h-5 w-px shrink-0 bg-gray-200 dark:bg-white/8"></span>
            {/* Profile */}
            <ProfileDropdownMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
