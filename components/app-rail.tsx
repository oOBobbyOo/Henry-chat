'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Compass, Folder, Navigation, Paintbrush, Palette, UsersRound } from 'lucide-react'
import { useT } from 'next-i18next/client'

/**
 * 左侧悬浮导航栏(App Rail)
 * 品牌 logo 区 + 图标/文字导航项(激活态浅蓝高亮) + 底部社交/登录。
 */

/** 导航项定义 */
const RAIL_NAV_ITEMS = [
  { href: '/plaza', titleKey: 'Plaza', icon: Compass },
  { href: '/projects', titleKey: 'xFlow', icon: Navigation },
  { href: '/workbench', titleKey: 'Workbench', icon: Paintbrush },
  { href: '/3d', titleKey: '3D Modeling', icon: Palette },
  { href: '/assets', titleKey: 'Assets', icon: Folder },
  { href: '/team', titleKey: 'My Team', icon: UsersRound },
] as const

/** 判断导航项是否激活:href 与 pathname 同坐标系(无路由组前缀) */
function isRailItemActive(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

export function AppRail() {
  const { t } = useT('common')
  const pathname = usePathname()

  return (
    <aside className="fixed top-3 bottom-3 left-3 z-30 hidden w-[110px] flex-col rounded-[26px] border border-[rgba(12,24,36,0.05)] bg-white/90 px-2.5 py-3 shadow-[0_18px_34px_rgba(2,6,23,0.06)] backdrop-blur-xl xl:flex dark:border-white/6 dark:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_38px_rgba(2,6,23,0.3)]">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-3.5">
        {/* 品牌区 */}
        <Link
          href="/"
          aria-label={t('Back to home')}
          className="group block w-full rounded-[20px] transition focus-visible:ring-2 focus-visible:ring-[#3867ff]/30 focus-visible:outline-none"
        >
          <div className="relative overflow-hidden rounded-[22px] border border-[#dce5f6] bg-[linear-gradient(180deg,#0f1c3a,#16284a)] px-2.5 pt-3.5 pb-4 text-center transition duration-200 dark:border-white/8">
            <span
              aria-hidden
              className="absolute inset-x-3.5 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#3898bc] to-[#3867ff] text-[18px] font-bold text-white shadow-[0_10px_22px_rgba(56,103,255,0.35)] transition duration-200 group-hover:scale-[1.03]">
              H
            </span>
            <div className="mt-2.5 flex flex-col items-center">
              <p className="bg-gradient-to-b from-[#f4f9ff] via-[#6fd0ff] to-[#c4f1ee] bg-clip-text text-[20px] leading-none font-bold tracking-[-0.05em] text-transparent">Henry</p>
              <p className="mt-1.5 text-[11px] leading-none font-semibold tracking-[0.24em] text-[#4e6585] uppercase dark:text-[#8fa5c4]">Chat</p>
              <div className="mx-auto mt-2 h-px w-10 bg-gradient-to-r from-transparent via-[rgba(120,136,158,0.2)] to-transparent" />
              <p className="mt-2 max-w-[72px] text-center text-[10px] leading-[1.45] font-semibold tracking-[0.03em] text-[#71839a] dark:text-[#6b7f9d]">{t('Creation platform')}</p>
            </div>
          </div>
        </Link>

        <div className="mx-auto h-px w-10 bg-gradient-to-r from-transparent via-[rgba(120,136,158,0.2)] to-transparent" />

        {/* 导航项列表 */}
        <nav className="mt-0.5 flex min-h-0 w-full flex-1 flex-col gap-1.5 overflow-y-auto px-0.5 pb-1.5 [scrollbar-width:none]">
          {RAIL_NAV_ITEMS.map((item) => {
            const active = isRailItemActive(pathname, item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={t(item.titleKey)}
                aria-current={active ? 'page' : undefined}
                className={`group relative flex min-w-0 flex-col items-center gap-[5px] rounded-[20px] border px-1 pt-[7px] pb-[9px] transition duration-200 active:scale-[0.985] ${
                  active
                    ? 'border-[rgba(97,149,216,0.2)] bg-[linear-gradient(180deg,rgba(243,249,255,0.99),rgba(226,239,255,0.96))] text-[#3f7fd8] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_12px_24px_rgba(58,110,198,0.1)] dark:border-[rgba(97,149,216,0.25)] dark:bg-[linear-gradient(180deg,rgba(56,103,255,0.16),rgba(56,103,255,0.08))] dark:text-[#7fb2ff]'
                    : 'border-transparent text-[#6f829b] hover:-translate-y-px hover:border-[rgba(105,147,204,0.17)] hover:bg-[linear-gradient(180deg,rgba(249,252,255,0.98),rgba(236,244,253,0.9))] hover:text-[#557aa8] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_10px_18px_rgba(76,117,187,0.07)] dark:text-zinc-400 dark:hover:border-white/8 dark:hover:bg-white/4 dark:hover:text-zinc-200'
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center">
                  <span
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-[14px] border transition duration-200 ${
                      active
                        ? 'border-[rgba(76,139,226,0.28)] bg-[linear-gradient(180deg,rgba(122,183,255,0.28),rgba(59,130,246,0.16))] text-[#3f7fd8] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_20px_rgba(59,130,246,0.14)] dark:text-[#7fb2ff]'
                        : 'border-transparent text-[#7b8da4] group-hover:border-[rgba(109,156,222,0.2)] group-hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(235,244,255,0.82))] group-hover:text-[#557aa8] dark:text-zinc-400 dark:group-hover:border-white/8 dark:group-hover:bg-white/6'
                    }`}
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={1.75}
                    />
                  </span>
                </span>
                <span className="block w-full min-w-0 truncate text-center text-[13px] leading-[1.12] font-semibold tracking-[0.01em]">{t(item.titleKey)}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* 底部:登录入口 */}
      <div className="mt-3 flex justify-center">
        <Link
          href="/login"
          title={t('Sign in')}
          className="group flex h-12 w-12 items-center justify-center rounded-[16px] border border-[rgba(105,147,204,0.17)] bg-[linear-gradient(180deg,rgba(255,255,255,0.995),rgba(243,247,251,0.965))] text-[#557aa8] shadow-[inset_0_1px_0_rgba(255,255,255,1)] transition duration-200 hover:-translate-y-px hover:border-[rgba(97,149,216,0.2)] hover:text-[#3f7fd8] dark:border-white/8 dark:bg-white/4 dark:text-zinc-300 dark:hover:border-[rgba(97,149,216,0.25)] dark:hover:text-[#7fb2ff]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line
              x1="15"
              x2="3"
              y1="12"
              y2="12"
            />
          </svg>
        </Link>
      </div>
    </aside>
  )
}
