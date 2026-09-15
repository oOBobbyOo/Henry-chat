'use client'

import { useMemo } from 'react'

import { usePathname } from 'next/navigation'

import { ChevronRight, Compass, Globe, LayoutDashboard, ShoppingBag } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { AppThemeToggle } from './theme/app-theme-toggle'

/**
 * 页面顶部横条(Site Header)
 * 顶部 sticky 圆角毛玻璃面板
 * 左侧:页面图标 + 标题 + 副标题; 右侧:工作区 chip / 语言 chip / 充值+积分+主题切换+头像工具条。
 */

/** 路由 → 标题/副标题(i18n key)映射 */
const HEADER_TITLES: Array<{ prefix: string; titleKey: string; hintKey: string }> = [
  { prefix: '/plaza', titleKey: 'Plaza', hintKey: 'Find inspiration to start creating' },
  { prefix: '/projects', titleKey: 'xFlow', hintKey: 'Smart canvas for creation' },
  { prefix: '/workbench', titleKey: 'Workbench', hintKey: 'Autonomous creation' },
  { prefix: '/3d', titleKey: '3D Modeling', hintKey: '3D asset pipeline' },
  { prefix: '/assets', titleKey: 'Assets', hintKey: 'Asset library' },
  { prefix: '/team', titleKey: 'My Team', hintKey: 'Collaborate with your team' },
]

