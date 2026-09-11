'use client'

import { useMemo, useState } from 'react'

import {
  ChevronDown,
  ImagePlus,
  Library,
  Lightbulb,
  BookOpen,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * Workbench 中部控制面板 —— 生成模型 / 提示词 / 参数面板 / 参考素材 + 提交 footer
 */

interface WorkbenchControlsProps {
  /** 模型列表(config 接口返回) */
  models: Workbench.ModelOption[]
  /** 宽高比字典 */
  aspectRatios: Workbench.AspectRatioOption[]
  /** 分辨率字典 */
  resolutions: Workbench.ResolutionOption[]
  /** 输出格式字典 */
  formats: Workbench.FormatOption[]
}

/** 深色内嵌面板通用样式(工具条 / 上传区 / footer 与参考站一致的深色渐变) */
const darkInsetCls =
  'border border-transparent bg-[linear-gradient(180deg,rgba(12,19,34,0.98),rgba(10,16,30,0.98))] dark:bg-[linear-gradient(180deg,rgba(9,14,25,0.98),rgba(7,11,22,0.98))]'

/** 通用下拉(轻量实现,radix Select 会与受控布局耦合,这里用原生 button + 绝对定位列表) */
function MiniDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string
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
        className={cn(
          'inline-flex h-9 w-full items-center gap-2 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.9)] px-3 text-[13px] font-medium text-[#091423] transition-colors hover:border-[rgba(56,103,255,0.35)] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:hover:border-white/20',
        )}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <span className="min-w-0 flex-1 truncate text-left font-medium">{value}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-[#8a9bc0] transition-transform',
            open && 'rotate-180',
          )}
          strokeWidth={1.75}
        />
      </button>
      {open ? (
        <ul
          aria-label={label}
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
                    ? 'bg-[rgba(56,103,255,0.1)] font-medium text-[#3867ff]'
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

export function WorkbenchControls({
  models,
  aspectRatios,
  resolutions,
  formats,
}: WorkbenchControlsProps) {
  const { t } = useT('workbench')

  // 表单状态(参考站默认值:Seedream 5.0 Pro / 1:1 / 2K / JPEG / 优化关闭 / 1 张)
  const [modelId, setModelId] = useState('seedream-5.0-pro')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [resolution, setResolution] = useState('2K')
  const [format, setFormat] = useState('JPEG')
  const [optimize, setOptimize] = useState<'on' | 'off'>('off')
  const [count, setCount] = useState(1)
  const [prompt, setPrompt] = useState('')
  const [modelOpen, setModelOpen] = useState(false)
  const [submittedEmpty, setSubmittedEmpty] = useState(false)

  const model = useMemo(() => models.find((m) => m.id === modelId) ?? models[0], [modelId, models])

  // 宽高像素值 = 比例宽高 × 分辨率基准 / 1024
  const pixelSize = useMemo(() => {
    const ar = aspectRatios.find((a) => a.value === aspectRatio)
    const res = resolutions.find((r) => r.value === resolution)
    if (!ar || !res) return '—'
    return `${Math.round((ar.width / 1024) * res.base)}x${Math.round((ar.height / 1024) * res.base)}`
  }, [aspectRatio, aspectRatios, resolutions, resolution])

  const totalCredits = (model?.credits ?? 0) * count

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setSubmittedEmpty(true)
      return
    }
    setSubmittedEmpty(false)
  }

  return (
    <div className="flex h-full min-h-0 min-w-0">
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,249,255,0.9))] shadow-[0_10px_30px_rgba(8,20,48,0.05)] backdrop-blur-md dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))]">
        {/* 面板头 */}
        <div className="border-b border-[rgba(12,24,36,0.08)] px-3 py-2.5 dark:border-white/8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#091423] dark:text-[#eef4ff]">
                <SlidersHorizontal
                  aria-hidden
                  className="h-4 w-4 text-[#3867ff] dark:text-[#8fa5ff]"
                  strokeWidth={1.75}
                />
                {model ? t('Image generation') : ''}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-2.5">
            <div className="grid gap-2.5">
              {/* 生成模型 */}
              <div className="mt-3 rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
                  <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                    <span>{t('Generation model')}</span>
                  </p>
                </div>
                <div className="relative">
                  <button
                    aria-expanded={modelOpen}
                    aria-haspopup="listbox"
                    className="inline-flex h-10 w-full items-center gap-2 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.9)] px-3 text-left transition-colors hover:border-[rgba(56,103,255,0.35)] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                    onClick={() => setModelOpen((prev) => !prev)}
                    type="button"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 items-center gap-2 overflow-hidden">
                        <span className="min-w-0 truncate text-[13px] font-medium text-[#091423] dark:text-[#eef4ff]">
                          {model?.displayName}
                        </span>
                        {model?.badge ? (
                          <span className="inline-flex shrink-0 items-center rounded-[7px] border border-[rgba(56,103,255,0.3)] bg-[rgba(56,103,255,0.1)] px-1.5 text-[10px] font-semibold text-[#3867ff] dark:border-[rgba(143,165,255,0.3)] dark:text-[#8fa5ff]">
                            {model.badge === 'new' ? t('New') : t('Hot')}
                          </span>
                        ) : null}
                        {model?.recommended ? (
                          <span className="inline-flex shrink-0 items-center rounded-[7px] border border-amber-500/40 bg-amber-500/10 px-1.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            {t('Recommended')}
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 shrink-0 text-[#8a9bc0] transition-transform',
                        modelOpen && 'rotate-180',
                      )}
                      strokeWidth={1.75}
                    />
                  </button>
                  {modelOpen ? (
                    <ul
                      aria-label={t('Generation model')}
                      className="absolute top-[calc(100%+4px)] right-0 z-30 max-h-[320px] w-full min-w-[320px] overflow-y-auto rounded-[14px] border border-[rgba(12,24,36,0.1)] bg-white p-1 shadow-[0_16px_40px_rgba(8,20,48,0.16)] dark:border-white/10 dark:bg-[#101828]"
                      role="listbox"
                    >
                      {models.map((m) => (
                        <li
                          aria-selected={m.id === modelId}
                          key={m.id}
                          role="option"
                        >
                          <button
                            className={cn(
                              'w-full cursor-pointer rounded-[10px] px-3 py-2 text-left transition-colors',
                              m.id === modelId
                                ? 'bg-[rgba(56,103,255,0.08)]'
                                : 'hover:bg-[rgba(12,24,36,0.04)] dark:hover:bg-white/6',
                            )}
                            onClick={() => {
                              setModelId(m.id)
                              setModelOpen(false)
                            }}
                            type="button"
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="shrink-0 text-[10px] font-semibold text-[#8a9bc0] dark:text-[#6b7f9d]">
                                {m.provider}
                              </span>
                              <span
                                className={cn(
                                  'text-[13px] font-medium',
                                  m.id === modelId
                                    ? 'text-[#3867ff]'
                                    : 'text-[#091423] dark:text-[#eef4ff]',
                                )}
                              >
                                {m.displayName}
                              </span>
                              {m.badge ? (
                                <span className="inline-flex shrink-0 items-center rounded-[6px] border border-[rgba(56,103,255,0.3)] bg-[rgba(56,103,255,0.1)] px-1 text-[9px] font-semibold text-[#3867ff] dark:text-[#8fa5ff]">
                                  {m.badge === 'new' ? t('New') : t('Hot')}
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-0.5 line-clamp-2 block text-[11px] leading-4 text-[#8a9bc0] dark:text-[#6b7f9d]">
                              {m.description}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>

              {/* 提示词(必填) */}
              <div className="rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
                  <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                    <span>
                      {t('Prompt')}
                      <span className="ml-0.5 text-rose-600 dark:text-rose-300">*</span>
                    </span>
                  </p>
                  <span className="block max-w-[52%] min-w-0 shrink text-right text-[10px] leading-4 text-[#8a9bc0] dark:text-[#6b7f9d]">
                    {t('Supports natural language')}
                  </span>
                </div>
                {/* 提示词工具条(深色) */}
                <div
                  className={cn(
                    'workbench-prompt-toolbar mt-1.5 rounded-[14px] px-3 py-1.5',
                    darkInsetCls,
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <p className="min-w-0 flex-1 overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-[#8a9bc0] dark:text-[#6b7f9d]">
                      {t('Prompt toolbar')}
                    </p>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        className="inline-flex h-7 items-center justify-center gap-1 rounded-full px-2 text-[11px] text-[#b6c4dc] transition-colors hover:bg-white/8 hover:text-white"
                        type="button"
                      >
                        <BookOpen
                          className="h-3.5 w-3.5"
                          strokeWidth={1.75}
                        />
                        {t('Prompt library')}
                      </button>
                      <button
                        className="inline-flex h-7 items-center justify-center gap-1 rounded-full px-2 text-[11px] text-[#b6c4dc] transition-colors hover:bg-white/8 hover:text-white"
                        type="button"
                      >
                        <Lightbulb
                          className="h-3.5 w-3.5"
                          strokeWidth={1.75}
                        />
                        {t('Instant inspiration')}
                      </button>
                    </div>
                  </div>
                </div>
                {/* 输入区 */}
                <div className="mt-1.5 rounded-[14px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
                  <textarea
                    aria-label={t('Prompt')}
                    className="min-h-[88px] w-full resize-none bg-transparent text-[14px] leading-6 text-[#091423] outline-none placeholder:text-[#8a9bc0] dark:text-[#eef4ff] dark:placeholder:text-[#5b6b8c]"
                    onChange={(e) => {
                      setPrompt(e.target.value)
                      if (e.target.value.trim()) setSubmittedEmpty(false)
                    }}
                    placeholder={t('Prompt placeholder hint')}
                    value={prompt}
                  />
                </div>
                {submittedEmpty ? (
                  <p className="mt-1.5 text-[11px] leading-5 text-rose-600 dark:text-rose-300">
                    {t('Prompt is required')}
                  </p>
                ) : null}
              </div>

              {/* 参数面板 */}
              <div className="rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
                  <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                    <span>{t('Parameter panel')}</span>
                  </p>
                  <span className="block max-w-[52%] min-w-0 shrink text-right text-[10px] leading-4 text-[#8a9bc0] dark:text-[#6b7f9d]">
                    {t('Fill in model parameters directly')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {/* 宽高比 */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        {t('Aspect ratio')}
                      </div>
                    </div>
                    <MiniDropdown
                      label={t('Aspect ratio')}
                      onChange={setAspectRatio}
                      options={aspectRatios.map((a) => ({ value: a.value, label: a.value }))}
                      value={aspectRatio}
                    />
                  </div>
                  {/* 分辨率 */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        {t('Resolution')}
                      </div>
                    </div>
                    <MiniDropdown
                      label={t('Resolution')}
                      onChange={setResolution}
                      options={resolutions.map((r) => ({ value: r.value, label: r.value }))}
                      value={resolution}
                    />
                  </div>
                  {/* 宽高像素值(静态) */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        {t('Pixel dimensions')}
                      </div>
                    </div>
                    <div className="flex h-9 items-center rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 text-[13px] text-[#5b6b8c] dark:border-white/10 dark:bg-white/5 dark:text-[#b6c4dc]">
                      {pixelSize}
                    </div>
                  </div>
                  {/* 输出格式 */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        {t('Output format')}
                      </div>
                    </div>
                    <MiniDropdown
                      label={t('Output format')}
                      onChange={setFormat}
                      options={formats.map((f) => ({
                        value: f.value,
                        label: `${f.value} ${f.qualityLabel}`,
                      }))}
                      value={`${format} ${formats.find((f) => f.value === format)?.qualityLabel ?? ''}`}
                    />
                  </div>
                  {/* 提示词优化(跨列 segment) */}
                  <div className="col-span-2">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        {t('Prompt optimization')}
                      </div>
                      <span className="shrink-0 text-[11px] text-[#8a9bc0] dark:text-[#6b7f9d]">
                        {t('Follow original prompt')}
                      </span>
                    </div>
                    <div className="flex h-9 items-center gap-1 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] p-1 dark:border-white/10 dark:bg-white/5">
                      {(['on', 'off'] as const).map((opt) => (
                        <button
                          className={cn(
                            'inline-flex min-h-7 min-w-0 flex-1 items-center justify-center rounded-[9px] text-[12px] transition-colors',
                            optimize === opt
                              ? 'bg-[rgba(56,103,255,0.12)] font-medium text-[#3867ff] dark:bg-[rgba(143,165,255,0.16)] dark:text-[#8fa5ff]'
                              : 'text-[#8a9bc0] hover:bg-[rgba(12,24,36,0.04)] dark:hover:bg-white/6',
                          )}
                          key={opt}
                          onClick={() => setOptimize(opt)}
                          type="button"
                        >
                          {opt === 'on' ? t('On') : t('Off')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 参考素材 */}
              <div className="rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
                  <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                    <span>{t('Reference assets')}</span>
                  </p>
                </div>
                <div className="mt-1.5 rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[linear-gradient(180deg,rgba(9,17,32,0.96),rgba(7,13,25,0.98))] px-3 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex h-12 w-12 shrink-0 cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-white/16 bg-white/4 text-[#8a9bc0] transition-colors hover:border-[rgba(56,103,255,0.5)] hover:text-[#3867ff]">
                      <ImagePlus
                        className="h-4.5 w-4.5"
                        strokeWidth={1.75}
                      />
                      <span className="mt-1 text-[10px] leading-none">{t('Image')}</span>
                      <input
                        accept="image/*"
                        className="hidden"
                        multiple
                        type="file"
                      />
                    </label>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] leading-5 text-[#8a9bc0]">
                        {t('Uploaded')} 0/10 · {t('Drag here or pick from asset library')}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      <button
                        className="inline-flex items-center gap-2 rounded-full border border-white/14 px-2.5 py-1 text-[11px] text-[#b6c4dc] transition-colors hover:bg-white/8"
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
              </div>
            </div>
          </div>

          {/* 提交 footer(深色渐变) */}
          <div className="shrink-0 border-t border-[rgba(255,255,255,0.06)] bg-[linear-gradient(180deg,rgba(7,11,20,0.9),rgba(7,11,20,0.98))] px-2.5 pt-2.5 pb-4.5 dark:bg-[linear-gradient(180deg,rgba(7,11,20,0.95),rgba(5,8,16,0.98))]">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
              <button
                className="inline-flex h-11 max-w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-transparent bg-[linear-gradient(135deg,#8ccfe3,#5dafce,#7077e0)] text-[14px] font-medium text-[rgb(7,16,28)] transition-all duration-200 hover:opacity-90"
                onClick={handleSubmit}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  {t('Submit generation')}
                  <span className="text-[12px] font-normal opacity-75">
                    · {totalCredits} {t('credits')}
                  </span>
                </span>
              </button>
              <div className="flex h-11 min-w-0 items-center">
                <MiniDropdown
                  label={t('Count')}
                  onChange={(v) => setCount(Number(v))}
                  options={[1, 2, 4].map((n) => ({
                    value: String(n),
                    label: t('{{count}} image', { count: n }),
                  }))}
                  value={String(count)}
                />
              </div>
              <button
                className="inline-flex h-11 max-w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-white/12 px-4 text-[13px] font-medium text-[#b6c4dc] transition-colors hover:bg-white/8"
                onClick={() => {
                  setPrompt('')
                  setSubmittedEmpty(false)
                }}
                type="button"
              >
                <Trash2
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                />
                {t('Clear')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
