'use client'

import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  Database,
  Gauge,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { useT } from 'next-i18next/client'

import { formatShare } from '@/lib/format'
import { useSummaryQuery, useTrendQuery } from '@/services/token-hub'

import { MetricCard } from './metric-card'

/**
 * 概览指标卡矩阵 —— 10 张指标卡,数据来自用量汇总 + 用量趋势
 * 总消耗 / 输入 / 输出 / 缓存 / 平均每次 / 累计支出 / 请求次数 / 活跃人数 / 成功率 / 缓存命中
 */
export function MetricsGrid() {
  const { t } = useT('token-hub')
  const { data: summary } = useSummaryQuery(1)
  const { data: trend } = useTrendQuery('hour', 1)

  // 迷你趋势数据(按小时取用量)
  const hourTokens = trend.items.map((i) => i.tokens)
  const hourInput = trend.items.map((i) => i.input_tokens)
  const hourOutput = trend.items.map((i) => i.output_tokens)
  const hourCache = trend.items.map((i) => i.cache_tokens)
  const hourCost = trend.items.map((i) => i.cost)
  const hourRequests = trend.items.map((i) => i.requests)

  // 格式化工具
  const fmtTokens = (v: number) => {
    if (!v) return '0'
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)} K`
    return v.toLocaleString()
  }
  const avgPerRequest = summary.requests ? summary.tokens / summary.requests : 0

  const cards = [
    {
      label: t('Dashboard Metric Total'),
      hint: t('Dashboard Metric 24h'),
      icon: Coins,
      value: summary.tokens,
      unit: 'M',
      display: fmtTokens(summary.tokens),
      data: hourTokens,
      tone: 'primary' as const,
    },
    {
      label: t('Dashboard Metric Input'),
      hint: t('Dashboard Metric 24h'),
      icon: ArrowDownToLine,
      value: summary.input_tokens,
      display: fmtTokens(summary.input_tokens),
      data: hourInput,
      tone: 'sky' as const,
    },
    {
      label: t('Dashboard Metric Output'),
      hint: t('Dashboard Metric 24h'),
      icon: ArrowUpFromLine,
      value: summary.output_tokens,
      display: fmtTokens(summary.output_tokens),
      data: hourOutput,
      tone: 'violet' as const,
    },
    {
      label: t('Dashboard Metric Cache'),
      hint: t('Dashboard Metric 24h'),
      icon: Database,
      value: summary.cache_tokens,
      display: fmtTokens(summary.cache_tokens),
      data: hourCache,
      tone: 'green' as const,
    },
    {
      label: t('Dashboard Metric Avg'),
      hint: t('Dashboard Metric 24h Avg'),
      icon: Gauge,
      value: avgPerRequest,
      display: fmtTokens(avgPerRequest),
      data: hourTokens,
      tone: 'amber' as const,
    },
    {
      label: t('Dashboard Metric Cost'),
      hint: t('Dashboard Metric 24h Cost'),
      icon: Wallet,
      value: summary.cost,
      display: `¥${summary.cost.toFixed(2)}`,
      data: hourCost,
      tone: 'green' as const,
    },
    {
      label: t('Dashboard Metric Requests'),
      hint: t('Dashboard Metric All Calls'),
      icon: Activity,
      value: summary.requests,
      display: summary.requests.toLocaleString(),
      data: hourRequests,
      tone: 'primary' as const,
    },
    {
      label: t('Dashboard Metric Active Users'),
      hint: t('Dashboard Metric Active Hint'),
      icon: Users,
      value: summary.active_users,
      display: summary.active_users.toLocaleString(),
      data: hourRequests,
      tone: 'violet' as const,
    },
    {
      label: t('Dashboard Metric Success Rate'),
      hint: t('Dashboard Metric Success Hint'),
      icon: ShieldCheck,
      value: summary.success_rate * 100,
      display: `${(summary.success_rate * 100).toFixed(1)}%`,
      data: hourRequests,
      tone: 'green' as const,
    },
    {
      label: t('Dashboard Metric Cache Hit'),
      hint: t('Dashboard Metric Cache Hint'),
      icon: Zap,
      value: summary.cache_hit_rate * 100,
      display: formatShare(summary.cache_hit_rate),
      data: hourCache,
      tone: 'amber' as const,
    },
  ]

  return (
    <section className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          {...card}
        />
      ))}
    </section>
  )
}
