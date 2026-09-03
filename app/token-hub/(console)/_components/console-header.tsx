'use client'

import Link from 'next/link'

import { CircleDollarSign, Command, Plus, Search } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { ConsoleThemeToggle } from '@/components/theme/console-theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useBalanceQuery, useProfileQuery } from '@/services/token-hub'

/** 控制台顶栏 —— 搜索 / 主题 / 创建 Key / 余额 / 用户 */
export function ConsoleHeader() {
  const { t } = useT('token-hub')
  // 余额与当前用户(非阻塞加载)
  const { data: balance } = useBalanceQuery()
  const { data: profile } = useProfileQuery()

  const amount = balance?.account_balance.amount_cny ? `¥${Number(balance.account_balance.amount_cny).toFixed(2)}` : ''
  const avatarText = profile?.name?.charAt(0) ?? 'U'

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-[#dce5f6]/85 bg-white/80 backdrop-blur-xl">
      <div className="flex h-17 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* 移动端 Logo */}
        <Link
          href="/token-hub/dashboard"
          aria-label="Token Hub 控制台"
          className="rounded-xl transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none lg:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-white/10 bg-[#10234f] shadow-[0_6px_16px_rgb(16_35_79/0.15)]">
              <span className="absolute h-4 w-4 rounded-[5px] border-2 border-[#e4e8f3] bg-[#10234f]" />
              <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-bl-lg bg-[#3059e8]" />
              <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-tr-lg bg-[#ffc45a]" />
            </span>
          </span>
        </Link>

        {/* CONTROL CENTER 徽标 */}
        <div className="hidden items-center gap-2 text-[11px] font-bold tracking-[0.13em] text-[#8a9bc0] uppercase sm:flex">
          <Command className="h-3.5 w-3.5 text-[#294fd4]" />
          {t('Dashboard Control Center')}
        </div>

        {/* 搜索控制台 */}
        <div className="mx-auto sm:ml-6 sm:mr-auto">
          <button
            type="button"
            title={t('Dashboard Console Search')}
            className="flex items-center gap-2 rounded-xl border border-[#dce5f6] bg-white px-3 py-2 text-[13px] text-[#8a9bc0] shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition hover:border-[#4269ee]/40 hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden min-w-36 text-left sm:block">{t('Dashboard Console Search')}</span>
            <span className="hidden rounded-md border border-[#dce5f6] bg-[#eef3ff] px-1.5 py-0.5 text-[10px] font-medium text-[#8a9bc0] md:block">⌘ K</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ConsoleThemeToggle />

          {/* 创建 Key */}
          <Link
            href="/token-hub/keys"
            className="hidden items-center gap-1.5 rounded-xl bg-[#294fd4] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_4px_12px_rgb(49_88_232/0.18)] transition hover:bg-[#4269ee] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none sm:flex"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('Dashboard Create Key')}
          </Link>

          {/* 余额 */}
          <Link
            href="/token-hub/profile"
            title={t('Dashboard Balance Title')}
            aria-label={t('Dashboard Balance Title')}
            className="group hidden h-9 items-center gap-2 rounded-xl bg-white px-2.5 transition-colors hover:bg-[#eef3ff] sm:flex"
          >
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[#eef3ff] text-[#294fd4] transition-colors group-hover:bg-[#294fd4] group-hover:text-white">
              <CircleDollarSign className="h-3.5 w-3.5" />
            </span>
            <span className="flex items-baseline gap-1.5 leading-none whitespace-nowrap">
              <span className="text-[11px] font-medium text-[#8a9bc0]">{t('Dashboard Balance')}</span>
              <span className="text-[13px] font-semibold text-[#0f1c3a] tabular-nums">{amount}</span>
            </span>
          </Link>

          {/* 用户 */}
          <button
            type="button"
            title={profile?.name ?? 'User'}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl transition-colors hover:bg-[#eef3ff] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
          >
            <Avatar
              size="sm"
              className="h-8 w-8"
            >
              {profile?.avatar_url && (
                <AvatarImage
                  src={profile.avatar_url}
                  alt={profile.name ?? 'User'}
                />
              )}
              <AvatarFallback className="bg-[#eef3ff] text-[13px] font-semibold text-[#294fd4]">{avatarText}</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  )
}
