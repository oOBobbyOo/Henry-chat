'use client'

import { useMemo } from 'react'

import ReactECharts from 'echarts-for-react'

import type { UsageFilters } from '../page'

/** 图表可选主题色(与指标卡 tone 呼应) */
const SERIES_COLORS = ['#294fd4', '#22c55e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ef4444']

/** 趋势指标类型 */
export type TrendMetric =
  | 'cost'
  | 'model'
  | 'provider'
  | 'rpm'
  | 'ttft'
  | 'output-latency'
  | 'cache-hit'
  | 'error-rate'

/** 数值格式化(轴标签) */
function formatAxisValue(metric: TrendMetric, v: number): string {
  if (metric === 'cost') return v >= 1 ? `¥${v.toFixed(2)}` : `¥${v.toFixed(3)}`
  if (metric === 'cache-hit' || metric === 'error-rate') return `${v.toFixed(0)}%`
  if (metric === 'ttft' || metric === 'output-latency')
    return v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${v.toFixed(0)}ms`
  if (metric === 'model' || metric === 'provider') {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
    return String(v)
  }
  return v >= 10 ? v.toFixed(0) : v.toFixed(1)
}

/** 数值格式化(tooltip) */
function formatTooltipValue(metric: TrendMetric, v: number): string {
  if (metric === 'cost') return `¥${v.toFixed(4)}`
  if (metric === 'cache-hit' || metric === 'error-rate') return `${v.toFixed(2)}%`
  if (metric === 'ttft' || metric === 'output-latency') return `${v.toFixed(1)} ms`
  if (metric === 'model' || metric === 'provider') return v.toLocaleString()
  return `${v.toFixed(2)} / min`
}

/**
 * 成本趋势图 —— 支持成本 / 模型 / 供应商 / 请求·分钟 / 首 Token 延迟 / 每 Token 输出时延 / 缓存命中率 / 错误率
 * 单序列指标取 trend;模型 / 供应商指标取 model-trend 堆叠,并按筛选条件过滤
 */
export function CostTrendChart({
  metric,
  trend,
  modelTrend,
  modelStats,
  filters,
}: {
  metric: TrendMetric
  trend: TokenHub.TrendResponse
  modelTrend: TokenHub.ModelTrendResponse
  modelStats: TokenHub.ModelStatsItem[]
  filters: UsageFilters
}) {
  // 时间轴(按粒度)
  const isHour = trend.granularity === 'hour'
  const labels = useMemo(
    () =>
      trend.items.map((i) => {
        const d = new Date(i.date)
        return isHour
          ? `${String(d.getHours()).padStart(2, '0')}:00`
          : `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      }),
    [trend.items, isHour],
  )

  // 模型 → 供应商 / 客户端 映射(用于供应商聚合与筛选)
  const providerOf = useMemo(
    () => new Map(modelStats.map((m) => [m.model, m.provider])),
    [modelStats],
  )
  const clientOf = useMemo(() => new Map(modelStats.map((m) => [m.model, m.client])), [modelStats])

  // 应用筛选后保留的模型
  const activeModels = useMemo(
    () =>
      modelTrend.models.filter((model) => {
        if (filters.model !== 'all' && model !== filters.model) return false
        if (filters.provider !== 'all' && providerOf.get(model) !== filters.provider) return false
        if (filters.client !== 'all' && clientOf.get(model) !== filters.client) return false
        return true
      }),
    [modelTrend.models, filters, providerOf, clientOf],
  )

  // 供应商列表(按筛选后模型的 provider 去重)
  const providers = useMemo(
    () => Array.from(new Set(activeModels.map((m) => providerOf.get(m) ?? m))),
    [activeModels, providerOf],
  )

  const option = useMemo(() => {
    // —— 单序列指标 ——
    const singleMetric: Record<string, { name: string; data: number[] }> = {
      cost: {
        name: 'cost',
        data: trend.items.map((i) => i.cost),
      },
      rpm: {
        name: 'rpm',
        data: trend.items.map((i) => i.requests_per_minute),
      },
      ttft: {
        name: 'ttft',
        data: trend.items.map((i) => i.avg_ttft_ms),
      },
      'output-latency': {
        name: 'output-latency',
        data: trend.items.map((i) => i.output_token_latency_ms),
      },
      'cache-hit': {
        name: 'cache-hit',
        data: trend.items.map((i) => i.cache_hit_rate * 100),
      },
      'error-rate': {
        name: 'error-rate',
        data: trend.items.map((i) => i.error_rate * 100),
      },
    }

    const showLegend = metric === 'model' || metric === 'provider'

    // —— 序列 ——
    let series: Record<string, unknown>[] = []
    if (metric === 'model') {
      series = activeModels.map((model, idx) => ({
        name: model,
        type: 'line',
        smooth: true,
        symbol: 'none',
        stack: 'total',
        areaStyle: { opacity: 0.12 },
        lineStyle: { width: 2 },
        itemStyle: { color: SERIES_COLORS[idx % SERIES_COLORS.length] },
        emphasis: { focus: 'series' },
        data: modelTrend.items.map(
          (item) => item.models.find((m) => m.model === model)?.tokens ?? 0,
        ),
      }))
    } else if (metric === 'provider') {
      series = providers.map((provider, idx) => {
        const models = activeModels.filter((m) => (providerOf.get(m) ?? m) === provider)
        return {
          name: provider,
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'total',
          areaStyle: { opacity: 0.12 },
          lineStyle: { width: 2 },
          itemStyle: { color: SERIES_COLORS[idx % SERIES_COLORS.length] },
          emphasis: { focus: 'series' },
          data: modelTrend.items.map((item) =>
            models.reduce(
              (sum, model) => sum + (item.models.find((m) => m.model === model)?.tokens ?? 0),
              0,
            ),
          ),
        }
      })
    } else {
      const { data } = singleMetric[metric]
      series = [
        {
          name: singleMetric[metric].name,
          type: 'line',
          smooth: true,
          symbol: 'none',
          showSymbol: false,
          lineStyle: { width: 2 },
          itemStyle: { color: SERIES_COLORS[0] },
          areaStyle: { opacity: 0.1 },
          data,
        },
      ]
    }

    return {
      color: SERIES_COLORS,
      tooltip: {
        trigger: 'axis' as const,
        confine: true,
        backgroundColor: '#ffffff',
        borderColor: '#dce5f6',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: '#0f1c3a', fontSize: 12 },
        axisPointer: {
          type: 'line' as const,
          lineStyle: { color: '#c9d6ef', type: 'dashed' as const },
        },
        valueFormatter: (v: unknown) =>
          typeof v === 'number' ? formatTooltipValue(metric, v) : String(v),
      },
      legend: showLegend
        ? {
            top: -2,
            right: 6,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 14,
            textStyle: { color: '#8a9bc0', fontSize: 11 },
            data: metric === 'model' ? activeModels : providers,
          }
        : undefined,
      grid: {
        left: 8,
        right: 8,
        top: showLegend ? 40 : 20,
        bottom: 4,
        containLabel: true,
      },
      xAxis: {
        type: 'category' as const,
        boundaryGap: false,
        data: labels,
        axisLine: { lineStyle: { color: '#e6edfb' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#8a9bc0',
          fontSize: 10,
          interval: isHour ? 3 : 1,
          formatter: (v: string, index: number) => (index % (isHour ? 3 : 2) === 0 ? v : ''),
        },
      },
      yAxis: {
        type: 'value' as const,
        splitNumber: 3,
        axisLabel: {
          color: '#8a9bc0',
          fontSize: 10,
          formatter: (v: number) => formatAxisValue(metric, v),
        },
        splitLine: { lineStyle: { color: '#edf2fc', type: 'dashed' as const } },
      },
      series,
    }
  }, [metric, trend.items, activeModels, providers, providerOf, modelTrend.items, labels, isHour])

  return (
    <ReactECharts
      option={option}
      style={{ height: 300, width: '100%' }}
      notMerge
      lazyUpdate
    />
  )
}
