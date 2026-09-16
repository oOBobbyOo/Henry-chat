'use client'

import { Cloud, SlidersHorizontal } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * 资产库左侧栏 —— 快速筛选卡(系统分类 / 标签 facets)+ 云空间配额卡
 * 视觉对齐 syna.art /assets 实测:rounded-[18px] surface 卡 + accent 径向渐变氛围 + uppercase 小节标题
 */

interface AssetsFilterSidebarProps {
  /** facets 分组(系统分类 / 标签) */
  facets: Assets.FacetGroup[]
  /** 已选 facet ID 集合 */
  activeFacetIds: string[]
  /** facet 点击回调(再次点击取消) */
  onToggleFacet: (id: string) => void
  /** 云空间配额 */
  storage: Assets.StorageQuota
}

/** 字节数格式化(1.2 GB / 340 MB) */
function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(0)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

export function AssetsFilterSidebar({
  facets,
  activeFacetIds,
  onToggleFacet,
  storage,
}: AssetsFilterSidebarProps) {
  const { t } = useT('assets')

  const percent = Math.min(100, Math.round((storage.usedBytes / storage.totalBytes) * 100))
  const remaining = formatBytes(Math.max(0, storage.totalBytes - storage.usedBytes))
  const usedLabel = `${formatBytes(storage.usedBytes)} / ${formatBytes(storage.totalBytes)}`

  /** facet 空态文案占位(参考站:当前筛选下没有可用的系统分类。/ 当前筛选下还没有标签。) */

  return (
    <div>
      {/* 快速筛选卡 */}
      <div className="relative overflow-hidden rounded-[18px] border border-[rgba(12,24,36,0.08)] bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(20,22,32,0.85),rgba(12,14,22,0.92))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-[radial-gradient(ellipse_at_top,rgba(93,175,206,0.06),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(93,175,206,0.09),transparent_70%)]"
        />
        <div className="relative space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-[rgba(93,175,206,0.10)] text-[#3d8fb0] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:text-[#7fc4dc]">
                <SlidersHorizontal
                  aria-hidden
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="text-[12px] font-semibold tracking-[-0.005em] text-[#091423] dark:text-[#eef4ff]">
                {t('Quick filters')}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {facets.map((group) => (
              <section key={group.id}>
                <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.10em] text-[#4e6585] dark:text-[#8fa5c4]">
                    {t(group.labelKey)}
                  </p>
                </div>
                <div className="space-y-0.5">
                  {group.items.length === 0 ? (
                    <div className="rounded-[8px] border border-dashed border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] px-2.5 py-2.5 text-[12px] leading-5 text-[#4e6585] dark:border-white/8 dark:bg-white/4 dark:text-[#8fa5c4]">
                      {t('Empty facets hint', { group: t(group.labelKey) })}
                    </div>
                  ) : (
                    group.items.map((item) => {
                      const active = activeFacetIds.includes(item.id)
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onToggleFacet(item.id)}
                          aria-pressed={active}
                          className={cn(
                            'flex w-full cursor-pointer items-center justify-between gap-2 rounded-[8px] px-2.5 py-1.5 text-left text-[12.5px] transition-colors',
                            active
                              ? 'bg-[rgba(93,175,206,0.13)] font-semibold text-[#091423] dark:bg-[rgba(93,175,206,0.2)] dark:text-[#eef4ff]'
                              : 'text-[#2e4268] hover:bg-[rgba(245,249,255,0.95)] dark:text-[#b6c5e0] dark:hover:bg-white/5',
                          )}
                        >
                          <span className="min-w-0 truncate">{t(item.labelKey)}</span>
                          <span
                            className={cn(
                              'shrink-0 text-[11.5px] tabular-nums',
                              active
                                ? 'text-[#3d8fb0] dark:text-[#7fc4dc]'
                                : 'text-[#4e6585] dark:text-[#8fa5c4]',
                            )}
                          >
                            {item.count}
                          </span>
                        </button>
                      )
                    })
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* 云空间配额卡 */}
      <div
        className="relative mt-3 overflow-hidden rounded-[18px] border border-[rgba(12,24,36,0.08)] bg-white p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(18,21,31,0.84),rgba(10,13,22,0.92))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_8px_24px_-16px_rgba(0,0,0,0.65)]"
        title={t('Storage used hint', { percent, remaining })}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/18"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(93,175,206,0.055),transparent_38%)]"
        />
        <div className="relative flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border border-[rgba(12,24,36,0.08)] bg-[rgba(93,175,206,0.08)] text-[#091423] dark:border-white/8 dark:text-[#eef4ff]">
              <Cloud
                aria-hidden
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            </span>
            <span className="truncate text-[12px] font-semibold text-[#091423] dark:text-[#eef4ff]">
              {t('Cloud storage')}
            </span>
          </div>
          <span className="inline-flex h-5 shrink-0 items-center rounded-full border border-[rgba(12,24,36,0.08)] bg-[rgba(93,175,206,0.07)] px-1.5 text-[12px] font-medium tabular-nums text-[#091423] dark:border-white/8 dark:text-[#eef4ff]">
            {percent}%
          </span>
        </div>
        <div className="relative mt-2 truncate text-[12.5px] font-semibold tabular-nums text-[#091423] dark:text-[#eef4ff]">
          {usedLabel}
        </div>
        <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-[rgba(245,249,255,0.95)] dark:bg-white/10">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(93,175,206,0.78),rgba(52,211,153,0.76))]"
            style={{ width: `${Math.max(percent, 2)}%` }}
          />
        </div>
        <div className="relative mt-1.5 truncate text-[12px] text-[#4e6585] dark:text-[#8fa5c4]">
          {t('Storage used hint', { percent, remaining })}
        </div>
      </div>
    </div>
  )
}
