'use client'

import { LayoutGrid, Search, SlidersHorizontal, TableProperties, TimerReset } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { PlazaCurrency } from './model-card'

import { getProviderIcon } from './family-icon'

/** 能力选项(与生产一致) */
const CAPABILITY_OPTIONS = [
  { value: 'all', labelKey: 'Plaza Capability All' },
  { value: 'text', labelKey: 'Plaza Capability Text' },
  { value: 'image', labelKey: 'Plaza Capability Image' },
  { value: 'video', labelKey: 'Plaza Capability Video' },
  { value: 'audio', labelKey: 'Plaza Capability Audio' },
  { value: 'file', labelKey: 'Plaza Capability File' },
]

/** 视图模式 */
export type PlazaView = 'card' | 'list'

/**
 * 模型广场筛选工具栏 —— 搜索 / 能力 / 供应商 / 清空 / 排序 / 币种 / 视图 / 开发者 chips
 */
export function PlazaToolbar({
  query,
  onQueryChange,
  capability,
  onCapabilityChange,
  vendor,
  onVendorChange,
  currency,
  onCurrencyChange,
  view,
  onViewChange,
  sort,
  onSortChange,
  shown,
  total,
  vendorCounts,
  onClear,
}: {
  query: string
  onQueryChange: (v: string) => void
  capability: string
  onCapabilityChange: (v: string) => void
  vendor: string
  onVendorChange: (v: string) => void
  currency: PlazaCurrency
  onCurrencyChange: (v: PlazaCurrency) => void
  view: PlazaView
  onViewChange: (v: PlazaView) => void
  sort: string
  onSortChange: (v: string) => void
  shown: number
  total: number
  vendorCounts: { name: string; count: number }[]
  onClear: () => void
}) {
  const { t } = useT('token-hub')
  const hasFilter = query !== '' || capability !== 'all' || vendor !== 'all'

  return (
    <section
      aria-label={t('Plaza Filter')}
      className="grid gap-2.5 rounded-[18px] border border-[#dce5f6]/80 bg-[#f7f9fd]/70 px-4 py-3.5 shadow-[0_6px_18px_rgb(19_48_93/0.03)] sm:px-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          {/* 搜索 */}
          <div className="relative min-w-0 w-full sm:w-72 lg:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8a9bc0]" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t('Plaza Search Placeholder')}
              aria-label={t('Plaza Search Placeholder')}
              className="h-10 w-full rounded-xl border border-[#dce5f6]/90 bg-white/95 pl-9 text-sm text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition-colors placeholder:text-[#8a9bc0] focus-visible:border-[#4269ee] focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* 能力筛选 */}
          <Select
            value={capability}
            onValueChange={onCapabilityChange}
          >
            <SelectTrigger
              aria-label={t('Plaza Filter Capability')}
              className="h-10 w-full cursor-pointer border-[#dce5f6] bg-white/95 text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)] sm:w-36"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAPABILITY_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                >
                  {t(opt.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 供应商筛选 */}
          <Select
            value={vendor}
            onValueChange={onVendorChange}
          >
            <SelectTrigger
              aria-label={t('Plaza Filter Vendor')}
              className="h-10 w-full cursor-pointer border-[#dce5f6] bg-white/95 text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)] sm:w-44"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('Plaza All Vendors')}</SelectItem>
              {vendorCounts.map((v) => (
                <SelectItem
                  key={v.name}
                  value={v.name}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="grid h-4 w-4 place-items-center">{getProviderIcon(v.name, 12)}</span>
                    {v.name}
                    <span className="ml-auto pl-2 text-xs text-[#8a9bc0] tabular-nums">{v.count}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 清空筛选 */}
          <button
            type="button"
            onClick={onClear}
            disabled={!hasFilter}
            title={t('Plaza Clear Title')}
            className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#294fd4] px-4 text-sm font-semibold whitespace-nowrap text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition-all duration-200 hover:bg-[#4269ee] hover:shadow-[0_8px_20px_rgb(49_88_232/0.28)] focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <TimerReset className="h-3.5 w-3.5" />
            {t('Plaza Clear')}
          </button>
        </div>

        <div className="flex min-h-10 w-full flex-wrap items-center gap-2 lg:w-auto">
          <p
            role="status"
            aria-live="polite"
            className="mr-auto text-xs whitespace-nowrap text-[#8a9bc0] lg:mr-1"
          >
            {t('Plaza Showing')} <span className="font-semibold text-[#0f1c3a]">{shown}</span> / {total} {t('Plaza Models')}
          </p>

          {/* 排序 */}
          <Select
            value={sort}
            onValueChange={onSortChange}
          >
            <SelectTrigger
              aria-label={t('Plaza Sort')}
              className="h-10 w-36 cursor-pointer border-[#dce5f6] bg-white/95 text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-[#4269ee]" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('Plaza Sort Newest')}</SelectItem>
              <SelectItem value="price-asc">{t('Plaza Sort Price Asc')}</SelectItem>
              <SelectItem value="price-desc">{t('Plaza Sort Price Desc')}</SelectItem>
            </SelectContent>
          </Select>

          {/* 币种切换 */}
          <div
            role="group"
            aria-label={t('Plaza Currency Group')}
            className="flex h-10 shrink-0 items-center gap-0.5 rounded-lg border border-[#dce5f6] bg-[#f7f9fd] px-1.25 py-1"
          >
            <button
              type="button"
              aria-pressed={currency === 'CNY'}
              onClick={() => onCurrencyChange('CNY')}
              className={`inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-semibold leading-none whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none ${
                currency === 'CNY' ? 'bg-[#294fd4] text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-[#8a9bc0] hover:bg-white hover:text-[#4269ee]'
              }`}
            >
              ¥ {t('Plaza CNY')}
            </button>
            <button
              type="button"
              aria-pressed={currency === 'USD'}
              onClick={() => onCurrencyChange('USD')}
              className={`inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-semibold leading-none whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none ${
                currency === 'USD' ? 'bg-[#294fd4] text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-[#8a9bc0] hover:bg-white hover:text-[#4269ee]'
              }`}
            >
              $ {t('Plaza USD')}
            </button>
          </div>

          {/* 视图切换 */}
          <div
            role="group"
            aria-label={t('Plaza View Group')}
            className="flex h-10 shrink-0 items-center gap-0.5 rounded-lg border border-[#dce5f6] bg-[#f7f9fd] px-1.25 py-1"
          >
            <button
              type="button"
              aria-pressed={view === 'list'}
              onClick={() => onViewChange('list')}
              title={t('Plaza List View')}
              className={`grid h-7 w-8 cursor-pointer place-items-center rounded-md leading-none transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none ${
                view === 'list' ? 'bg-[#294fd4] text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-[#8a9bc0] hover:bg-white hover:text-[#4269ee]'
              }`}
            >
              <TableProperties className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-pressed={view === 'card'}
              onClick={() => onViewChange('card')}
              title={t('Plaza Card View')}
              className={`grid h-7 w-8 cursor-pointer place-items-center rounded-md leading-none transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none ${
                view === 'card' ? 'bg-[#294fd4] text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-[#8a9bc0] hover:bg-white hover:text-[#4269ee]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 开发者 chips */}
      <div className="mt-3 flex min-w-0 items-center gap-3 border-t border-[#dce5f6]/70 pt-3">
        <div className="hidden shrink-0 items-center gap-1.5 text-xs font-semibold text-[#5b6b8c] sm:flex">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#4269ee]" />
          {t('Plaza Developers')}
        </div>
        <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-1.5 pr-1">
            <VendorChip
              name={t('Plaza All')}
              count={total}
              active={vendor === 'all'}
              onClick={() => onVendorChange('all')}
            />
            {vendorCounts.map((v) => (
              <VendorChip
                key={v.name}
                name={v.name}
                count={v.count}
                active={vendor === v.name}
                onClick={() => onVendorChange(v.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** 供应商 chip —— 选中态高亮,未选中灰底 */
function VendorChip({ name, count, active, onClick }: { name: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none ${
        active
          ? 'border-[#294fd4] bg-[#294fd4] text-white shadow-[0_4px_10px_rgb(49_88_232/0.18)]'
          : 'border-transparent bg-[#f7f9fd] text-[#5b6b8c] hover:border-[#4269ee]/40 hover:bg-white hover:text-[#4269ee]'
      }`}
    >
      <span className="grid h-4 w-4 shrink-0 place-items-center">{getProviderIcon(name, 12)}</span>
      {name}
      <span className="tabular-nums opacity-75">{count}</span>
    </button>
  )
}
