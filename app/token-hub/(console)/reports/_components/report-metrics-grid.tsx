'use client'

import { Coins, Cpu, Gauge, ShieldCheck, Wallet, Zap } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { formatShare, formatTokens } from '@/lib/format'

/**
 * 成本分析 —— 核心指标 6 卡
 * 我的成本 / 我的请求 / 主要模型 / 平均每次成本 / 调用成功率 / 缓存命中
 */
export function ReportMetricsGrid({ summary }: { summary: TokenHub.CostReportSummary }) {
  const { t } = useT('token-hub')

  const cards = [
    {
      label: t('Reports Metric My Cost'),
      value: `¥${summary.my_cost.toFixed(1)}`,
      hint: t('Reports Metric My Cost Hint'),
      icon: Wallet,
      tone: 'bg-(--tc-blue-soft) text-(--tc-blue-bright)',
    },
    {
      label: t('Reports Metric Requests'),
      value: summary.my_requests.toLocaleString(),
      hint: t('Reports Metric Requests Hint'),
      icon: Coins,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: t('Reports Metric Main Model'),
      value: summary.main_model,
      hint: `${formatShare(summary.main_model_share)} ${t('Reports Metric Main Model Hint')}`,
      icon: Cpu,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      label: t('Reports Metric Avg Cost'),
      value: `¥${summary.avg_cost_per_request.toFixed(4)}`,
      hint: `${formatTokens(summary.avg_tokens_per_request)} Token / ${t('Reports Metric Avg Cost Hint')}`,
      icon: Gauge,
      tone: 'bg-violet-50 text-violet-600',
    },
    {
      label: t('Reports Metric Success'),
      value: formatShare(summary.success_rate),
      hint: t('Reports Metric Success Hint'),
      icon: ShieldCheck,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: t('Reports Metric Cache'),
      value: formatShare(summary.cache_hit_rate),
      hint: `${t('Reports Metric Cache Read')} ${formatTokens(summary.cache_read_tokens)} · ${t('Reports Metric Cache Write')} ${formatTokens(summary.cache_write_tokens)}`,
      icon: Zap,
      tone: 'bg-sky-50 text-sky-600',
    },
  ]

  return (
    <section className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map(({ label, value, hint, icon: Icon, tone }) => (
        <div
          key={label}
          className="group overflow-hidden rounded-[15px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgb(28_55_105/0.06)]"
        >
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 truncate pt-1 text-[13px] font-semibold tracking-[-0.012em] text-(--tc-strong)">
                {label}
              </p>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 truncate text-[20px] leading-none font-semibold tracking-tight text-(--tc-strong) tabular-nums">
              {value}
            </p>
            <p className="mt-2.5 truncate text-[11px] font-medium text-(--tc-muted)">{hint}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
