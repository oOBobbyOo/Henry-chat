'use client'

import { useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { TOKEN_HUB_QUERY_KEYS } from '@/services/token-hub'

import { UsageTrendChart } from './usage-trend-chart'

/** Tokens 用量趋势卡片 —— 标题 + 刷新 + echarts 堆叠面积图 */
export function UsageTrendCard() {
  const { t } = useT('token-hub')
  const queryClient = useQueryClient()

  /** 手动刷新模型趋势与用量趋势 */
  const handleRefresh = () => {
    void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.modelTrend })
    void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.trend })
  }

  return (
    <div className="h-full overflow-hidden rounded-[15px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#dce5f6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0f1c3a]">{t('Dashboard Trend Title')}</h2>
          </div>
          <p className="mt-1.5 text-xs text-[#8a9bc0]">{t('Dashboard Trend Subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          title={t('Dashboard Trend Refresh')}
          aria-label={t('Dashboard Trend Refresh')}
          className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl text-[#5b6b8c] transition hover:bg-[#eef3ff] hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none active:rotate-180 active:duration-300"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <div className="px-2 pt-2 pb-2 sm:px-3 sm:pb-6">
        <UsageTrendChart />
      </div>
    </div>
  )
}
