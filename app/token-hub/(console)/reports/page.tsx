'use client'

import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { RefreshCw, UserRound } from 'lucide-react'
import { useT } from 'next-i18next/client'

import {
  TOKEN_HUB_QUERY_KEYS,
  useReportBreakdownQuery,
  useReportSummaryQuery,
  useReportTrendQuery,
} from '@/services/token-hub'

import type { DateRangeValue } from '../_components/date-range-picker'

import { DateRangePicker, createPresetRange } from '../_components/date-range-picker'
import { CostBreakdownCard } from './_components/cost-breakdown-card'
import { CostSignalsCard } from './_components/cost-signals-card'
import { CostTrendCard } from './_components/cost-trend-card'
import { ReportMetricsGrid } from './_components/report-metrics-grid'

/** 成本走势粒度 */
export type ReportGranularity = 'day' | 'week' | 'month' | 'year'

/** 成本构成视角 */
export type BreakdownBy = TokenHub.CostBreakdownBy

/** 与粒度上限对齐的最大窗口天数 */
const REPORT_MAX_DAYS = 730

/**
 * Token Hub 控制台 —— 成本 Reports
 * 标题 + 日期范围 + 刷新 + 分析视角(个人成本)+ 核心指标 + 成本走势 + 成本信号 + 成本构成
 */
export default function ReportsPage() {
  const { t } = useT('token-hub')
  const queryClient = useQueryClient()

  // —— 状态 ——
  const [range, setRange] = useState<DateRangeValue>(() => createPresetRange('cm'))
  const [granularity, setGranularity] = useState<ReportGranularity>('day')
  const [by, setBy] = useState<BreakdownBy>('model')

  // —— 数据 ——
  const { data: summary } = useReportSummaryQuery(range.days)
  const { data: trend } = useReportTrendQuery(granularity, range.days)
  const { data: breakdown } = useReportBreakdownQuery(by)

  const refresh = () => {
    void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.reportSummary })
    void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.reportTrend })
    void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.reportBreakdown })
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-4 lg:py-9">
      <div className="space-y-6">
        {/* 标题区 */}
        <header className="flex flex-col gap-4 border-b border-(--tc-border)/80 pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tighter text-(--tc-strong) sm:text-[32px]">
              {t('Reports Title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--tc-body)">
              {t('Reports Subtitle')}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <DateRangePicker
              value={range}
              onChange={setRange}
              maxDays={REPORT_MAX_DAYS}
            />
            <button
              type="button"
              onClick={refresh}
              title={t('Reports Refresh')}
              aria-label={t('Reports Refresh')}
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-(--tc-border) bg-(--tc-surface) text-(--tc-body) transition hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-2 focus-visible:ring-(--tc-primary-hover)/35 focus-visible:outline-none active:rotate-180 active:duration-300"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* 分析视角 */}
        <section className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold tracking-[0.14em] text-(--tc-muted) uppercase">
            {t('Reports Perspective')}
          </p>
          <span className="inline-flex items-center gap-2 rounded-xl border border-(--tc-primary)/25 bg-(--tc-blue-soft) px-3.5 py-2 text-[13px] font-semibold text-(--tc-blue-bright)">
            <UserRound className="h-4 w-4" />
            {t('Reports Perspective Personal')}
            <span className="hidden text-xs font-medium text-(--tc-body) sm:inline">
              · {t('Reports Perspective Personal Desc')}
            </span>
          </span>
        </section>

        {/* 成本总览 */}
        <section className="space-y-5">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-(--tc-strong)">
              {t('Reports Overview Title')}
            </h2>
            <span className="text-xs text-(--tc-muted)">{t('Reports Overview Period')}</span>
          </div>

          {/* 核心指标 */}
          <ReportMetricsGrid summary={summary} />

          {/* 成本走势 + 成本信号 */}
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-stretch">
            <CostTrendCard
              granularity={granularity}
              onGranularityChange={setGranularity}
              trend={trend}
            />
            <CostSignalsCard summary={summary} />
          </div>
        </section>

        {/* 成本构成 */}
        <CostBreakdownCard
          by={by}
          onByChange={setBy}
          items={breakdown.items}
        />
      </div>
    </main>
  )
}
