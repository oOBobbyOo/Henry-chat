'use client'

import { useEffect, useRef, useState } from 'react'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useT } from 'next-i18next/client'

import {
  ConsoleSelect,
  ConsoleSelectContent,
  ConsoleSelectItem,
  ConsoleSelectTrigger,
  ConsoleSelectValue,
} from '@/components/token-hub/select'

import { FILTER_ALL, type McpFilters } from '../page'

/** 搜索输入防抖间隔(ms) */
const SEARCH_DEBOUNCE_MS = 300

/**
 * MCP 市场筛选栏 —— 搜索 / 价格 / 凭据 / 状态 + 服务数量
 */
export function McpMarketToolbar({
  filters,
  onFilterChange,
  shown,
}: {
  filters: McpFilters
  onFilterChange: (key: keyof McpFilters, value: string) => void
  shown: number
}) {
  const { t } = useT('token-hub')

  // —— 搜索(本地受控 + 防抖上报, 避免每次键入都触发查询) ——
  const [search, setSearch] = useState(filters.q)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => timerRef.current !== null && clearTimeout(timerRef.current), [])

  /** 更新搜索词(防抖后写入筛选条件) */
  const handleSearch = (value: string) => {
    setSearch(value)
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onFilterChange('q', value), SEARCH_DEBOUNCE_MS)
  }

  /** 清空搜索(立即上报) */
  const clearSearch = () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    setSearch('')
    onFilterChange('q', '')
  }

  return (
    <section
      aria-label={t('Mcp Filter Label')}
      className="flex flex-col gap-3 rounded-[18px] border border-(--tc-border)/80 bg-(--tc-surface-raised)/70 px-4 py-3.5 shadow-[0_6px_18px_rgb(19_48_93/0.03)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:px-5"
    >
      {/* 顶部行: 筛选标签 + 移动端数量(桌面端数量在最右侧) */}
      <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap text-(--tc-body)">
          <SlidersHorizontal className="h-3.5 w-3.5 text-(--tc-primary-text)" />
          {t('Mcp Filter Label')}
        </span>
        <p className="text-xs whitespace-nowrap text-(--tc-muted) sm:hidden">
          {t('Mcp Services Label')}{' '}
          <span className="font-semibold text-(--tc-strong)">{shown}</span> {t('Mcp Services Unit')}
        </p>
      </div>

      {/* 控件区: 移动端每项独占一行, sm+ 拆开还原为内联流式布局 */}
      <div className="grid gap-2.5 sm:contents">
        {/* 价格筛选 */}
        <ConsoleSelect
          value={filters.price}
          onValueChange={(v) => onFilterChange('price', v)}
        >
          <ConsoleSelectTrigger
            aria-label={t('Mcp Filter Price')}
            className="w-full sm:w-auto"
          >
            <ConsoleSelectValue />
          </ConsoleSelectTrigger>
          <ConsoleSelectContent>
            <ConsoleSelectItem value={FILTER_ALL}>{t('Mcp Filter Price All')}</ConsoleSelectItem>
            <ConsoleSelectItem value="free">{t('Mcp Price Free')}</ConsoleSelectItem>
            <ConsoleSelectItem value="paid">{t('Mcp Price Paid')}</ConsoleSelectItem>
          </ConsoleSelectContent>
        </ConsoleSelect>

        {/* 凭据筛选 */}
        <ConsoleSelect
          value={filters.credential}
          onValueChange={(v) => onFilterChange('credential', v)}
        >
          <ConsoleSelectTrigger
            aria-label={t('Mcp Filter Credential')}
            className="w-full sm:w-auto"
          >
            <ConsoleSelectValue />
          </ConsoleSelectTrigger>
          <ConsoleSelectContent>
            <ConsoleSelectItem value={FILTER_ALL}>
              {t('Mcp Filter Credential All')}
            </ConsoleSelectItem>
            <ConsoleSelectItem value="platform">{t('Mcp Credential Platform')}</ConsoleSelectItem>
            <ConsoleSelectItem value="user">{t('Mcp Credential User')}</ConsoleSelectItem>
            <ConsoleSelectItem value="none">{t('Mcp Credential None')}</ConsoleSelectItem>
          </ConsoleSelectContent>
        </ConsoleSelect>

        {/* 状态筛选 */}
        <ConsoleSelect
          value={filters.status}
          onValueChange={(v) => onFilterChange('status', v)}
        >
          <ConsoleSelectTrigger
            aria-label={t('Mcp Filter Status')}
            className="w-full sm:w-auto"
          >
            <ConsoleSelectValue />
          </ConsoleSelectTrigger>
          <ConsoleSelectContent>
            <ConsoleSelectItem value={FILTER_ALL}>{t('Mcp Filter Status All')}</ConsoleSelectItem>
            <ConsoleSelectItem value="active">{t('Mcp Status Active')}</ConsoleSelectItem>
            <ConsoleSelectItem value="disabled">{t('Mcp Status Disabled')}</ConsoleSelectItem>
          </ConsoleSelectContent>
        </ConsoleSelect>

        {/* 搜索 */}
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-(--tc-muted)" />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('Mcp Search Placeholder')}
            aria-label={t('Mcp Search Placeholder')}
            className="h-9 w-full rounded-xl border border-(--tc-border) bg-(--tc-surface) pr-8 pl-9 text-[13px] text-(--tc-strong) shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition-colors outline-none placeholder:text-(--tc-muted) focus-visible:border-(--tc-primary-hover)/40 focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              title={t('Mcp Search Clear')}
              aria-label={t('Mcp Search Clear')}
              className="absolute top-1/2 right-2.5 inline-flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-(--tc-muted) transition-colors hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-2 focus-visible:ring-(--tc-primary-hover)/35 focus-visible:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* 数量(桌面端, 固定最右侧) */}
      <p
        role="status"
        aria-live="polite"
        className="ml-auto hidden text-xs whitespace-nowrap text-(--tc-muted) sm:block"
      >
        {t('Mcp Services Label')} <span className="font-semibold text-(--tc-strong)">{shown}</span>{' '}
        {t('Mcp Services Unit')}
      </p>
    </section>
  )
}
