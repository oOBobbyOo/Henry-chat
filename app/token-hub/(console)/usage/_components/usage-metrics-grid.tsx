'use client'

import { Activity, BadgePercent, Coins, Gauge, ReceiptText, ShieldCheck, Timer, Wallet } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { formatShare, formatTokens } from '@/lib/format'

/**
 * 用量分析 —— 概览指标卡矩阵
 * Token 消耗 / 请求数 / 累计成本 / 平均首包延迟 / 平均总耗时 / 成功率 / 失败率 / 缓存命中
 */
export function UsageMetricsGrid({ summary, trend, granularity }: { summary: TokenHub.Summary; trend: TokenHub.TrendResponse; granularity: 'hour' | 'day' }) {
  const { t } = useT('token-hub')

  // 活跃窗口数(有请求流量的时间窗口)
  const activeWindows = trend.items.filter((i) => i.requests > 0).length
  const unitLabel = granularity === 'hour' ? t('Usage Active Unit Hour') : t('Usage Active Unit Day')

  const failureRate = Math.max(0, 1 - summary.success_rate)

  const cards = [
    {
      label: t('Usage Metric Tokens'),
      value: formatTokens(summary.tokens),
      hint: `${t('Usage Metric Active Windows')} ${activeWindows} ${unitLabel}`,
      icon: Coins,
      tone: 'bg-(--tc-blue-soft) text-(--tc-blue-bright)',
    },
    {
      label: t('Usage Metric Requests'),
      value: summary.requests.toLocaleString(),
      hint: t('Usage Metric Requests Hint'),
      icon: Activity,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: t('Usage Metric Cost'),
      value: `¥${summary.cost.toFixed(4)}`,
      hint: t('Usage Metric Cost Hint'),
      icon: Wallet,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      label: t('Usage Metric TTFT'),
      value: summary.p50_ttft_ms ? `${summary.p50_ttft_ms.toFixed(0)} ms` : '—',
      hint: `${t('Usage Metric TTFT Hint')} · P50`,
      icon: Timer,
      tone: 'bg-violet-50 text-violet-600',
    },
    {
      label: t('Usage Metric Total Time'),
      value: summary.avg_total_ms ? `${summary.avg_total_ms.toFixed(0)} ms` : '—',
      hint: t('Usage Metric Total Time Hint'),
      icon: Gauge,
      tone: 'bg-sky-50 text-sky-600',
    },
    {
      label: t('Usage Metric Success'),
      value: formatShare(summary.success_rate),
      hint: t('Usage Metric Success Hint'),
      icon: ShieldCheck,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: t('Usage Metric Failure'),
      value: formatShare(failureRate),
      hint: t('Usage Metric Failure Hint'),
      icon: BadgePercent,
      tone: 'bg-rose-50 text-rose-600',
    },
    {
      label: t('Usage Metric Cache'),
      value: `${formatTokens(summary.cache_read_tokens)} / ${formatTokens(summary.cache_write_tokens)}`,
      hint: `${t('Usage Metric Cache Read')} / ${t('Usage Metric Cache Write')}`,
      icon: ReceiptText,
      tone: 'bg-(--tc-blue-soft) text-(--tc-blue-bright)',
    },
  ]

  return (
    <section className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, hint, icon: Icon, tone }) => (
        <div
          key={label}
          className="group overflow-hidden rounded-[15px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgb(28_55_105/0.06)]"
        >
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 truncate pt-1 text-[13px] font-semibold tracking-[-0.012em] text-(--tc-strong)">{label}</p>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 truncate text-[24px] leading-none font-semibold tracking-[-0.03em] text-(--tc-strong) tabular-nums">{value}</p>
            <p className="mt-2.5 truncate text-[11px] font-medium text-(--tc-muted)">{hint}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
