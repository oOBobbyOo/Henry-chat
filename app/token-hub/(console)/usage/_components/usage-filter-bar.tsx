'use client'

import { CalendarRange, TimerReset } from 'lucide-react'
import { useT } from 'next-i18next/client'

import {
  ConsoleSelect,
  ConsoleSelectContent,
  ConsoleSelectItem,
  ConsoleSelectTrigger,
  ConsoleSelectValue,
} from '@/components/token-hub/select'

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
  const granularityLabel =
    RANGE_CONFIG[range].granularity === 'hour'
      ? t('Usage Granularity Hour')
      : t('Usage Granularity Day')

  /** 通用筛选下拉项 */
  const renderItems = (values: string[], allLabel: string) => (
    <>
      <ConsoleSelectItem value={FILTER_ALL}>{allLabel}</ConsoleSelectItem>
      {values.map((v) => (
        <ConsoleSelectItem
          key={v}
          value={v}
        >
          {v}
        </ConsoleSelectItem>
      ))}
    </>
  )

  return (
    <section
      aria-label={t('Usage Filter Label')}
      className="grid gap-2.5 rounded-[18px] border border-(--tc-border)/80 bg-(--tc-surface-raised)/70 px-4 py-3.5 shadow-[0_6px_18px_rgb(19_48_93/0.03)] sm:px-5"
    >
      <div className="flex flex-wrap items-center gap-2.5">
        {/* 时间范围切换 */}
        <div
          role="group"
          aria-label={t('Usage Range Group')}
          className="flex h-10 shrink-0 items-center gap-0.5 rounded-lg border border-(--tc-border) bg-(--tc-surface) px-1.25 py-1"
        >
          {rangeOptions.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={range === key}
              onClick={() => onRangeChange(key)}
              className={`inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-xs font-semibold leading-none whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none ${
                range === key
                  ? 'bg-(--tc-primary) text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]'
                  : 'text-(--tc-muted) hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text)'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 粒度徽标 */}
        <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-(--tc-border) bg-(--tc-surface) px-3 text-xs font-semibold whitespace-nowrap text-(--tc-body)">
          <CalendarRange className="h-3.5 w-3.5 text-(--tc-primary-text)" />
          {granularityLabel}
        </span>

        {/* 部门 */}
        <ConsoleSelect
          value={dept}
          onValueChange={onDeptChange}
        >
          <ConsoleSelectTrigger
            aria-label={t('Usage Filter Dept')}
            className="w-auto"
          >
            <ConsoleSelectValue />
          </ConsoleSelectTrigger>
          <ConsoleSelectContent>
            {renderItems([t('Usage Dept Tech')], t('Usage Filter Dept All'))}
          </ConsoleSelectContent>
        </ConsoleSelect>

        {/* 用户 */}
        <ConsoleSelect
          value={user}
          onValueChange={onUserChange}
        >
          <ConsoleSelectTrigger
            aria-label={t('Usage Filter User')}
            className="w-auto"
          >
            <ConsoleSelectValue />
          </ConsoleSelectTrigger>
          <ConsoleSelectContent>
            {renderItems([t('Usage User Henry')], t('Usage Filter User All'))}
          </ConsoleSelectContent>
        </ConsoleSelect>

        {/* 模型 */}
        <ConsoleSelect
          value={filters.model}
          onValueChange={(v) => onFiltersChange({ ...filters, model: v })}
        >
          <ConsoleSelectTrigger
            aria-label={t('Usage Filter Model')}
            className="w-auto max-w-44"
          >
            <ConsoleSelectValue />
          </ConsoleSelectTrigger>
          <ConsoleSelectContent>
            {renderItems(modelOptions, t('Usage Filter Model All'))}
          </ConsoleSelectContent>
        </ConsoleSelect>

        {/* 供应商 */}
        <ConsoleSelect
          value={filters.provider}
          onValueChange={(v) => onFiltersChange({ ...filters, provider: v })}
        >
          <ConsoleSelectTrigger
            aria-label={t('Usage Filter Provider')}
            className="w-auto max-w-44"
          >
            <ConsoleSelectValue />
          </ConsoleSelectTrigger>
          <ConsoleSelectContent>
            {renderItems(providerOptions, t('Usage Filter Provider All'))}
          </ConsoleSelectContent>
        </ConsoleSelect>

        {/* 客户端 */}
        <ConsoleSelect
          value={filters.client}
          onValueChange={(v) => onFiltersChange({ ...filters, client: v })}
        >
          <ConsoleSelectTrigger
            aria-label={t('Usage Filter Client')}
            className="w-auto max-w-44"
          >
            <ConsoleSelectValue />
          </ConsoleSelectTrigger>
          <ConsoleSelectContent>
            {renderItems(clientOptions, t('Usage Filter Client All'))}
          </ConsoleSelectContent>
        </ConsoleSelect>

        {/* 清空筛选 */}
        <button
          type="button"
          onClick={onClear}
          disabled={!hasFilter}
          title={t('Usage Clear Title')}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--tc-primary) px-4 text-sm font-semibold whitespace-nowrap text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition-all duration-200 hover:bg-(--tc-primary-hover) hover:shadow-[0_8px_20px_rgb(49_88_232/0.28)] focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <TimerReset className="h-3.5 w-3.5" />
          {t('Usage Clear')}
        </button>
      </div>
    </section>
  )
}
