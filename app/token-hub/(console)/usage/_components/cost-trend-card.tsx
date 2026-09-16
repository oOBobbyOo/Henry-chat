'use client'

import { useState } from 'react'

import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

import type { UsageFilters, UsageRange } from '../page'

import { CostTrendChart, type TrendMetric } from './cost-trend-chart'

/** 指标切换项 */
const METRIC_TABS: { key: TrendMetric; labelKey: string }[] = [
  { key: 'cost', labelKey: 'Usage Trend Metric Cost' },
  { key: 'model', labelKey: 'Usage Trend Metric Model' },
  { key: 'provider', labelKey: 'Usage Trend Metric Provider' },
  { key: 'rpm', labelKey: 'Usage Trend Metric RPM' },
  { key: 'ttft', labelKey: 'Usage Trend Metric TTFT' },
  { key: 'output-latency', labelKey: 'Usage Trend Metric Output Latency' },
  { key: 'cache-hit', labelKey: 'Usage Trend Metric Cache Hit' },
  { key: 'error-rate', labelKey: 'Usage Trend Metric Error Rate' },
]

/**
 * 成本趋势卡片 —— 标题 + 指标切换 + echarts 趋势图
 * 数据随上方筛选条件联动
 */
export function CostTrendCard({
  range,
  trend,
  modelTrend,
  modelStats,
  filters,
}: {
  range: UsageRange
  trend: TokenHub.TrendResponse
  modelTrend: TokenHub.ModelTrendResponse
  modelStats: TokenHub.ModelStatsItem[]
  filters: UsageFilters
}) {
  const { t } = useT('token-hub')
  const [metric, setMetric] = useState<TrendMetric>('cost')

  const granularityLabel =
    range === '24h' ? t('Usage Granularity Hour') : t('Usage Granularity Day')

  return (
    <div className="h-full overflow-hidden rounded-[15px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      <div className="flex flex-col gap-3 border-b border-(--tc-border) px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-(--tc-strong)">
              {t('Usage Trend Title')}
            </h2>
          </div>
          <p className="mt-1.5 text-xs text-(--tc-muted)">
            {granularityLabel} · {t('Usage Trend Subtitle')}
          </p>
        </div>
      </div>

      {/* 指标切换 */}
      <div className="scrollbar-none flex max-w-full items-center gap-1 overflow-x-auto border-b border-(--tc-border) px-5 pt-3 sm:px-6">
        {METRIC_TABS.map(({ key, labelKey }) => (
          <button
            key={key}
            type="button"
            aria-pressed={metric === key}
            onClick={() => setMetric(key)}
            className={cn(
              'inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none',
              metric === key
                ? 'bg-(--tc-blue-soft) text-(--tc-blue-bright)'
                : 'text-(--tc-muted) hover:bg-(--tc-blue-soft) hover:text-(--tc-body)',
            )}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      <div className="px-2 pt-2 pb-2 sm:px-3 sm:pb-6">
        <CostTrendChart
          metric={metric}
          trend={trend}
          modelTrend={modelTrend}
          modelStats={modelStats}
          filters={filters}
        />
      </div>
    </div>
  )
}
