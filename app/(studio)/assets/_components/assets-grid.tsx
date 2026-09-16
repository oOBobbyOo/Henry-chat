'use client'

import { useMemo } from 'react'

import {
  Download,
  FolderInput,
  ImageIcon,
  Music,
  RefreshCw,
  Search,
  Tags,
  Trash2,
  Video,
  Box,
  X,
} from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * 资产结果区 —— 批量操作栏 + 资产网格(三档密度)+ 空态
 * 视觉对齐 syna.art /assets 实测:胶囊徽标批量栏 / 绿渐变导入按钮 / 空态 460px 卡
 */

/** 密度 → 网格列(紧凑 5 列、标准 4 列、宽松 3 列)与封面比例 */
const DENSITY_GRID: Record<Assets.GridDensity, string> = {
  compact: 'grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  standard: 'grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  comfortable: 'grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3',
}

/** 类型图标映射(不含 'all') */
const TYPE_ICONS: Record<Exclude<Assets.AssetType, 'all'>, typeof ImageIcon> = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  '3d': Box,
}

interface AssetsGridProps {
  /** 资产列表(已按筛选过滤) */
  items: Assets.AssetItem[]
  /** 当前密度 */
  density: Assets.GridDensity
  /** 已多选资产 ID 集合 */
  selectedIds: string[]
  /** 多选拼切换回调 */
  onToggleSelect: (id: string) => void
  /** 退出多选 */
  onExitMultiSelect: () => void
  /** 批量操作(当前为占位提示) */
  onBatchAction: (action: 'tag' | 'download' | 'delete') => void
  /** 刷新数据 */
  onRefresh: () => void
  /** 清空筛选(空态按钮) */
  onClearFilters: () => void
  /** 是否处于"有筛选无结果"状态(false = 库整体为空,显示引导空态) */
  hasActiveFilters: boolean
}

