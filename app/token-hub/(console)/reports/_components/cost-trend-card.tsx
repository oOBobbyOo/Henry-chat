'use client'

import ReactECharts from 'echarts-for-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

import type { ReportGranularity } from '../page'

/** 粒度切换项 */
const GRANULARITY_TABS: { key: ReportGranularity; labelKey: string }[] = [
  { key: 'day', labelKey: 'Reports Trend Day' },
  { key: 'week', labelKey: 'Reports Trend Week' },
  { key: 'month', labelKey: 'Reports Trend Month' },
  { key: 'year', labelKey: 'Reports Trend Year' },
]

/** x 轴标签格式 */
function formatAxisLabel(granularity: ReportGranularity, date: string): string {
  const d = new Date(date)
  if (granularity === 'day' || granularity === 'week') return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  if (granularity === 'month') return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  return String(d.getFullYear())
}

/** 轴刻度格式化(元) */
function formatAxisCost(v: number): string {
  if (v >= 1000) return `¥${(v / 1000).toFixed(1)}K`
  if (v >= 100) return `¥${v.toFixed(0)}`
  return `¥${v.toFixed(1)}`
}

/**
 * 成本走势卡片 —— 日/周/月/年粒度切换 + echarts 柱状图
 */
export function CostTrendCard({
  granularity,
  onGranularityChange,
  trend,
}: {
  granularity: ReportGranularity
  onGranularityChange: (v: ReportGranularity) => void
  trend: TokenHub.CostReportTrendResponse
}) {
  const { t } = useT('token-hub')

  const labels = trend.items.map((i) => formatAxisLabel(granularity, i.date))
  const values = trend.items.map((i) => i.cost)

  const option = {
    tooltip: {
      trigger: 'axis' as const,
      confine: true,
      backgroundColor: '#ffffff',
      borderColor: '#dce5f6',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: { color: '#0f1c3a', fontSize: 12 },
      axisPointer: { type: 'shadow' as const, shadowStyle: { color: 'rgba(41, 79, 212, 0.06)' } },
      valueFormatter: (v: unknown) => (typeof v === 'number' ? `¥${v.toFixed(2)}` : String(v)),
    },
    grid: {
      left: 8,
      right: 12,
      top: 16,
      bottom: 4,
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: labels,
      axisLine: { lineStyle: { color: '#e6edfb' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#8a9bc0',
        fontSize: 10,
        interval: granularity === 'day' ? 2 : 0,
        formatter: (v: string, index: number) => (granularity === 'day' ? (index % 3 === 0 ? v : '') : v),
      },
    },
    yAxis: {
      type: 'value' as const,
      splitNumber: 3,
      axisLabel: {
        color: '#8a9bc0',
        fontSize: 10,
        formatter: (v: number) => formatAxisCost(v),
      },
      splitLine: { lineStyle: { color: '#edf2fc', type: 'dashed' as const } },
    },
    series: [
      {
        name: 'cost',
        type: 'bar' as const,
        barWidth: granularity === 'year' ? 28 : 18,
        data: values,
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#4269ee' },
              { offset: 1, color: '#294fd4' },
            ],
          },
          borderRadius: [5, 5, 0, 0],
        },
        emphasis: {
          itemStyle: { color: '#1d3fb8' },
        },
      },
    ],
  }

  return (
    <div className="h-full overflow-hidden rounded-[15px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#dce5f6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0f1c3a]">{t('Reports Trend Title')}</h2>
          </div>
          <p className="mt-1.5 text-xs text-[#8a9bc0]">
            {t('Reports Trend Subtitle')} · {t('Reports Trend Unit')}
          </p>
        </div>

        {/* 粒度切换 */}
        <div
          role="group"
          aria-label={t('Reports Trend Granularity Group')}
          className="flex h-10 shrink-0 items-center gap-0.5 rounded-lg border border-[#dce5f6] bg-[#f7f9fd] px-1.25 py-1"
        >
          {GRANULARITY_TABS.map(({ key, labelKey }) => (
            <button
              key={key}
              type="button"
              aria-pressed={granularity === key}
              onClick={() => onGranularityChange(key)}
              className={cn(
                'inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3.5 text-xs font-semibold leading-none whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none',
                granularity === key ? 'bg-[#294fd4] text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-[#8a9bc0] hover:bg-white hover:text-[#4269ee]',
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-2 pt-2 pb-2 sm:px-3 sm:pb-6">
        <ReactECharts
          option={option}
          style={{ height: 300, width: '100%' }}
          notMerge
          lazyUpdate
        />
      </div>
    </div>
  )
}
