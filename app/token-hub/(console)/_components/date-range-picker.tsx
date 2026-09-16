'use client'

import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
} from 'lucide-react'
import { useT } from 'next-i18next/client'
import { zhCN } from 'react-day-picker/locale'

import { Button } from '@/components/ui/button'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { dayjs } from '@/lib/dayjs'
import { formatDate } from '@/lib/time'
import { cn } from '@/lib/utils'

/** 快速选择 key */
export type DateRangePresetKey = 'cm' | '3m' | '6m' | '12m' | '24m'

/** 时间范围值(同时携带 days 供接口请求使用) */
export interface DateRangeValue {
  /** 窗口天数(作为接口 days 参数) */
  days: number
  /** 起始日期 YYYY-MM-DD */
  start: string
  /** 结束日期 YYYY-MM-DD */
  end: string
  /** 命中的快速选择 key,自定义范围为 null */
  preset: DateRangePresetKey | null
}

/** Tab 类型 */
type PickerTab = 'quick' | 'custom'

/** 快速选择项顺序 */
const PRESET_ORDER: DateRangePresetKey[] = ['cm', '3m', '6m', '12m', '24m']

/** 快速选择项 → 窗口天数(当月除外,按月起始日动态计算) */
const PRESET_DAYS: Record<Exclude<DateRangePresetKey, 'cm'>, number> = {
  '3m': 90,
  '6m': 180,
  '12m': 365,
  '24m': 730,
}

/** 快速选择项 → 文案 key */
const PRESET_LABEL_KEYS: Record<DateRangePresetKey, string> = {
  cm: 'Range Month',
  '3m': 'Range 3M',
  '6m': 'Range 6M',
  '12m': 'Range 12M',
  '24m': 'Range 24M',
}

/** 按快速选择 key 生成范围值(结束日期为今天) */
export function createPresetRange(preset: DateRangePresetKey): DateRangeValue {
  const end = dayjs()
  // 当月:从月初到今天
  if (preset === 'cm') {
    const start = end.startOf('month')
    return {
      days: end.diff(start, 'day') + 1,
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      preset,
    }
  }
  const days = PRESET_DAYS[preset]
  return {
    days,
    start: end.subtract(days - 1, 'day').format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
    preset,
  }
}

/** 根据起止日期匹配快速选择 key(结束日期必须是今天才算命中) */
function matchPreset(start: string, end: string): DateRangePresetKey | null {
  if (!dayjs(end).isSame(dayjs(), 'day')) return null
  if (start === dayjs().startOf('month').format('YYYY-MM-DD')) return 'cm'
  const days = dayjs(end).diff(dayjs(start), 'day') + 1
  return PRESET_ORDER.find((key) => key !== 'cm' && PRESET_DAYS[key] === days) ?? null
}

/**
 * 通用时间范围选择 —— 点击触发按钮弹出浮层,样式对齐生产站(aimix.bbgameonline.com/reports 成本分析 右侧时间选择器):
 * 触发按钮 h-10 / text-sm / 常规字重 / 主色日历图标;弹层 288px、紧凑字号(Tab 11px、预设 10px、日期 10px、星期 8px),
 * 自定义 Tab 为「窗口天数 + 起止概览 + 边框日历」三段式布局。
 * 「快速选择」Tab:当月 / 近 3 / 6 / 12 / 24 个月网格,点击即生效并关闭;
 * 「自定义」Tab:起止日期概览 + 日历范围框选(上/下月切换与「今天」快捷跳转),选完后点击「应用范围」生效
 */
