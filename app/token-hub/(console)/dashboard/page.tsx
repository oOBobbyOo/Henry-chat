'use client'

import { useT } from 'next-i18next/client'

import { AverageCostCard } from './_components/average-cost-card'
import { MetricsGrid } from './_components/metrics-grid'
import { QuickStart } from './_components/quick-start'
import { UsageTrendCard } from './_components/usage-trend-card'

/**
 * Token Hub 控制台 —— 概览 Dashboard
 * 概览标题 + 10 张指标卡 + 用量趋势图 + 平均成本卡 + 快速开始
 */
export default function DashboardPage() {
  const { t } = useT('token-hub')

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-4 lg:py-9">
      <div className="space-y-7">
        {/* 概览标题 */}
        <section className="flex flex-col gap-5 border-b border-(--tc-border)/80 pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tighter text-(--tc-strong) sm:text-[32px]">{t('Dashboard Overview')}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--tc-body)">{t('Dashboard Overview Desc')}</p>
          </div>
        </section>

        {/* 指标卡 */}
        <MetricsGrid />

        {/* 趋势图 + 右侧卡片 */}
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-stretch">
          <UsageTrendCard />
          <div className="flex h-full flex-col gap-5">
            <AverageCostCard />
            <QuickStart />
          </div>
        </section>
      </div>
    </main>
  )
}
