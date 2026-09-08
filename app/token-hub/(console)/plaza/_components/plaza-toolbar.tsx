'use client'

import { LayoutGrid, Search, SlidersHorizontal, TableProperties, TimerReset } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { getProviderIcon } from '@/components/token-hub/family-icon'
import { ConsoleSelect, ConsoleSelectContent, ConsoleSelectItem, ConsoleSelectTrigger, ConsoleSelectValue } from '@/components/token-hub/select'

import type { PlazaCurrency } from './model-card'

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
      className="grid gap-2.5 rounded-[18px] border border-(--tc-border)/80 bg-(--tc-surface-raised)/70 px-4 py-3.5 shadow-[0_6px_18px_rgb(19_48_93/0.03)] sm:px-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* 左簇:搜索 / 能力 / 供应商 / 清空(放不下自动换行) */}
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {/* 搜索 */}
          <div className="relative min-w-0 w-full sm:w-72 lg:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-(--tc-muted)" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t('Plaza Search Placeholder')}
              aria-label={t('Plaza Search Placeholder')}
              className="h-10 w-full rounded-xl border border-(--tc-border)/90 bg-(--tc-surface)/95 pl-9 text-sm text-(--tc-strong) shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition-colors placeholder:text-(--tc-muted) focus-visible:border-(--tc-primary-hover) focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* 能力筛选 */}
          <ConsoleSelect
            value={capability}
            onValueChange={onCapabilityChange}
          >
            <ConsoleSelectTrigger
              aria-label={t('Plaza Filter Capability')}
              className="w-full sm:w-36"
            >
              <ConsoleSelectValue />
            </ConsoleSelectTrigger>
            <ConsoleSelectContent>
              {CAPABILITY_OPTIONS.map((opt) => (
                <ConsoleSelectItem
                  key={opt.value}
                  value={opt.value}
                >
                  {t(opt.labelKey)}
                </ConsoleSelectItem>
              ))}
            </ConsoleSelectContent>
          </ConsoleSelect>

          {/* 供应商筛选 */}
          <ConsoleSelect
            value={vendor}
            onValueChange={onVendorChange}
          >
            <ConsoleSelectTrigger
              aria-label={t('Plaza Filter Vendor')}
              className="w-full sm:w-44"
            >
              <ConsoleSelectValue />
            </ConsoleSelectTrigger>
            <ConsoleSelectContent>
              <ConsoleSelectItem value="all">{t('Plaza All Vendors')}</ConsoleSelectItem>
              {vendorCounts.map((v) => (
                <ConsoleSelectItem
                  key={v.name}
                  value={v.name}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="grid h-4 w-4 place-items-center">{getProviderIcon(v.name, 12)}</span>
                    {v.name}
                    <span className="ml-auto pl-2 text-xs text-(--tc-muted) tabular-nums">{v.count}</span>
                  </span>
                </ConsoleSelectItem>
              ))}
            </ConsoleSelectContent>
          </ConsoleSelect>

          {/* 清空筛选 */}
          <button
            type="button"
            onClick={onClear}
            disabled={!hasFilter}
            title={t('Plaza Clear Title')}
            className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--tc-primary) px-4 text-sm font-semibold whitespace-nowrap text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition-all duration-200 hover:bg-(--tc-primary-hover) hover:shadow-[0_8px_20px_rgb(49_88_232/0.28)] focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <TimerReset className="h-3.5 w-3.5" />
            {t('Plaza Clear')}
          </button>
        </div>

        {/* 右簇:计数 / 排序 / 币种 / 视图(ml-auto 保证与左簇两端对齐) */}
        <div className="ml-auto flex min-h-10 w-full flex-wrap items-center gap-2 lg:w-auto">
          <p
            role="status"
            aria-live="polite"
            className="mr-auto text-xs whitespace-nowrap text-(--tc-muted) lg:mr-1"
          >
            {t('Plaza Showing')} <span className="font-semibold text-(--tc-strong)">{shown}</span> / {total} {t('Plaza Models')}
          </p>

          {/* 排序 */}
          <ConsoleSelect
            value={sort}
            onValueChange={onSortChange}
          >
            <ConsoleSelectTrigger
              aria-label={t('Plaza Sort')}
              className="w-36"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-(--tc-primary-text)" />
              <ConsoleSelectValue />
            </ConsoleSelectTrigger>
            <ConsoleSelectContent>
              <ConsoleSelectItem value="newest">{t('Plaza Sort Newest')}</ConsoleSelectItem>
              <ConsoleSelectItem value="price-asc">{t('Plaza Sort Price Asc')}</ConsoleSelectItem>
              <ConsoleSelectItem value="price-desc">{t('Plaza Sort Price Desc')}</ConsoleSelectItem>
            </ConsoleSelectContent>
          </ConsoleSelect>

          {/* 币种切换 */}
          <div
            role="group"
            aria-label={t('Plaza Currency Group')}
            className="flex h-10 shrink-0 items-center gap-0.5 rounded-lg border border-(--tc-border) bg-(--tc-surface-raised) px-1.25 py-1"
          >
            <button
              type="button"
              aria-pressed={currency === 'CNY'}
              onClick={() => onCurrencyChange('CNY')}
              className={`inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-semibold leading-none whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none ${
                currency === 'CNY' ? 'bg-(--tc-primary) text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-(--tc-muted) hover:bg-(--tc-surface) hover:text-(--tc-primary-text)'
              }`}
            >
              ¥ {t('Plaza CNY')}
            </button>
            <button
              type="button"
              aria-pressed={currency === 'USD'}
              onClick={() => onCurrencyChange('USD')}
              className={`inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-semibold leading-none whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none ${
                currency === 'USD' ? 'bg-(--tc-primary) text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-(--tc-muted) hover:bg-(--tc-surface) hover:text-(--tc-primary-text)'
              }`}
            >
              $ {t('Plaza USD')}
            </button>
          </div>

          {/* 视图切换 */}
          <div
            role="group"
            aria-label={t('Plaza View Group')}
            className="flex h-10 shrink-0 items-center gap-0.5 rounded-lg border border-(--tc-border) bg-(--tc-surface-raised) px-1.25 py-1"
          >
            <button
              type="button"
              aria-pressed={view === 'list'}
              onClick={() => onViewChange('list')}
              title={t('Plaza List View')}
              className={`grid h-7 w-8 cursor-pointer place-items-center rounded-md leading-none transition-colors focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none ${
                view === 'list' ? 'bg-(--tc-primary) text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-(--tc-muted) hover:bg-(--tc-surface) hover:text-(--tc-primary-text)'
              }`}
            >
              <TableProperties className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-pressed={view === 'card'}
              onClick={() => onViewChange('card')}
              title={t('Plaza Card View')}
              className={`grid h-7 w-8 cursor-pointer place-items-center rounded-md leading-none transition-colors focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none ${
                view === 'card' ? 'bg-(--tc-primary) text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-(--tc-muted) hover:bg-(--tc-surface) hover:text-(--tc-primary-text)'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 开发者 chips */}
      <div className="mt-3 flex min-w-0 items-center gap-3 border-t border-(--tc-border)/70 pt-3">
        <div className="hidden shrink-0 items-center gap-1.5 text-xs font-semibold text-(--tc-body) sm:flex">
          <SlidersHorizontal className="h-3.5 w-3.5 text-(--tc-primary-text)" />
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
      className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none ${
        active
          ? 'border-(--tc-primary) bg-(--tc-primary) text-white shadow-[0_4px_10px_rgb(49_88_232/0.18)]'
          : 'border-transparent bg-(--tc-surface-raised) text-(--tc-body) hover:border-(--tc-primary-hover)/40 hover:bg-(--tc-surface) hover:text-(--tc-primary-text)'
      }`}
    >
      <span className="grid h-4 w-4 shrink-0 place-items-center">{getProviderIcon(name, 12)}</span>
      {name}
      <span className="tabular-nums opacity-75">{count}</span>
    </button>
  )
}