export function SiteHeader() {
  const { t } = useT('common')
  const pathname = usePathname()

  const current = useMemo(() => {
    return (
      HEADER_TITLES.find(
        (item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`),
      ) ?? HEADER_TITLES[0]
    )
  }, [pathname])

  return (
    <header className="sticky top-3 z-40 px-4 lg:px-5">
      <div className="mx-auto flex min-h-[68px] w-full max-w-[calc(var(--app-content-max-width)-2rem)] items-center justify-between gap-4 rounded-[20px] border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(245,249,255,0.99))] px-4 py-2.5 shadow-[inset_0_-1px_0_rgba(12,24,36,0.06),0_16px_36px_rgba(8,20,48,0.07)] backdrop-blur-xl lg:max-w-[calc(var(--app-content-max-width)-2.5rem)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(15,22,36,0.94),rgba(9,14,25,0.92))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_36px_rgba(2,6,23,0.32)]">
        {/* 左侧:图标 + 标题 + 副标题 */}
        <div className="flex min-w-0 items-center gap-2.5 lg:gap-3">
          <div className="flex min-w-0 items-center gap-2.5 py-0.5">
            <Compass
              className="hidden h-5 w-5 shrink-0 text-[#2e4268] md:block dark:text-[#8fa5c4]"
              strokeWidth={1.75}
            />
            <div className="flex min-w-0 items-center gap-2.5">
              <h1 className="truncate text-[22px] leading-none font-semibold tracking-[-0.025em] text-[#091423] dark:text-[#eef4ff]">
                {t(current.titleKey)}
              </h1>
              <p className="max-w-[20ch] truncate text-[12px] leading-[1.35] text-[#4a6080] dark:text-[#7a8db0]">
                {t(current.hintKey)}
              </p>
            </div>
          </div>
        </div>

        {/* 右侧:工作区 chip / 语言 chip / 工具条 */}
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
          {/* 工作区 chip */}
          <button
            type="button"
            aria-label={t('Switch workspace')}
            className="inline-flex h-9 items-center gap-2.5 rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,251,0.96))] px-3.5 text-[12px] text-[#091423] shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_1px_0_rgba(12,24,36,0.06),0_10px_24px_rgba(8,20,48,0.07)] backdrop-blur-2xl transition hover:border-[rgba(93,175,206,0.35)] hover:bg-[linear-gradient(180deg,rgba(252,254,255,1),rgba(240,247,253,0.98))] dark:border-white/8 dark:bg-white/4 dark:text-zinc-200 dark:hover:border-white/14 dark:hover:bg-white/8"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(250,252,255,0.98),rgba(239,245,251,0.96))] text-[#091423] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_1px_0_rgba(12,24,36,0.05)] dark:border-white/8 dark:bg-white/6 dark:text-zinc-300">
              <LayoutDashboard
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            </span>
            <span className="flex max-w-[224px] min-w-0 items-center gap-2">
              <span className="truncate text-left text-[12px] text-[#091423] dark:text-[#eef4ff]">
                {t('Workspace')}
              </span>
              <span className="shrink-0 text-[12px] text-[#4e6585] dark:text-[#6b7f9d]">
                · {t('Admin')}
              </span>
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-[#4e6585] transition-transform duration-200 dark:text-[#6b7f9d]"
                strokeWidth={1.75}
              />
            </span>
          </button>

          {/* 语言 chip */}
          <button
            type="button"
            aria-label={t('Interface language')}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,251,0.96))] px-3 text-[12px] font-medium tracking-[0.01em] text-[#091423] shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_1px_0_rgba(12,24,36,0.06),0_10px_24px_rgba(8,20,48,0.07)] backdrop-blur-[22px] transition hover:border-[rgba(93,175,206,0.35)] hover:bg-[linear-gradient(180deg,rgba(252,254,255,1),rgba(240,247,253,0.98))] dark:border-white/8 dark:bg-white/4 dark:text-zinc-200 dark:hover:border-white/14 dark:hover:bg-white/8"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(250,252,255,0.98),rgba(239,245,251,0.96))] text-[#4a6080] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_1px_0_rgba(12,24,36,0.05)] dark:border-white/8 dark:bg-white/6 dark:text-[#8fa5c4]">
              <Globe
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            </span>
            <span
              title={t('Simplified Chinese')}
              className="max-w-[104px] truncate"
            >
              {t('Simplified Chinese')}
            </span>
            <ChevronRight
              className="h-3 w-3 shrink-0 text-[#4a6080] transition-transform duration-200 dark:text-[#7a8db0]"
              strokeWidth={1.75}
            />
          </button>

          {/* 充值 + 积分 + 主题 + 头像 工具条 */}
          <div className="inline-flex h-10 items-center rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,252,0.96))] text-[#091423] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_1px_0_rgba(12,24,36,0.06),0_12px_26px_rgba(8,20,48,0.08)] backdrop-blur-[24px] dark:border-white/8 dark:bg-white/4 dark:text-zinc-200">
            {/* 充值 + 积分 */}
            <button
              type="button"
              aria-label={t('Top up')}
              className="group relative inline-flex h-full min-w-0 items-center gap-2 overflow-hidden rounded-l-full px-1.5 pr-3.5 transition hover:bg-[rgba(15,23,42,0.04)] focus-visible:ring-2 focus-visible:ring-[rgba(93,175,206,0.4)] focus-visible:outline-none focus-visible:ring-inset dark:hover:bg-white/6"
            >
              <span className="inline-flex h-7 shrink-0 items-center gap-1 overflow-hidden rounded-full bg-[linear-gradient(180deg,#ffd98a,#f4bc57)] px-2 text-[12px] font-semibold tracking-[0.08em] text-[#3b2500] [text-shadow:0_1px_0_rgba(255,222,140,0.55)]">
                <ShoppingBag
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                />
                <span className="inline-flex min-w-0 items-baseline truncate">
                  {t('Membership from')}
                  <span className="mx-0.5 text-[15px] leading-none font-extrabold tracking-normal text-[#c8102e] [text-shadow:0_1px_0_rgba(255,222,140,0.7),0_0_6px_rgba(200,16,46,0.32)]">
                    6
                  </span>
                  {t('Percent off')}
                </span>
              </span>
              <span className="inline-flex h-8 items-center gap-2.5 overflow-hidden rounded-full px-3.5 text-[13px] font-semibold text-[#92701a] transition duration-200 group-hover:-translate-y-[0.5px] group-hover:brightness-[1.03] dark:text-[#d9b45a]">
                <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center transition duration-200 group-hover:scale-[1.04]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 text-[#c8921e]"
                    strokeWidth="1.75"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="currentColor"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9.15"
                      fill="none"
                      stroke="rgba(255,248,222,0.42)"
                      strokeWidth="1.1"
                    />
                    <rect
                      x="8.9"
                      y="8.9"
                      width="6.2"
                      height="6.2"
                      rx="1.15"
                      transform="rotate(45 12 12)"
                      fill="#4b3512"
                    />
                  </svg>
                </span>
                <span>55</span>
              </span>
            </button>

            {/* 主题切换 */}
            <div className="my-1 inline-flex items-center px-1.5">
              <AppThemeToggle />
            </div>

            {/* 账户头像 */}
            <button
              type="button"
              aria-haspopup="menu"
              className="inline-flex h-full min-w-0 items-center gap-2 rounded-r-full pr-3.5 pl-1.5 transition hover:bg-[rgba(15,23,42,0.04)] focus-visible:ring-2 focus-visible:ring-[rgba(93,175,206,0.4)] focus-visible:outline-none focus-visible:ring-inset dark:hover:bg-white/6"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(180deg,rgba(250,252,255,0.98),rgba(239,245,251,0.96))] ring-1 ring-[rgba(12,24,36,0.08)] ring-inset dark:bg-white/8 dark:ring-white/10">
                <span className="text-[11px] font-bold text-[#3867ff] dark:text-[#7fb2ff]">B</span>
              </span>
              <span className="max-w-[112px] truncate text-[12px] text-[#091423] dark:text-[#eef4ff]">
                {t('Account')}
              </span>
              <ChevronRight
                className="h-3 w-3 shrink-0 text-[#4a6080] transition-transform duration-200 dark:text-[#7a8db0]"
                strokeWidth={1.75}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
