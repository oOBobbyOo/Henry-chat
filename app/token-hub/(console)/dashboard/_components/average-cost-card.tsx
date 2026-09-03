'use client'

import { Activity, BadgeDollarSign, Clock3 } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { useSummaryQuery } from '@/services/token-hub'

/**
 * 平均请求成本卡 —— 基于最近 24 小时请求计算的平均成本 + 成本归集提示
 */
export function AverageCostCard() {
  const { t } = useT('token-hub')
  const { data: summary } = useSummaryQuery(1)

  const avgCost = summary.requests ? summary.cost / summary.requests : 0
  const avgTokens = summary.requests ? summary.tokens / summary.requests : 0

  return (
    <div className="rounded-[15px] border border-[#4a6cf5]/25 bg-[#eaf0ff] p-6 shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-semibold text-[#294fd4]">
            <BadgeDollarSign className="h-4 w-4" />
            {t('Dashboard Avg Cost Title')}
          </p>
          <p className="mt-4 text-[28px] leading-none font-semibold tracking-[-0.03em] text-[#0f1c3a] tabular-nums">¥{avgCost.toFixed(3)}</p>
          <p className="mt-2.5 text-xs text-[#5b6b8c]">{t('Dashboard Avg Cost Subtitle')}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-[#294fd4]/20 pt-4 text-xs text-[#5b6b8c]">
        <Clock3 className="h-3.5 w-3.5 text-[#294fd4]" />
        {t('Dashboard Avg Cost Realtime')}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-[#5b6b8c]">
        <Activity className="h-3.5 w-3.5 text-[#294fd4]" />
        {t('Dashboard Avg Cost Per Request')} {avgTokens >= 1000 ? `${(avgTokens / 1000).toFixed(1)}K` : avgTokens.toFixed(0)} tokens
      </div>
    </div>
  )
}