export function AssetsGrid({
  items,
  density,
  selectedIds,
  onToggleSelect,
  onExitMultiSelect,
  onBatchAction,
  onRefresh,
  onClearFilters,
  hasActiveFilters,
}: AssetsGridProps) {
  const { t } = useT('assets')

  const multiSelect = selectedIds.length > 0

  /** 类型徽标文案 */
  const typeLabel = useMemo(
    () => ({
      image: t('Asset type image'),
      video: t('Asset type video'),
      audio: t('Asset type audio'),
      '3d': t('Asset type 3d'),
    }),
    [t],
  )

  if (items.length === 0) {
    return (
      <div
        className={cn(
          'mx-auto mt-6 flex max-w-[460px] flex-col items-center rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-white px-6 py-12 text-center shadow-[0_16px_40px_rgba(41,78,124,0.08)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(20,22,32,0.5),rgba(12,14,22,0.7))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]',
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[rgba(93,175,206,0.08)] text-[#3d8fb0] dark:text-[#7fc4dc]">
          {hasActiveFilters ? (
            <Search
              aria-hidden
              className="h-5 w-5"
              strokeWidth={1.75}
            />
          ) : (
            <FolderInput
              aria-hidden
              className="h-5 w-5"
              strokeWidth={1.75}
            />
          )}
        </div>
        {hasActiveFilters ? (
          <>
            <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.005em] text-[#091423] dark:text-[#eef4ff]">
              {t('No assets found')}
            </h3>
            <p className="mx-auto mt-1.5 max-w-[380px] text-[12.5px] leading-relaxed text-[#4a6080] dark:text-[#8fa5c4]">
              {t('No assets hint')}
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className="mt-5 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[rgba(12,24,36,0.10)] bg-white px-3.5 text-[12.5px] font-medium text-[#2e4268] transition-colors hover:border-[rgba(12,24,36,0.14)] hover:text-[#091423] dark:border-white/10 dark:bg-white/5 dark:text-[#b6c5e0] dark:hover:text-[#eef4ff]"
            >
              <X
                aria-hidden
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
              {t('Clear filters')}
            </button>
          </>
        ) : (
          <>
            <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.005em] text-[#091423] dark:text-[#eef4ff]">
              {t('Empty library title')}
            </h3>
            <p className="mx-auto mt-1.5 max-w-[380px] text-[12.5px] leading-relaxed text-[#4a6080] dark:text-[#8fa5c4]">
              {t('Empty library hint')}
            </p>
            <button
              type="button"
              onClick={onRefresh}
              className="mt-5 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#3898bc,#3867ff)] px-4 text-[12.5px] font-semibold text-white shadow-[0_8px_20px_rgba(56,103,255,0.24)] transition hover:brightness-105"
            >
              {t('Go create')}
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* 批量操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex h-7 items-center rounded-full border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] px-3 text-[12px] tabular-nums text-[#2e4268] dark:border-white/8 dark:bg-white/5 dark:text-[#b6c5e0]"
            style={{ borderRadius: 'var(--app-badge-radius, 9999px)' }}
          >
            {t('items selected', { count: selectedIds.length })}
          </span>
          {multiSelect && (
            <>
              <BatchButton
                onClick={() => onBatchAction('tag')}
                icon={
                  <Tags
                    aria-hidden
                    className="h-3.5 w-3.5"
                    strokeWidth={1.75}
                  />
                }
                label={t('Batch tag')}
              />
              <BatchButton
                onClick={() => onBatchAction('download')}
                icon={
                  <Download
                    aria-hidden
                    className="h-3.5 w-3.5"
                    strokeWidth={1.75}
                  />
                }
                label={t('Batch download')}
              />
              <BatchButton
                onClick={() => onBatchAction('delete')}
                icon={
                  <Trash2
                    aria-hidden
                    className="h-3.5 w-3.5"
                    strokeWidth={1.75}
                  />
                }
                label={t('Batch delete')}
                tone="danger"
              />
              <button
                type="button"
                onClick={onExitMultiSelect}
                className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full px-2 text-[12px] text-[#4a6080] transition-colors hover:text-[#091423] dark:text-[#8fa5c4] dark:hover:text-[#eef4ff]"
              >
                {t('Cancel')}
              </button>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* 导入资产:参考站绿渐变胶囊 */}
          <button
            type="button"
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-emerald-300/28 bg-[linear-gradient(180deg,#6EE7B7,#34D399)] px-3 text-[12px] font-medium text-slate-950 shadow-[0_10px_24px_rgba(16,185,129,0.22)] transition hover:brightness-105"
          >
            <FolderInput
              aria-hidden
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
            {t('Import assets')}
          </button>
          {multiSelect && (
            <button
              type="button"
              onClick={onExitMultiSelect}
              className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-[rgba(12,24,36,0.08)] px-3 text-[12px] font-medium text-[#2e4268] backdrop-blur-sm transition hover:border-[rgba(12,24,36,0.14)] hover:text-[#091423] dark:border-white/8 dark:text-[#b6c5e0] dark:hover:text-[#eef4ff]"
            >
              <X
                aria-hidden
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
              {t('Exit multi-select')}
            </button>
          )}
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-[rgba(12,24,36,0.08)] px-3 text-[12px] font-medium text-[#2e4268] backdrop-blur-sm transition hover:border-[rgba(12,24,36,0.14)] hover:text-[#091423] dark:border-white/8 dark:text-[#b6c5e0] dark:hover:text-[#eef4ff]"
          >
            <RefreshCw
              aria-hidden
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
            {t('Refresh data')}
          </button>
        </div>
      </div>

      {/* 资产网格 */}
      <div className={cn('mt-4 grid', DENSITY_GRID[density])}>
        {items.map((item) => {
          const TypeIcon = TYPE_ICONS[item.assetType]
          const selected = selectedIds.includes(item.id)
          return (
            <article
              key={item.id}
              className="min-w-0"
            >
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onToggleSelect(item.id)}
                className={cn(
                  'group block w-full cursor-pointer overflow-hidden rounded-[14px] border bg-white text-left transition duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_28px_-14px_rgba(15,23,42,0.22)] dark:bg-[linear-gradient(180deg,rgba(20,22,32,0.7),rgba(12,14,22,0.85))]',
                  selected
                    ? 'border-[rgba(93,175,206,0.65)] shadow-[0_0_0_2px_rgba(93,175,206,0.35)]'
                    : 'border-[rgba(12,24,36,0.08)] dark:border-white/8',
                )}
              >
                <div
                  className={cn(
                    'relative w-full overflow-hidden',
                    density === 'comfortable' ? 'aspect-[4/3]' : 'aspect-[16/10]',
                  )}
                >
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(56,152,188,0.22),rgba(56,103,255,0.16))] dark:bg-[linear-gradient(135deg,rgba(56,152,188,0.18),rgba(112,119,224,0.14))]">
                    <TypeIcon
                      aria-hidden
                      className="h-7 w-7 text-white/75"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-[rgba(9,20,35,0.62)] px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    {typeLabel[item.assetType]}
                  </span>
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-[rgba(9,20,35,0.5)] px-2 py-0.5 text-[10px] font-medium tabular-nums text-white backdrop-blur-sm">
                    {item.format}
                  </span>
                  {selected && (
                    <span
                      className="absolute inset-0 border-2 border-[rgba(93,175,206,0.9)]"
                      aria-hidden
                    />
                  )}
                </div>
                <div className="border-t border-[rgba(12,24,36,0.08)] px-3 py-2.5 dark:border-white/8">
                  <p className="truncate text-[13px] font-medium text-[#091423] dark:text-[#eef4ff]">
                    {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11.5px] text-[#4a6080] dark:text-[#8fa5c4]">
                    {item.modelName} · {item.dimensions}
                  </p>
                </div>
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}

/** 批量操作胶囊按钮 */
function BatchButton({
  onClick,
  icon,
  label,
  tone = 'default',
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
  tone?: 'default' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition',
        tone === 'danger'
          ? 'border-red-300/30 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300 dark:hover:bg-red-400/16'
          : 'border-[rgba(12,24,36,0.08)] bg-white text-[#2e4268] hover:border-[rgba(12,24,36,0.14)] hover:text-[#091423] dark:border-white/8 dark:bg-white/5 dark:text-[#b6c5e0] dark:hover:text-[#eef4ff]',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
