'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BarChart3, Blocks, Bot, CircleHelp, LayoutDashboard, Plug, ScanLine, Users, Wallet, Webhook } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { useHealthQuery } from '@/services/token-hub'

/** 控制台侧边栏 —— 导航 + 网关健康状态 + 快速开始入口 */
export function ConsoleSidebar() {
  const { t } = useT('token-hub')
  const pathname = usePathname()
  useHealthQuery()

  // 控制台统一位于 /token-hub 前缀下,navItems href 均携带完整前缀,直接基于 pathname 匹配
  const isActive = (href: string) => pathname === href || (href !== '/token-hub/dashboard' && pathname.startsWith(`${href}/`))

  const navItems = [
    { href: '/token-hub/dashboard', label: t('Dashboard Overview'), icon: LayoutDashboard },
    { href: '/token-hub/chat', label: t('Agent Chat'), icon: Bot },
    { href: '/token-hub/plaza', label: t('Model Plaza'), icon: ScanLine },
    { href: '/token-hub/keys', label: t('API Keys'), icon: Webhook },
    { href: '/token-hub/usage', label: t('Usage Analytics'), icon: BarChart3 },
    { href: '/token-hub/reports', label: t('Cost Reports'), icon: Wallet },
    { href: '/token-hub/mcp-market', label: t('MCP Market'), icon: Blocks },
    { href: '/token-hub/integrations', label: t('Integrations'), icon: Plug },
    { href: '/token-hub/profile', label: t('Profile'), icon: Users },
  ]

  return (
    <aside
      aria-label="控制台导航"
      className="fixed inset-y-0 left-0 z-30 hidden w-67 flex-col overflow-hidden border-r border-[#dce5f6] bg-white/95 py-5 backdrop-blur lg:flex"
    >
      {/* Logo */}
      <div className="flex shrink-0 items-center justify-between gap-3 px-4">
        <Link
          href="/token-hub/dashboard"
          aria-label="Token Hub 控制台"
          className="shrink-0 rounded-lg px-2 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
        >
          <span className="inline-flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-white/10 bg-[#10234f] shadow-[0_6px_16px_rgb(16_35_79/0.15)]">
              <span className="absolute h-4 w-4 rounded-[5px] border-2 border-[#e4e8f3] bg-[#10234f]" />
              <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-bl-lg bg-[#3059e8]" />
              <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-tr-lg bg-[#ffc45a]" />
            </span>
            <span className="leading-none">
              <span className="block text-[15px] font-semibold tracking-[-0.035em] text-[#0f1c3a]">{t('Token Hub')}</span>
              <span className="mt-1 block text-[9px] font-bold tracking-[0.16em] text-[#8a9bc0] uppercase">{t('AI Gateway')}</span>
            </span>
          </span>
        </Link>
      </div>

      {/* 导航 */}
      <nav
        id="console-sidebar-navigation"
        aria-label="工作区导航"
        className="scrollbar-hidden mt-10 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 pr-1 pl-2"
      >
        <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.14em] text-[#8a9bc0] uppercase">{t('Dashboard Workspace')}</p>
        <div className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none ${
                  active ? 'bg-[#edf1ff] text-[#3867ff]' : 'text-[#5b6b8c] hover:bg-[#f4f7ff] hover:text-[#3867ff]'
                }`}
              >
                <Icon
                  strokeWidth={2.25}
                  className={`h-4 w-4 shrink-0 ${active ? 'text-[#3867ff]' : 'text-[#8a9bc0] group-hover:text-[#3867ff]'}`}
                />
                <span className="min-w-0 truncate">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* 底部状态 */}
      <div className="px-2">
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2.5 px-2 py-2 text-[13px] font-semibold text-emerald-600"
        >
          <span
            aria-hidden
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500"
          />
          <span>{t('Dashboard Gateway Healthy')}</span>
          <span className="sr-only">{t('Dashboard Health Desc')}</span>
        </div>
        <Link
          href="/token-hub/integrations"
          aria-label={t('Quick Start Guide')}
          className="mt-1 flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#8a9bc0] transition-colors hover:bg-[#eef3ff] hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
        >
          <CircleHelp className="h-3.5 w-3.5" />
          <span>{t('Quick Start Guide')}</span>
        </Link>
      </div>
    </aside>
  )
}