export function DateRangePicker({
  value,
  onChange,
  maxDays = 730,
  className,
}: {
  /** 当前范围值 */
  value: DateRangeValue
  /** 范围变更回调(快速选择点击或自定义应用时触发) */
  onChange: (value: DateRangeValue) => void
  /** 允许的最大窗口天数 */
  maxDays?: number
  /** 追加到触发按钮的类名 */
  className?: string
}) {
  const { t } = useT('token-hub')
  const [open, setOpen] = useState(false)
  // 当前 Tab
  const [tab, setTab] = useState<PickerTab>('quick')
  // 「自定义」Tab 内草稿范围(点击「应用范围」前不生效);未开始框选时为 undefined
  const [draft, setDraft] = useState<DateRange>()
  // 受控日历月份,供「今天」快捷跳转
  const [month, setMonth] = useState<Date>()

  /** 打开浮层时按当前值初始化 Tab、草稿与日历月份 */
  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      setTab(value.preset ? 'quick' : 'custom')
      // 自定义 Tab 默认选中当月(1 号 ~ 今天);当前已是自定义范围则保留原起止
      const defaultDraft = value.preset
        ? {
            from: dayjs(createPresetRange('cm').start).toDate(),
            to: dayjs(createPresetRange('cm').end).toDate(),
          }
        : { from: dayjs(value.start).toDate(), to: dayjs(value.end).toDate() }
      setDraft(defaultDraft)
      setMonth(dayjs(value.end).toDate())
    }
  }

  /** 快速选择:立即生效并关闭 */
  const handlePresetClick = (key: DateRangePresetKey) => {
    onChange(createPresetRange(key))
    setOpen(false)
  }

  /** 「今天」:跳回当月并选中今天 */
  const handleTodayClick = () => {
    const today = dayjs()
    setMonth(today.toDate())
    setDraft({ from: today.toDate(), to: today.toDate() })
  }

  /** 应用自定义范围 */
  const handleApplyClick = () => {
    if (!draft?.from || !draft?.to) return
    const start = dayjs(draft.from).format('YYYY-MM-DD')
    const end = dayjs(draft.to).format('YYYY-MM-DD')
    const days = dayjs(end).diff(dayjs(start), 'day') + 1
    if (days > maxDays) return
    onChange({ days, start, end, preset: matchPreset(start, end) })
    setOpen(false)
  }

  // 草稿是否已选定完整区间
  const draftComplete = Boolean(draft?.from && draft?.to)
  const draftDays =
    draft?.from && draft?.to ? dayjs(draft.to).diff(dayjs(draft.from), 'day') + 1 : 0
  const draftTooLong = draftDays > maxDays

  // 触发按钮文案:展示日期区间(与参考站一致的全角波浪号分隔)
  const triggerLabel = `${formatDate(value.start)} ～ ${formatDate(value.end)}`

  return (
    <div className="relative min-w-0 sm:w-[236px]">
      <Popover
        open={open}
        onOpenChange={handleOpenChange}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="lg"
            aria-label={t('Range Trigger')}
            className={cn(
              'h-10 w-full gap-2 rounded-xl border-(--tc-border) bg-(--tc-surface) px-3.5 text-sm font-normal whitespace-nowrap text-(--tc-strong) shadow-[0_1px_1px_rgb(15_38_79/0.02)] hover:border-(--tc-primary)/40 hover:bg-(--tc-surface) hover:text-(--tc-strong) aria-expanded:border-(--tc-primary)/30 aria-expanded:bg-(--tc-blue-soft) aria-expanded:text-(--tc-primary-text)',
              className,
            )}
          >
            <CalendarDays className="h-[15px] w-[15px] shrink-0 text-(--tc-primary)" />
            <span className="tabular-nums text-[12px]">{triggerLabel}</span>
            <ChevronDown
              className={cn(
                'h-[15px] w-[15px] shrink-0 text-(--tc-muted) transition-transform',
                open && 'rotate-180',
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={5}
          className="max-h-[calc(100vh-1rem)] w-[min(288px,calc(100vw-1rem))] gap-0 overflow-y-auto rounded-xl border-(--tc-border) bg-(--tc-surface) p-0 text-(--tc-body) shadow-[0_12px_30px_rgb(15_38_79/0.13),0_2px_8px_rgb(15_38_79/0.05)] ring-0"
        >
          {/* 右上角关闭 */}
          <button
            type="button"
            aria-label={t('Range Close')}
            onClick={() => setOpen(false)}
            className="absolute top-1.5 right-1.5 z-10 grid h-6 w-6 cursor-pointer place-items-center rounded-md text-(--tc-muted) transition-colors hover:bg-(--tc-surface-raised) hover:text-(--tc-body)"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="p-2 pt-2.5">
            {/* Tab 头(与参考站一致:容器内滚,右上角让位关闭按钮) */}
            <div
              role="tablist"
              aria-label={t('Range Type')}
              className="grid grid-cols-2 gap-1 rounded-lg bg-(--tc-surface-raised) p-1 pr-7"
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'quick'}
                onClick={() => setTab('quick')}
                className={cn(
                  'min-h-8 cursor-pointer rounded-md px-2.5 text-[11px] font-semibold transition-colors',
                  tab === 'quick'
                    ? 'bg-(--tc-surface) text-(--tc-primary-text) shadow-[0_1px_4px_rgb(15_38_79/0.08)]'
                    : 'text-(--tc-muted) hover:text-(--tc-body)',
                )}
              >
                {t('Range Quick Title')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'custom'}
                onClick={() => setTab('custom')}
                className={cn(
                  'min-h-8 cursor-pointer rounded-md px-2.5 text-[11px] font-semibold transition-colors',
                  tab === 'custom'
                    ? 'bg-(--tc-surface) text-(--tc-primary-text) shadow-[0_1px_4px_rgb(15_38_79/0.08)]'
                    : 'text-(--tc-muted) hover:text-(--tc-body)',
                )}
              >
                {t('Range Custom')}
              </button>
            </div>

            {/* 快速选择:当月 / 近 N 个月网格 */}
            {tab === 'quick' && (
              <div className="mt-2 grid grid-cols-3 gap-1">
                {PRESET_ORDER.map((key) => {
                  const active = value.preset === key
                  return (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-pressed={active}
                      onClick={() => handlePresetClick(key)}
                      className={cn(
                        'flex min-h-8 justify-between gap-1 rounded-md border px-1.5 text-[10px] font-semibold text-(--tc-body) shadow-none hover:border-(--tc-primary)/40 hover:bg-(--tc-surface-raised) hover:text-(--tc-body)',
                        active &&
                          'border-(--tc-primary)/25 bg-(--tc-blue-soft) text-(--tc-primary-text) hover:border-(--tc-primary)/25 hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text)',
                      )}
                    >
                      <span className="truncate">{t(PRESET_LABEL_KEYS[key])}</span>
                      {active && (
                        <Check className="h-[15px] w-[15px] shrink-0 text-(--tc-primary)" />
                      )}
                    </Button>
                  )
                })}
              </div>
            )}

            {/* 自定义:窗口天数 + 起止概览 + 日历 + 应用范围 */}
            {tab === 'custom' && (
              <div className="mt-2 flex flex-col gap-2">
                {/* 窗口天数 / 超限提示 */}
                <div className="rounded-lg border border-(--tc-border)/80 bg-(--tc-surface-raised)/60 p-1">
                  <div className="flex h-4 items-center justify-end px-1 text-[10px] font-semibold text-(--tc-primary-text)">
                    {draftTooLong ? (
                      <span className="text-(--tc-danger)">
                        {t('Range Max Hint', { count: maxDays })}
                      </span>
                    ) : (
                      draftComplete && t('Range Days', { count: draftDays })
                    )}
                  </div>
                </div>

                {/* 起止日期概览 */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
                  <div
                    className={cn(
                      'min-w-0 rounded-md border px-1.5 py-1 text-left',
                      draft?.from
                        ? 'border-(--tc-primary)/40 bg-(--tc-surface) shadow-[0_1px_3px_rgb(15_38_79/0.06)]'
                        : 'border-transparent',
                    )}
                  >
                    <span className="block text-[9px] font-semibold leading-3 text-(--tc-muted)">
                      {t('Range Start Date')}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] font-bold leading-3.5 tabular-nums text-(--tc-strong)">
                      {draft?.from ? formatDate(draft.from) : '--'}
                    </span>
                  </div>
                  <ArrowRight className="h-[13px] w-[13px] shrink-0 text-(--tc-muted)" />
                  <div
                    className={cn(
                      'min-w-0 rounded-md border px-1.5 py-1 text-left',
                      draft?.to
                        ? 'border-(--tc-primary)/40 bg-(--tc-surface) shadow-[0_1px_3px_rgb(15_38_79/0.06)]'
                        : 'border-transparent',
                    )}
                  >
                    <span className="block text-[9px] font-semibold leading-3 text-(--tc-muted)">
                      {t('Range End Date')}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] font-bold leading-3.5 tabular-nums text-(--tc-strong)">
                      {draft?.to ? formatDate(draft.to) : '--'}
                    </span>
                  </div>
                </div>

                {/* 日历范围框选 */}
                <section
                  aria-label={t('Range Calendar')}
                  className="rounded-lg border border-(--tc-border)/80 bg-(--tc-surface) p-1.5"
                >
                  <Calendar
                    mode="range"
                    locale={zhCN}
                    numberOfMonths={1}
                    selected={draft}
                    onSelect={setDraft}
                    month={month}
                    onMonthChange={setMonth}
                    disabled={{ after: dayjs().endOf('day').toDate() }}
                    // 紧凑单元格 + 将日历的 muted/primary 语义色映射为蓝色主题色,使范围高亮与浮层主题一致
                    className="w-full [--cell-size:--spacing(6)] [--muted:var(--tc-blue-soft)] [--primary:var(--tc-primary)]"
                    classNames={{
                      month: 'flex w-full flex-col gap-1.5 pt-(--cell-size)',
                      weekdays: 'mt-1.5 flex',
                      weekday: 'flex-1 py-0.5 text-[8px] font-bold text-(--tc-muted) select-none',
                      week: 'mt-0 flex w-full',
                      day_button: 'h-6 text-[10px] font-semibold tabular-nums',
                      range_start: 'relative isolate z-0 rounded-l-(--cell-radius)',
                      range_end: 'relative isolate z-0 rounded-r-(--cell-radius)',
                      range_middle: 'rounded-none',
                      outside: 'text-(--tc-muted)/50 aria-selected:text-(--tc-muted)/50',
                      disabled: 'text-(--tc-muted) opacity-50',
                    }}
                    components={{
                      // 标题并入自定义导航行(左侧「< 年月 >」+ 右侧「今天」),仅保留屏幕阅读器可读的标题
                      MonthCaption: ({ calendarMonth }) => (
                        <span className="sr-only">
                          {dayjs(calendarMonth.date).format('YYYY年MM月')}
                        </span>
                      ),
                      // Nav 由 rdp 渲染在 months 层(与 month 并列),需保持默认的绝对定位浮在日历上方;
                      // month 顶部 pt-(--cell-size) 为导航行留位
                      Nav: ({ onPreviousClick, onNextClick, previousMonth, nextMonth }) => (
                        <nav className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1">
                          <div className="flex items-center gap-0.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={t('Range Prev Month')}
                              disabled={!previousMonth}
                              onClick={onPreviousClick}
                              className="h-6 w-6 rounded-md p-0 text-(--tc-body) hover:bg-(--tc-surface-raised) hover:text-(--tc-strong)"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[88px] text-center text-[11px] font-bold tabular-nums text-(--tc-strong)">
                              {month ? dayjs(month).format('YYYY年MM月') : ''}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={t('Range Next Month')}
                              disabled={!nextMonth}
                              onClick={onNextClick}
                              className="h-6 w-6 rounded-md p-0 text-(--tc-body) hover:bg-(--tc-surface-raised) hover:text-(--tc-strong)"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleTodayClick}
                            className="inline-flex h-6 items-center gap-1 rounded-md px-1 text-[10px] font-bold text-(--tc-primary-text) hover:bg-(--tc-blue-soft)"
                          >
                            <RotateCcw className="h-[13px] w-[13px]" />
                            {t('Range Today')}
                          </Button>
                        </nav>
                      ),
                      // 区间端点加主色光晕;区间中段文本用主题蓝(内联样式以覆盖默认 data 选择器)
                      DayButton: ({ className, modifiers, ...rest }) => (
                        <CalendarDayButton
                          {...rest}
                          modifiers={modifiers}
                          style={
                            modifiers?.range_middle
                              ? { color: 'var(--tc-primary-text)' }
                              : undefined
                          }
                          className={cn(
                            className,
                            modifiers?.selected &&
                              'rounded-md shadow-[0_3px_8px_rgb(49_88_232/0.24)]',
                            !modifiers?.selected &&
                              !modifiers?.disabled &&
                              'hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text)',
                          )}
                        />
                      ),
                    }}
                  />
                </section>

                {/* 应用范围 */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    disabled={!draftComplete || draftTooLong}
                    onClick={handleApplyClick}
                    className="h-8 gap-1.5 rounded-xl bg-(--tc-primary) px-3 text-xs font-semibold text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] hover:bg-(--tc-primary-hover) hover:shadow-[0_8px_20px_rgb(49_88_232/0.28)] disabled:shadow-none"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {t('Range Apply')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
