'use client'

import { Activity, Gauge, ShieldCheck, Zap } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { formatShare } from '@/lib/format'

/**
 * 请求健康摘要卡 —— 活跃模型 / 成功率 / 平均吞吐 / 缓存命中
 * 按当前筛选条件实时汇总
 */
export function UsageSideCard({
  summary,
  modelTrend,
  days,
}: {
  summary: TokenHub.Summary
  modelTrend: TokenHub.ModelTrendResponse
  days: number
}) {
  const { t } = useT('token-hub')

  // 活跃模型数(最近窗口有流量的模型)
  const lastWindow = modelTrend.items[modelTrend.items.length - 1]
  const activeModels = lastWindow?.models.length ?? 0

  const stats = [
    {
      label: t('Usage Health Active Models'),
      value: activeModels.toLocaleString(),
      icon: Activity,
      tone: 'bg-(--tc-blue-soft) text-(--tc-blue-bright)',
    },
    {
      label: t('Usage Health Success'),
      value: formatShare(summary.success_rate),
      icon: ShieldCheck,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: t('Usage Health Throughput'),
      value: summary.p50_tps ? `${summary.p50_tps.toFixed(1)} tok/s` : '—',
      icon: Gauge,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      label: t('Usage Health Cache'),
      value: formatShare(summary.cache_hit_rate),
      icon: Zap,
      tone: 'bg-violet-50 text-violet-600',
    },
  ]

  return (
    <div className="flex h-full flex-col rounded-[15px] border border-(--tc-border) bg-(--tc-surface) p-5 shadow-[0_1px_2px_rgb(15_38_79/0.04)] sm:p-6">
      <div>
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-(--tc-strong)">
          {t('Usage Health Title')}
        </h2>
        <p className="mt-1.5 text-xs text-(--tc-muted)">{t('Usage Health Subtitle')}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="rounded-xl border border-(--tc-border)/80 bg-(--tc-surface-raised)/70 p-3.5"
          >
            <span className={`grid h-8 w-8 place-items-center rounded-lg ${tone}`}>
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-3 truncate text-[20px] leading-none font-semibold tracking-[-0.02em] text-(--tc-strong) tabular-nums">
              {value}
            </p>
            <p className="mt-2 truncate text-[11px] font-medium text-(--tc-muted)">{label}</p>
          </div>
        ))}
      </div>

      <p className="mt-auto border-t border-(--tc-border)/80 pt-4 text-xs text-(--tc-muted)">
        {t('Usage Health Range')}: {t('Usage Health Range Days', { count: days })}
      </p>
    </div>
  )
}
