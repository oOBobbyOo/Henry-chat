'use client'

import { useMemo } from 'react'

import { usePathname } from 'next/navigation'

import { Compass } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { LanguageSwitcher } from './language-switcher'
import { ProfileDropdownMenu } from './profile-dropdown-menu'
import { AppThemeToggle } from './theme/app-theme-toggle'
import { TopUpCredits } from './top-up-credits'
import { WorkspaceChip } from './workspace-chip'

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
          {/* 工作区 chip(封装组件 WorkspaceChip,点击切换工作区) */}
          <WorkspaceChip />

          {/* 语言切换(封装组件 LanguageSwitcher,chip 形态含下拉) */}
          <LanguageSwitcher
            variant="chip"
            ariaLabel={t('Interface language')}
          />

          {/* 充值 + 积分 + 主题 + 头像 工具条 */}
          <div className="inline-flex h-10 items-center rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,252,0.96))] text-[#091423] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_1px_0_rgba(12,24,36,0.06),0_12px_26px_rgba(8,20,48,0.08)] backdrop-blur-[24px] dark:border-white/8 dark:bg-none dark:bg-white/4 dark:text-zinc-200 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(0,0,0,0.2),0_12px_26px_rgba(2,6,23,0.35)]">
            {/* 充值 + 积分(封装组件 TopUpCredits) */}
            <TopUpCredits />

            {/* 主题切换 */}
            <div className="my-1 inline-flex items-center px-1.5">
              <AppThemeToggle />
            </div>

            {/* 账户头像(封装组件 ProfileDropdownMenu,含下拉菜单) */}
            <ProfileDropdownMenu
              avatarFallback="B"
              userName={t('Account')}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
