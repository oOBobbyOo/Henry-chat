'use client'

import { Gauge, Infinity as InfinityIcon, KeyRound, Wallet } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { formatTokens } from '@/lib/format'

/**
 * 账户概览卡 —— 当前账号的实时摘要
 * 账户余额 / Token 配额 / 近 30 天用量 / API Keys(行式,对齐生产)
 */
export function AccountOverviewCard({ balance, summary, activeKeyCount }: { balance?: TokenHub.BalanceResponse; summary: TokenHub.Summary; activeKeyCount: number }) {
  const { t } = useT('token-hub')

  const amount = balance?.account_balance.amount_cny ? Number(balance.account_balance.amount_cny).toFixed(2) : '—'
  const unlimited = balance?.quota?.unlimited ?? balance?.unlimited ?? true

  const rows = [
    {
      label: t('Profile Balance'),
      hint: t('Profile Balance Hint'),
      value: `¥${amount}`,
      icon: Wallet,
      tone: 'bg-(--tc-blue-soft) text-(--tc-blue-bright)',
    },
    {
      label: t('Profile Quota'),
      hint: t('Profile Quota Hint'),
      value: unlimited ? t('Profile Quota Unlimited') : formatTokens(balance?.quota?.remaining_tokens ?? 0),
      icon: InfinityIcon,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: t('Profile Usage30'),
      hint: `${summary.requests.toLocaleString()} ${t('Profile Usage30 Hint')}`,
      value: formatTokens(summary.tokens),
      icon: Gauge,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      label: t('Profile Keys'),
      hint: t('Profile Keys Hint'),
      value: `${activeKeyCount} ${t('Profile Keys Unit')}`,
      icon: KeyRound,
      tone: 'bg-violet-50 text-violet-600',
    },
  ]

  return (
    <div className="overflow-hidden rounded-[15px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      <div className="px-5 pt-5 sm:px-6">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-(--tc-strong)">{t('Profile Overview')}</h2>
        <p className="mt-1 text-xs text-(--tc-muted)">{t('Profile Overview Desc')}</p>
      </div>

      <div className="px-5 pb-2 pt-1 sm:px-6">
        {rows.map(({ label, hint, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="flex items-center gap-3 border-b border-(--tc-border) py-4 last:border-b-0"
          >
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-(--tc-strong)">{label}</p>
              <p className="mt-0.5 truncate text-[11px] text-(--tc-muted)">{hint}</p>
            </div>
            <p className="shrink-0 text-[15px] font-semibold text-(--tc-strong) tabular-nums">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
