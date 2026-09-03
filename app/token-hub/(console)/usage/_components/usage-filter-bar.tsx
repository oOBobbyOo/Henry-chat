'use client'

import { CalendarRange, ChevronDown, TimerReset } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { FILTER_ALL, RANGE_CONFIG, type UsageFilters, type UsageRange } from '../page'

/**
 * 用量分析筛选栏 —— 时间范围 + 粒度 + 部门/用户/模型/供应商/客户端 + 清空
 */
export function UsageFilterBar({
  range,
  onRangeChange,
  dept,
  onDeptChange,
  user,
  onUserChange,
  filters,
  onFiltersChange,
  modelOptions,
  providerOptions,
  clientOptions,
  hasFilter,
  onClear,
}: {
  range: UsageRange
  onRangeChange: (v: UsageRange) => void
  dept: string
  onDeptChange: (v: string) => void
  user: string
  onUserChange: (v: string) => void
  filters: UsageFilters
  onFiltersChange: (v: UsageFilters) => void
  modelOptions: string[]
  providerOptions: string[]
  clientOptions: string[]
  hasFilter: boolean
  onClear: () => void
}) {
  const { t } = useT('token-hub')

  const rangeOptions: { key: UsageRange; label: string }[] = [
    { key: '24h', label: t('Usage Range 24h') },
    { key: '7d', label: t('Usage Range 7d') },
    { key: '30d', label: t('Usage Range 30d') },
  ]

  /** 粒度文案(与时间范围联动:24h 按小时,其余按天) */
  const granularityLabel = RANGE_CONFIG[range].granularity === 'hour' ? t('Usage Granularity Hour') : t('Usage Granularity Day')

  /** 通用筛选下拉项 */
  const renderItems = (values: string[], allLabel: string) => (
    <>
      <SelectItem value={FILTER_ALL}>{allLabel}</SelectItem>
      {values.map((v) => (
        <SelectItem
          key={v}
          value={v}
        >
          {v}
        </SelectItem>
      ))}
    </>
  )

  return (
    <section
      aria-label={t('Usage Filter Label')}
      className="grid gap-2.5 rounded-[18px] border border-[#dce5f6]/80 bg-[#f7f9fd]/70 px-4 py-3.5 shadow-[0_6px_18px_rgb(19_48_93/0.03)] sm:px-5"
    >
      <div className="flex flex-wrap items-center gap-2.5">
        {/* 时间范围切换 */}
        <div
          role="group"
          aria-label={t('Usage Range Group')}
          className="flex h-10 shrink-0 items-center gap-0.5 rounded-lg border border-[#dce5f6] bg-white px-1.25 py-1"
        >
          {rangeOptions.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={range === key}
              onClick={() => onRangeChange(key)}
              className={`inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-semibold leading-none whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none ${
                range === key ? 'bg-[#294fd4] text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-[#8a9bc0] hover:bg-[#f4f7ff] hover:text-[#4269ee]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 粒度徽标 */}
        <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#dce5f6] bg-white px-3 text-xs font-semibold whitespace-nowrap text-[#5b6b8c]">
          <CalendarRange className="h-3.5 w-3.5 text-[#4269ee]" />
          {granularityLabel}
        </span>

        {/* 部门 */}
        <Select
          value={dept}
          onValueChange={onDeptChange}
        >
          <SelectTrigger
            aria-label={t('Usage Filter Dept')}
            className="h-10 w-auto cursor-pointer border-[#dce5f6] bg-white text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)]"
          >
            <SelectValue />
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </SelectTrigger>
          <SelectContent>{renderItems([t('Usage Dept Tech')], t('Usage Filter Dept All'))}</SelectContent>
        </Select>

        {/* 用户 */}
        <Select
          value={user}
          onValueChange={onUserChange}
        >
          <SelectTrigger
            aria-label={t('Usage Filter User')}
            className="h-10 w-auto cursor-pointer border-[#dce5f6] bg-white text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)]"
          >
            <SelectValue />
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </SelectTrigger>
          <SelectContent>{renderItems([t('Usage User Henry')], t('Usage Filter User All'))}</SelectContent>
        </Select>

        {/* 模型 */}
        <Select
          value={filters.model}
          onValueChange={(v) => onFiltersChange({ ...filters, model: v })}
        >
          <SelectTrigger
            aria-label={t('Usage Filter Model')}
            className="h-10 w-auto max-w-44 cursor-pointer border-[#dce5f6] bg-white text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)]"
          >
            <SelectValue />
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </SelectTrigger>
          <SelectContent>{renderItems(modelOptions, t('Usage Filter Model All'))}</SelectContent>
        </Select>

        {/* 供应商 */}
        <Select
          value={filters.provider}
          onValueChange={(v) => onFiltersChange({ ...filters, provider: v })}
        >
          <SelectTrigger
            aria-label={t('Usage Filter Provider')}
            className="h-10 w-auto max-w-44 cursor-pointer border-[#dce5f6] bg-white text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)]"
          >
            <SelectValue />
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </SelectTrigger>
          <SelectContent>{renderItems(providerOptions, t('Usage Filter Provider All'))}</SelectContent>
        </Select>

        {/* 客户端 */}
        <Select
          value={filters.client}
          onValueChange={(v) => onFiltersChange({ ...filters, client: v })}
        >
          <SelectTrigger
            aria-label={t('Usage Filter Client')}
            className="h-10 w-auto max-w-44 cursor-pointer border-[#dce5f6] bg-white text-[#0f1c3a] shadow-[0_1px_1px_rgb(15_38_79/0.02)]"
          >
            <SelectValue />
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </SelectTrigger>
          <SelectContent>{renderItems(clientOptions, t('Usage Filter Client All'))}</SelectContent>
        </Select>

        {/* 清空筛选 */}
        <button
          type="button"
          onClick={onClear}
          disabled={!hasFilter}
          title={t('Usage Clear Title')}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#294fd4] px-4 text-sm font-semibold whitespace-nowrap text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition-all duration-200 hover:bg-[#4269ee] hover:shadow-[0_8px_20px_rgb(49_88_232/0.28)] focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <TimerReset className="h-3.5 w-3.5" />
          {t('Usage Clear')}
        </button>
      </div>
    </section>
  )
}
