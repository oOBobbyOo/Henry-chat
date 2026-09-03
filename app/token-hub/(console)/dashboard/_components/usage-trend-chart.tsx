'use client'

import ReactECharts from 'echarts-for-react'

import { useModelTrendQuery } from '@/services/token-hub'

/** 图表可选主题色(与指标卡 tone 呼应) */
const SERIES_COLORS = ['#294fd4', '#22c55e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ef4444']

/**
 * Tokens 用量趋势图 —— 按模型统计的堆叠面积图,基于 echarts
 * 数据来自 `/usage/model-trend`(默认按小时聚合最近 24 小时)
 */
export function UsageTrendChart() {
  const { data } = useModelTrendQuery('hour', 1)

  // 时间轴(小时级)
  const hours = data.items.map((i) => {
    const d = new Date(i.date)
    return `${String(d.getHours()).padStart(2, '0')}:00`
  })

  // 每个模型的序列
  const series = data.models.map((model, idx) => ({
    name: model,
    type: 'line' as const,
    smooth: true,
    symbol: 'none',
    stack: 'total',
    areaStyle: { opacity: 0.12 },
    lineStyle: { width: 2 },
    itemStyle: { color: SERIES_COLORS[idx % SERIES_COLORS.length] },
    emphasis: { focus: 'series' as const },
    data: data.items.map((item) => item.models.find((m) => m.model === model)?.tokens ?? 0),
  }))

  const option = {
    color: SERIES_COLORS,
    tooltip: {
      trigger: 'axis' as const,
      confine: true,
      backgroundColor: '#ffffff',
      borderColor: '#dce5f6',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#0f1c3a',
        fontSize: 12,
      },
      axisPointer: {
        type: 'line' as const,
        lineStyle: { color: '#c9d6ef', type: 'dashed' as const },
      },
      valueFormatter: (v: unknown) => (typeof v === 'number' ? v.toLocaleString() : String(v)),
    },
    legend: {
      top: -2,
      right: 6,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 14,
      textStyle: { color: '#8a9bc0', fontSize: 11 },
      data: data.models,
    },
    grid: {
      left: 8,
      right: 8,
      top: 40,
      bottom: 4,
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: hours,
      axisLine: { lineStyle: { color: '#e6edfb' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#8a9bc0',
        fontSize: 10,
        interval: 3,
        formatter: (v: string, index: number) => (index % 3 === 0 ? v : ''),
      },
    },
    yAxis: {
      type: 'value' as const,
      splitNumber: 3,
      axisLabel: {
        color: '#8a9bc0',
        fontSize: 10,
        formatter: (v: number) => {
          if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
          if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
          return String(v)
        },
      },
      splitLine: { lineStyle: { color: '#edf2fc', type: 'dashed' as const } },
    },
    series,
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: 300, width: '100%' }}
      notMerge
      lazyUpdate
    />
  )
}
