'use client'

import { useEffect, useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Pause, Play, RefreshCw } from 'lucide-react'
import { useT } from 'next-i18next/client'

import {
  TOKEN_HUB_QUERY_KEYS,
  useModelStatsQuery,
  useModelTrendQuery,
  useSummaryQuery,
  useTrendQuery,
} from '@/services/token-hub'

import { CostTrendCard } from './_components/cost-trend-card'
import { EmptyState } from './_components/empty-state'
import { ModelPerformanceTable } from './_components/model-performance-table'
import { UsageFilterBar } from './_components/usage-filter-bar'
import { UsageMetricsGrid } from './_components/usage-metrics-grid'
import { UsageSideCard } from './_components/usage-side-card'

/** 时间范围预设 */
export type UsageRange = '24h' | '7d' | '30d'

/** 页签类型 */
type UsageTab = 'overview' | 'logs' | 'mcp'

/** 范围 → 聚合粒度 / 天数 */
export const RANGE_CONFIG: Record<UsageRange, { granularity: 'hour' | 'day'; days: number }> = {
  '24h': { granularity: 'hour', days: 1 },
  '7d': { granularity: 'day', days: 7 },
  '30d': { granularity: 'day', days: 30 },
}

/** 筛选条件 */
export interface UsageFilters {
  model: string
  provider: string
  client: string
}

/** 筛选下拉的候选值(全部/具体值) */
export const FILTER_ALL = 'all'

/**
 * Token Hub 控制台 —— 用量分析
 * 标题 + 自动刷新 + 页签(用量概览/请求日志/MCP 调用)+ 筛选栏 + 概览指标 + 成本趋势 + 健康摘要 + 模型表现
 */
export default function UsagePage() {
  const { t } = useT('token-hub')
  const queryClient = useQueryClient()

  // —— 状态 ——
  const [tab, setTab] = useState<UsageTab>('overview')
  const [range, setRange] = useState<UsageRange>('7d')
  const [dept, setDept] = useState(FILTER_ALL)
  const [user, setUser] = useState(FILTER_ALL)
  const [filters, setFilters] = useState<UsageFilters>({
    model: FILTER_ALL,
    provider: FILTER_ALL,
    client: FILTER_ALL,
  })
  const [live, setLive] = useState(true)

  const { granularity, days } = RANGE_CONFIG[range]

  // —— 数据 ——
  const { data: summary } = useSummaryQuery(days)
  const { data: trend } = useTrendQuery(granularity, days)
  const { data: modelTrend } = useModelTrendQuery(granularity, days)
  const { data: modelStats } = useModelStatsQuery(days, {
    model: filters.model === FILTER_ALL ? undefined : filters.model,
    provider: filters.provider === FILTER_ALL ? undefined : filters.provider,
    client: filters.client === FILTER_ALL ? undefined : filters.client,
  })

  // —— 自动刷新：live 时每 60s 静默刷新用量类查询 ——
  useEffect(() => {
    if (!live) return
    const timer = setInterval(() => {
      void queryClient.refetchQueries({
        queryKey: TOKEN_HUB_QUERY_KEYS.summary,
      })
      void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.trend })
      void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.modelTrend })
      void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.modelStats })
    }, 60_000)
    return () => clearInterval(timer)
  }, [live, queryClient])

  // —— 筛选选项(模型/供应商/客户端,从模型表现数据派生) ——
  const { modelOptions, providerOptions, clientOptions } = useMemo(() => {
    const all = modelStats.items
    return {
      modelOptions: Array.from(new Set(all.map((i) => i.model))),
      providerOptions: Array.from(new Set(all.map((i) => i.provider))),
      clientOptions: Array.from(new Set(all.map((i) => i.client))),
    }
  }, [modelStats.items])

  // —— 是否有活跃筛选 ——
  const hasFilter =
    dept !== FILTER_ALL ||
    user !== FILTER_ALL ||
    filters.model !== FILTER_ALL ||
    filters.provider !== FILTER_ALL ||
    filters.client !== FILTER_ALL

  const clearFilters = () => {
    setDept(FILTER_ALL)
    setUser(FILTER_ALL)
    setFilters({ model: FILTER_ALL, provider: FILTER_ALL, client: FILTER_ALL })
  }

  const tabs: { key: UsageTab; label: string }[] = [
    { key: 'overview', label: t('Usage Tab Overview') },
    { key: 'logs', label: t('Usage Tab Logs') },
    { key: 'mcp', label: t('Usage Tab MCP') },
  ]

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-4 lg:py-9">
      <div className="space-y-6">
        {/* 标题区 + 自动刷新开关 */}
        <header className="flex flex-col gap-4 border-b border-(--tc-border)/80 pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tighter text-(--tc-strong) sm:text-[32px]">
              {t('Usage Title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--tc-body)">
              {t('Usage Subtitle')}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLive((v) => !v)}
              aria-pressed={live}
              className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-(--tc-primary-hover)/35 focus-visible:outline-none ${
                live
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-(--tc-border) bg-(--tc-surface) text-(--tc-body) hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text)'
              }`}
            >
              {live ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {live ? t('Usage Live') : t('Usage Pause')}
            </button>
            <button
              type="button"
              onClick={() => {
                void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.summary })
                void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.trend })
                void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.modelTrend })
                void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.modelStats })
              }}
              title={t('Usage Refresh')}
              aria-label={t('Usage Refresh')}
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-(--tc-border) bg-(--tc-surface) text-(--tc-body) transition hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-2 focus-visible:ring-(--tc-primary-hover)/35 focus-visible:outline-none active:rotate-180 active:duration-300"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* 页签 */}
        <div className="inline-flex max-w-full items-center gap-5 overflow-x-auto border-b border-(--tc-border) scrollbar-none">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center -mb-px border-b-2 px-4 text-[12px] font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/20 focus-visible:outline-none ${
                tab === key
                  ? 'relative z-10 border-b-4 border-b-[#294fd4] text-(--tc-blue-bright)'
                  : 'border-b-transparent text-(--tc-muted) hover:border-b-[#dce5f6] hover:text-(--tc-body)'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 筛选栏 */}
        <UsageFilterBar
          range={range}
          onRangeChange={setRange}
          dept={dept}
          onDeptChange={setDept}
          user={user}
          onUserChange={setUser}
          filters={filters}
          onFiltersChange={setFilters}
          modelOptions={modelOptions}
          providerOptions={providerOptions}
          clientOptions={clientOptions}
          hasFilter={hasFilter}
          onClear={clearFilters}
        />

        {/* 内容区 */}
        {tab === 'overview' && (
          <div className="space-y-5">
            <UsageMetricsGrid
              summary={summary}
              trend={trend}
              granularity={granularity}
            />

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-stretch">
              <CostTrendCard
                range={range}
                trend={trend}
                modelTrend={modelTrend}
                modelStats={modelStats.items}
                filters={filters}
              />
              <UsageSideCard
                summary={summary}
                modelTrend={modelTrend}
                days={days}
              />
            </section>

            <ModelPerformanceTable items={modelStats.items} />
          </div>
        )}

        {tab === 'logs' && (
          <EmptyState
            title={t('Usage Logs Empty Title')}
            desc={t('Usage Logs Empty Desc')}
          />
        )}

        {tab === 'mcp' && (
          <EmptyState
            title={t('Usage MCP Empty Title')}
            desc={t('Usage MCP Empty Desc')}
          />
        )}
      </div>
    </main>
  )
}
