'use client'

import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { FILTER_ALL, type McpFilters } from '../page'

/**
 * MCP 市场筛选栏 —— 价格 / 凭据 / 状态 + 服务数量
 */
export function McpMarketToolbar({ filters, onFilterChange, shown }: { filters: McpFilters; onFilterChange: (key: keyof McpFilters, value: string) => void; shown: number }) {
  const { t } = useT('token-hub')

  const selectClass = 'h-10 w-auto cursor-pointer border-[#dce5f6] bg-white text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)]'

  return (
    <section
      aria-label={t('Mcp Filter Label')}
      className="flex flex-wrap items-center gap-2.5 rounded-[18px] border border-[#dce5f6]/80 bg-[#f7f9fd]/70 px-4 py-3.5 shadow-[0_6px_18px_rgb(19_48_93/0.03)] sm:px-5"
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap text-[#5b6b8c]">
        <SlidersHorizontal className="h-3.5 w-3.5 text-[#4269ee]" />
        {t('Mcp Filter Label')}
      </span>

      {/* 价格筛选 */}
      <Select
        value={filters.price}
        onValueChange={(v) => onFilterChange('price', v)}
      >
        <SelectTrigger
          aria-label={t('Mcp Filter Price')}
          className={selectClass}
        >
          <SelectValue />
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL}>{t('Mcp Filter Price All')}</SelectItem>
          <SelectItem value="free">{t('Mcp Price Free')}</SelectItem>
          <SelectItem value="paid">{t('Mcp Price Paid')}</SelectItem>
        </SelectContent>
      </Select>

      {/* 凭据筛选 */}
      <Select
        value={filters.credential}
        onValueChange={(v) => onFilterChange('credential', v)}
      >
        <SelectTrigger
          aria-label={t('Mcp Filter Credential')}
          className={selectClass}
        >
          <SelectValue />
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL}>{t('Mcp Filter Credential All')}</SelectItem>
          <SelectItem value="platform">{t('Mcp Credential Platform')}</SelectItem>
          <SelectItem value="user">{t('Mcp Credential User')}</SelectItem>
          <SelectItem value="none">{t('Mcp Credential None')}</SelectItem>
        </SelectContent>
      </Select>

      {/* 状态筛选 */}
      <Select
        value={filters.status}
        onValueChange={(v) => onFilterChange('status', v)}
      >
        <SelectTrigger
          aria-label={t('Mcp Filter Status')}
          className={selectClass}
        >
          <SelectValue />
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL}>{t('Mcp Filter Status All')}</SelectItem>
          <SelectItem value="active">{t('Mcp Status Active')}</SelectItem>
          <SelectItem value="disabled">{t('Mcp Status Disabled')}</SelectItem>
        </SelectContent>
      </Select>

      <p
        role="status"
        aria-live="polite"
        className="ml-auto text-xs whitespace-nowrap text-[#8a9bc0]"
      >
        {t('Mcp Services Label')} <span className="font-semibold text-[#0f1c3a]">{shown}</span> {t('Mcp Services Unit')}
      </p>
    </section>
  )
}
