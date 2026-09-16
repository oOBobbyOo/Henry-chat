'use client'

import { KeyRound, Layers, MonitorSmartphone, Network } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

import type { BreakdownBy } from '../page'

/** 视角 tab 定义 */
const BY_TABS: { key: BreakdownBy; labelKey: string; icon: typeof Layers }[] = [
  { key: 'model', labelKey: 'Reports Breakdown By Model', icon: Layers },
  { key: 'provider', labelKey: 'Reports Breakdown By Provider', icon: Network },
  { key: 'key', labelKey: 'Reports Breakdown By Key', icon: KeyRound },
  { key: 'client', labelKey: 'Reports Breakdown By Client', icon: MonitorSmartphone },
]

/**
 * 个人成本构成卡 —— 按模型 / 供应商 / API Key / 客户端排名列表
 * 每行: 名次 + 名称 + 占比进度条 + 成本 + 占比 + 请求次数
 */
export function CostBreakdownCard({
  by,
  onByChange,
  items,
}: {
  by: BreakdownBy
  onByChange: (v: BreakdownBy) => void
  items: TokenHub.CostBreakdownItem[]
}) {
  const { t } = useT('token-hub')

  // 占比进度条基准(第一名宽度)
  const maxShare = Math.max(...items.map((i) => i.share), 0.0001)

  return (
    <section className="overflow-hidden rounded-[15px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      {/* 标题 + 视角切换 */}
      <div className="flex flex-col gap-4 border-b border-(--tc-border) px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-(--tc-strong)">
            {t('Reports Breakdown Title')}
          </h2>
          <p className="mt-1.5 text-xs text-(--tc-muted)">{t('Reports Breakdown Subtitle')}</p>
        </div>

        <div className="scrollbar-none inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-(--tc-border) bg-(--tc-surface-raised) p-1">
          {BY_TABS.map(({ key, labelKey, icon: Icon }) => (
            <button
              key={key}
              type="button"
              aria-pressed={by === key}
              onClick={() => onByChange(key)}
              className={cn(
                'inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none',
                by === key
                  ? 'bg-(--tc-primary) text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]'
                  : 'text-(--tc-body) hover:bg-(--tc-surface) hover:text-(--tc-primary-text)',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* 排名列表 */}
      <div className="divide-y divide-(--tc-border)/60">
        {items.map((item, idx) => (
          <div
            key={item.name}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-(--tc-surface-raised)/60 sm:px-6"
          >
            {/* 名次 */}
            <span
              className={cn(
                'grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold tabular-nums',
                idx === 0
                  ? 'bg-(--tc-blue-soft) text-(--tc-blue-bright)'
                  : 'bg-(--tc-blue-soft) text-(--tc-muted)',
              )}
            >
              {idx + 1}
            </span>

            {/* 名称 + 占比进度条 */}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-[13px] font-semibold text-(--tc-strong)">{item.name}</p>
                <p className="shrink-0 text-xs text-(--tc-muted)">
                  {item.requests.toLocaleString()} {t('Reports Breakdown Requests')}
                </p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-(--tc-blue-soft)">
                <div
                  className="h-full rounded-full bg-linear-to-r from-(--tc-primary-hover) to-(--tc-primary) transition-[width] duration-500"
                  style={{ width: `${Math.max((item.share / maxShare) * 100, 2)}%` }}
                />
              </div>
            </div>

            {/* 成本 + 占比 */}
            <div className="shrink-0 text-right">
              <p className="text-[14px] font-semibold text-(--tc-strong) tabular-nums">
                ¥{item.cost.toFixed(1)}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-(--tc-muted) tabular-nums">
                {(item.share * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
