'use client'

import { useMemo, useState } from 'react'

import { Search, X } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'
import { useAssetsLibraryQuery } from '@/services/assets'

import { AssetsFilterSidebar } from './_components/assets-filter-sidebar'
import { AssetsGrid } from './_components/assets-grid'

/**
 * 资产库(Assets)—— 参考 syna.art /assets
 * 常规滚动布局:工具栏(范围 segment + 搜索 + 类型/密度)+ 时间 pills + 左 200px 快速筛选/云空间 + 自适应资产网格
 * AppRail / SiteHeader 由 (studio) 路由组布局统一提供
 */
export default function AssetsPage() {
  const { t } = useT('assets')
  const { data } = useAssetsLibraryQuery()

  const [scope, setScope] = useState<Assets.AssetScope>('workspace')
  const [type, setType] = useState<Assets.AssetType>('all')
  const [density, setDensity] = useState<Assets.GridDensity>('standard')
  const [timeRange, setTimeRange] = useState<Assets.TimeRange>('all')
  const [keyword, setKeyword] = useState('')
  const [activeFacetIds, setActiveFacetIds] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const library = data?.data
  const scopes = library?.scopes ?? []
  const types = library?.types ?? []
  const densities = library?.densities ?? []
  const timeRanges = library?.timeRanges ?? []
  const facets = useMemo(() => library?.facets ?? [], [library])
  const storage = library?.storage ?? { usedBytes: 0, totalBytes: 3 * 1024 * 1024 * 1024 }
  const items = useMemo(() => library?.items ?? [], [library])

  /** 生效中的筛选数量(有 facet / 关键词 / 非默认类型或时间) */
  const hasActiveFilters = activeFacetIds.length > 0 || keyword.trim() !== '' || type !== 'all' || timeRange !== 'all'

  /** 过滤后的资产列表 */
  const filtered = useMemo(() => {
    const now = Date.now()
    return items.filter((item) => {
      // 范围筛选(mock 侧:仅当前工作区有资产,收藏/分享范围视为空)
      if (scope !== 'workspace') return false
      // 时间筛选(mock 侧用 createdAt 与当前时刻比较)
      if (timeRange === 'today') {
        const created = new Date(item.createdAt)
        if (now - created.getTime() > 24 * 3600 * 1000) return false
      } else if (timeRange === '7d') {
        if (now - new Date(item.createdAt).getTime() > 7 * 24 * 3600 * 1000) return false
      } else if (timeRange === '30d') {
        if (now - new Date(item.createdAt).getTime() > 30 * 24 * 3600 * 1000) return false
      }
      // 类型筛选
      if (type !== 'all' && item.assetType !== type) return false
      // facet 筛选:命中任一激活 facet 即保留(facet 全空视为不限制)
      if (activeFacetIds.length > 0) {
        const matched = facets.some((group) => group.items.some((fi) => activeFacetIds.includes(fi.id) && matchesFacet(item, fi.id)))
        if (!matched) return false
      }
      // 关键词
      const kw = keyword.trim().toLowerCase()
      if (kw && !item.name.toLowerCase().includes(kw) && !item.modelName.toLowerCase().includes(kw)) return false
      return true
    })
  }, [activeFacetIds, facets, items, keyword, scope, timeRange, type])

  /** 切换 facet(再次点击取消) */
  const toggleFacet = (id: string) => {
    setActiveFacetIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  /** 切换资产多选 */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  /** 清空全部筛选(保留多选) */
  const clearFilters = () => {
    setActiveFacetIds([])
    setKeyword('')
    setType('all')
    setTimeRange('all')
  }

  /** scope 切换时清空多选(不同范围的选择不互通) */
  const switchScope = (id: Assets.AssetScope) => {
    setScope(id)
    setSelectedIds([])
  }

  return (
    <div className="mx-auto w-full max-w-[var(--app-content-max-width)] px-4 pt-4 pb-8 xl:px-5">
      <div className="menu-page-shell">
        {/* 工具栏第一行:范围 segment + 搜索 + 类型/密度 */}
        <div className="px-1 pb-2 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 范围 segment */}
            <div className="inline-flex items-center rounded-[10px] border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] p-[3px] dark:border-white/8 dark:bg-white/5">
              {scopes.map((s) => {
                const active = s.id === scope
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => switchScope(s.id)}
                    aria-pressed={active}
                    className={cn(
                      'inline-flex h-7 cursor-pointer items-center gap-1 rounded-[7px] px-3 text-[12px] transition-all duration-150',
                      active
                        ? 'bg-white font-semibold text-[#091423] shadow-[0_2px_6px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.13)] dark:text-[#eef4ff] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]'
                        : 'font-medium text-[#4a6080] hover:text-[#2e4268] dark:text-[#8fa5c4] dark:hover:text-[#b6c5e0]',
                    )}
                  >
                    {t(s.labelKey)}
                  </button>
                )
              })}
            </div>

            {/* 搜索 */}
            <label className="block min-w-[200px] max-w-[360px] flex-1">
              <span className="sr-only">{t('Search assets placeholder')}</span>
              <div className="relative">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4a6080] dark:text-[#8fa5c4]"
                  strokeWidth={1.75}
                />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={t('Search assets placeholder')}
                  className="h-8 w-full rounded-[8px] bg-[rgba(245,249,255,0.95)] pl-8 pr-3 text-[12.5px] text-[#091423] outline-none transition placeholder:text-[#4a6080] focus:ring-2 focus:ring-[rgba(93,175,206,0.4)] dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#8fa5c4]"
                />
              </div>
            </label>

            {/* 类型 pills + 密度 segment(右侧) */}
            <div className="ml-auto flex items-center gap-2">
              <div className="inline-flex items-center gap-0.5">
                {types.map((tp) => {
                  const active = tp.id === type
                  return (
                    <button
                      key={tp.id}
                      type="button"
                      onClick={() => setType(tp.id)}
                      aria-pressed={active}
                      className={cn(
                        'inline-flex h-8 cursor-pointer items-center rounded-[8px] px-3 text-[12px] transition',
                        active
                          ? 'bg-[rgba(245,249,255,0.95)] text-[#091423] dark:bg-white/10 dark:text-[#eef4ff]'
                          : 'text-[#4a6080] hover:bg-[rgba(245,249,255,0.95)] hover:text-[#2e4268] dark:text-[#8fa5c4] dark:hover:bg-white/5 dark:hover:text-[#b6c5e0]',
                      )}
                    >
                      {t(tp.labelKey)}
                    </button>
                  )
                })}
              </div>
              <div className="inline-flex items-center rounded-[8px] border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] p-[2px] dark:border-white/8 dark:bg-white/5">
                {densities.map((d) => {
                  const active = d.id === density
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDensity(d.id)}
                      aria-pressed={active}
                      className={cn(
                        'inline-flex h-7 cursor-pointer items-center justify-center rounded-[6px] px-2.5 text-[12px] transition-all duration-150',
                        active
                          ? 'bg-white font-semibold text-[#091423] shadow-[0_2px_6px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.13)] dark:text-[#eef4ff] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]'
                          : 'font-medium text-[#4a6080] hover:text-[#2e4268] dark:text-[#8fa5c4] dark:hover:text-[#b6c5e0]',
                      )}
                    >
                      {t(d.labelKey)}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 第二行:时间 pills + 清除筛选 */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {timeRanges.map((tr) => {
              const active = tr.id === timeRange
              return (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => setTimeRange(tr.id)}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-semibold transition-all duration-200',
                    active
                      ? 'border-transparent bg-[#2f67ee] !text-white'
                      : 'border-[rgba(12,24,36,0.08)] bg-transparent text-[#091423] hover:border-[rgba(12,24,36,0.14)] dark:border-white/8 dark:text-[#eef4ff] dark:hover:border-white/16',
                  )}
                >
                  {t(tr.labelKey)}
                </button>
              )
            })}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full px-2 text-[12px] text-[#4a6080] transition-colors hover:text-[#091423] dark:text-[#8fa5c4] dark:hover:text-[#eef4ff]"
              >
                <X
                  aria-hidden
                  className="h-3 w-3"
                  strokeWidth={2}
                />
                {t('Clear filters')}
              </button>
            )}
          </div>
        </div>

        {/* 主体:200px 侧栏 + 自适应结果区 */}
        <div className="mt-4 grid gap-5 xl:grid-cols-[200px_minmax(0,1fr)] xl:items-start">
          <aside className="xl:sticky xl:top-[88px]">
            <AssetsFilterSidebar
              facets={facets}
              activeFacetIds={activeFacetIds}
              onToggleFacet={toggleFacet}
              storage={storage}
            />
          </aside>
          <div className="min-w-0">
            <AssetsGrid
              items={filtered}
              density={density}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onExitMultiSelect={() => setSelectedIds([])}
              onBatchAction={() => undefined}
              onRefresh={() => undefined}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters || scope !== 'workspace'}
            />
          </div>
        </div>
      </div>

      {/* 屏幕阅读器可访问的页面标题(视觉标题由 SiteHeader 承担) */}
      <h1 className="sr-only">{t('Asset library')}</h1>
    </div>
  )
}

/** 资产是否命中 facet(本地 mock:按类型词根粗匹配 facet id) */
function matchesFacet(item: Assets.AssetItem, facetId: string): boolean {
  if (facetId === 'portrait' || facetId === 'product' || facetId === 'scene') return item.assetType === 'image'
  if (facetId === 'sound') return item.assetType === 'audio'
  if (facetId === 'model') return item.assetType === '3d'
  if (facetId === 'lofi') return item.assetType === 'audio'
  if (facetId === 'cyberpunk' || facetId === 'cinematic') return item.assetType === 'image' || item.assetType === 'video'
  if (facetId === 'watercolor') return item.assetType === 'image'
  return false
}
