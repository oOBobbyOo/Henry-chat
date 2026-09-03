'use client'

import { BellRing } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { formatShare, formatTokens } from '@/lib/format'

/**
 * 成本信号卡 —— 本期需要关注
 * 最近周期变化 / 主要模型 / 平均单次成本 / 缓存命中率
 */
export function CostSignalsCard({ summary }: { summary: TokenHub.CostReportSummary }) {
  const { t } = useT('token-hub')

  const signals = [
    {
      label: t('Reports Signal Cycle'),
      value: t('Reports Signal No Baseline'),
      hint: t('Reports Signal Cycle Hint'),
      muted: true,
    },
    {
      label: t('Reports Signal Main Model'),
      value: summary.main_model,
      hint: `${formatShare(summary.main_model_share)} ${t('Reports Signal Main Model Hint')}`,
    },
    {
      label: t('Reports Signal Avg Cost'),
      value: `¥${summary.avg_cost_per_request.toFixed(4)}`,
      hint: `${formatTokens(summary.avg_tokens_per_request)} Token / ${t('Reports Signal Avg Cost Hint')}`,
    },
    {
      label: t('Reports Signal Cache'),
      value: formatShare(summary.cache_hit_rate),
      hint: `${t('Reports Signal Cache Read')} ${formatTokens(summary.cache_read_tokens)} · ${t('Reports Signal Cache Write')} ${formatTokens(summary.cache_write_tokens)}`,
    },
  ]

  return (
    <div className="flex h-full flex-col rounded-[15px] border border-[#dce5f6] bg-white p-5 shadow-[0_1px_2px_rgb(15_38_79/0.04)] sm:p-6">
      <div>
        <div className="flex items-center gap-2">
          <BellRing className="h-4 w-4 text-[#294fd4]" />
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0f1c3a]">{t('Reports Signals Title')}</h2>
        </div>
        <p className="mt-1.5 text-xs text-[#8a9bc0]">{t('Reports Signals Subtitle')}</p>
      </div>

      <div className="mt-5 space-y-3">
        {signals.map(({ label, value, hint, muted }) => (
          <div
            key={label}
            className="rounded-xl border border-[#dce5f6]/80 bg-[#f7f9fd]/70 p-3.5"
          >
            <p className="text-[11px] font-bold tracking-[0.06em] text-[#8a9bc0] uppercase">{label}</p>
            <p className={`mt-2 truncate text-[17px] leading-none font-semibold tracking-[-0.02em] tabular-nums ${muted ? 'text-[#8a9bc0]' : 'text-[#0f1c3a]'}`}>{value}</p>
            <p className="mt-2 text-[11px] leading-4 text-[#8a9bc0]">{hint}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
