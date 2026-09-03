'use client'

import { SlidersHorizontal } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { ConsoleSelect, ConsoleSelectContent, ConsoleSelectItem, ConsoleSelectTrigger, ConsoleSelectValue } from '@/components/token-hub/select'

import { FILTER_ALL, type McpFilters } from '../page'

/**
 * MCP 市场筛选栏 —— 价格 / 凭据 / 状态 + 服务数量
 */
export function McpMarketToolbar({ filters, onFilterChange, shown }: { filters: McpFilters; onFilterChange: (key: keyof McpFilters, value: string) => void; shown: number }) {
  const { t } = useT('token-hub')

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
      <ConsoleSelect
        value={filters.price}
        onValueChange={(v) => onFilterChange('price', v)}
      >
        <ConsoleSelectTrigger aria-label={t('Mcp Filter Price')}>
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
        <ConsoleSelectTrigger aria-label={t('Mcp Filter Credential')}>
          <ConsoleSelectValue />
        </ConsoleSelectTrigger>
        <ConsoleSelectContent>
          <ConsoleSelectItem value={FILTER_ALL}>{t('Mcp Filter Credential All')}</ConsoleSelectItem>
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
        <ConsoleSelectTrigger aria-label={t('Mcp Filter Status')}>
          <ConsoleSelectValue />
        </ConsoleSelectTrigger>
        <ConsoleSelectContent>
          <ConsoleSelectItem value={FILTER_ALL}>{t('Mcp Filter Status All')}</ConsoleSelectItem>
          <ConsoleSelectItem value="active">{t('Mcp Status Active')}</ConsoleSelectItem>
          <ConsoleSelectItem value="disabled">{t('Mcp Status Disabled')}</ConsoleSelectItem>
        </ConsoleSelectContent>
      </ConsoleSelect>

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
