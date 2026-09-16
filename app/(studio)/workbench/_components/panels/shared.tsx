'use client'

import { useState } from 'react'

import { ChevronDown, Library, Upload } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * 能力面板共享组件 —— 卡片 / 分段 / chips / 下拉 / 滑块 / 上传区 / 字段布局
 * 供 panels/ 下各能力面板复用,布局与参考站 syna.art/workbench 一致
 */

/** 能力面板卡片容器(圆角 16px 白卡);icon = 标题前图标(与参考站卡片标题图标规范一致) */
export function PanelCard({
  title,
  icon,
  right,
  children,
}: {
  title: string
  icon?: React.ReactNode
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
      <div className="mb-1.5 flex min-w-0 items-start justify-between gap-2">
        <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
          {icon ? (
            <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">{icon}</span>
          ) : null}
          <span>{title}</span>
        </p>
        {right ? (
          <span className="block max-w-[52%] min-w-0 shrink text-right text-[10px] leading-4 text-[#8a9bc0] dark:text-[#8a9bc0]">
            {right}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

/** 卡片标题图标(统一规格:lucide h-3.5 w-3.5 / stroke 1.75,颜色由 PanelCard 内包裹层控制) */
export function PanelIcon({
  icon,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}) {
  const Icon = icon
  return (
    <Icon
      className="h-3.5 w-3.5"
      strokeWidth={1.75}
    />
  )
}

/** 字段标签行 */
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 flex items-center justify-between gap-2 text-[12px] text-[#091423] dark:text-[#eef4ff]">
      {children}
    </div>
  )
}

/** 字段子标题图标(与图片生成参数面板规格一致:lucide h-3.5 + 品牌蓝) */
export function FieldLabelIcon({
  icon,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
}) {
  const Icon = icon
  return (
    <Icon
      className="h-3.5 w-3.5 shrink-0 text-[#3867ff] dark:text-[#8fa5ff]"
      strokeWidth={1.75}
    />
  )
}

/** 两列字段网格(pc 两列,移动端堆叠换行) */
export function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">{children}</div>
}

/** 分段单选按钮(生成方式 / 音色 / 开启关闭等);wrap=true 时按内容宽度排布并允许换行(选项多且标签长时用) */
export function Seg({
  options,
  value,
  onChange,
  wrap = false,
}: {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  wrap?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] p-1 dark:border-white/10 dark:bg-white/5',
        wrap ? 'flex-wrap md:h-9 md:flex-nowrap' : 'h-9',
      )}
    >
      {options.map((opt) => (
        <button
          className={cn(
            'inline-flex min-h-7 items-center justify-center rounded-[9px] text-[12px] whitespace-nowrap transition-colors',
            wrap
              ? 'grow basis-[calc(25%-0.25rem)] px-1.5 md:min-w-0 md:basis-0 md:flex-1'
              : 'min-w-0 flex-1',
            value === opt.value
              ? 'bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white'
              : 'text-[#8a9bc0] hover:bg-[rgba(12,24,36,0.04)] dark:hover:bg-white/6',
          )}
          key={opt.value}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/** 多选 chips(编辑工具 / 对齐模式等) */
export function Chips({
  options,
  selected,
  onToggle,
}: {
  options: Array<{ value: string; label: string }>
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt.value)
        return (
          <button
            className={cn(
              'inline-flex h-9 items-center rounded-[12px] border px-3 text-[13px] transition-colors',
              active
                ? 'border-transparent bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white'
                : 'border-[rgba(12,24,36,0.1)] text-[#5b6b8c] hover:border-[rgba(56,103,255,0.3)] dark:border-white/10 dark:text-[#b6c4dc] dark:hover:border-white/20',
            )}
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            type="button"
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/** 下拉(与 controls 内 MiniDropdown 相同交互) */
export function Drop({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex h-9 w-full items-center gap-2 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.9)] px-3 text-[13px] font-medium text-[#091423] transition-colors hover:border-[rgba(56,103,255,0.35)] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:hover:border-white/20"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <span className="min-w-0 flex-1 truncate text-left">{value}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-[#8a9bc0] transition-transform dark:text-[#8a9bc0]',
            open && 'rotate-180',
          )}
          strokeWidth={1.75}
        />
      </button>
      {open ? (
        <ul
          className="absolute top-[calc(100%+4px)] right-0 z-30 min-w-full overflow-hidden rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-white p-1 shadow-[0_16px_40px_rgba(8,20,48,0.16)] dark:border-white/10 dark:bg-[#101828]"
          role="listbox"
        >
          {options.map((opt) => (
            <li
              aria-selected={opt.value === value}
              key={opt.value}
              role="option"
            >
              <button
                className={cn(
                  'w-full cursor-pointer rounded-[9px] px-3 py-1.5 text-left text-[13px] whitespace-nowrap transition-colors',
                  opt.value === value
                    ? 'bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white'
                    : 'text-[#2e4268] hover:bg-[rgba(12,24,36,0.04)] dark:text-[#b6c4dc] dark:hover:bg-white/6',
                )}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                type="button"
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/** 滑块字段(icon = 可选字段子标题图标) */
export function SliderField({
  label,
  icon,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string
  icon?: React.ReactNode
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <FieldLabel>
        <span className="flex min-w-0 items-center gap-1.5">
          {icon}
          {label}
        </span>
        <span className="shrink-0 text-[11px] font-medium text-[#3867ff] dark:text-[#8fa5ff]">
          {value}
        </span>
      </FieldLabel>
      <input
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(56,103,255,0.15)] accent-[#3867ff] dark:bg-[rgba(143,165,255,0.15)]"
        max={max}
        min={min}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </div>
  )
}

/** 上传区(亮色浅灰蓝底 / 暗色深底,与 controls 内 insetPanelCls 一致) */
export function UploadZone({
  icon,
  title,
  hintLines,
  multiple,
}: {
  icon: React.ReactNode
  title: string
  hintLines?: string[]
  multiple?: boolean
}) {
  const { t } = useT('workbench')
  return (
    <div className="mt-1.5 rounded-[14px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(237,241,255,0.9),rgba(226,233,250,0.85))] px-3 py-3 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(7,11,22,0.96),rgba(5,8,16,0.98))]">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-12 w-12 shrink-0 cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[rgba(12,24,36,0.16)] bg-white/70 text-[#4a6080] transition-colors hover:border-[rgba(56,103,255,0.5)] hover:text-[#3867ff] dark:border-white/16 dark:bg-white/4 dark:text-[#8a9bc0] dark:hover:border-[rgba(143,165,255,0.5)] dark:hover:text-[#8fa5ff]">
          {icon}
          <span className="mt-1 text-[10px] leading-none">{title}</span>
          <input
            className="hidden"
            multiple={multiple}
            type="file"
          />
        </label>
        {hintLines?.length ? (
          <div className="min-w-0 flex-1 space-y-0.5">
            {hintLines.map((line) => (
              <p
                className="text-[11px] leading-4 text-[#4a6080] dark:text-[#8a9bc0]"
                key={line}
              >
                {line}
              </p>
            ))}
          </div>
        ) : null}
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <button
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(12,24,36,0.12)] px-2.5 py-1 text-[11px] text-[#4a6080] transition-colors hover:bg-[rgba(12,24,36,0.05)] hover:text-[#3867ff] dark:border-white/14 dark:text-[#b6c4dc] dark:hover:bg-white/8 dark:hover:text-white"
            type="button"
          >
            <Library
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
            {t('Asset library')}
          </button>
        </div>
      </div>
    </div>
  )
}

/** 上传图标(视频/音频共用) */
export function UploadGlyph() {
  return (
    <Upload
      className="h-4.5 w-4.5"
      strokeWidth={1.75}
    />
  )
}
