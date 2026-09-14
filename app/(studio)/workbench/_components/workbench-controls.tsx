'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import {
  Aperture,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  Clapperboard,
  Clock,
  Dices,
  FileArchive,
  Film,
  Frame,
  Gauge,
  ImagePlus,
  Layers,
  Library,
  Lightbulb,
  Maximize,
  MessageSquareOff,
  SlidersHorizontal,
  Trash2,
  Upload,
  WandSparkles,
} from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

import { ProviderLogo } from './provider-logos'
import { CapabilityPanels } from './workbench-capability-panels'

/**
 * Workbench 中部控制面板 —— 生成模型 / 提示词 / 参数面板 / 参考素材 + 提交 footer
 */

interface WorkbenchControlsProps {
  /** 当前激活能力 ID(决定面板形态:图片生成 / 视频生成...) */
  activeCapability: string
  /** 当前能力展示名(i18n key) */
  activeNameKey: string
  /** 模型列表(config 接口返回,按能力切换) */
  models: Workbench.ModelOption[]
  /** 宽高比字典 */
  aspectRatios: Workbench.AspectRatioOption[]
  /** 分辨率字典 */
  resolutions: Workbench.ResolutionOption[]
  /** 输出格式字典 */
  formats: Workbench.FormatOption[]
  /** 质量档位字典 */
  qualityTiers: Workbench.QualityTierOption[]
  /** 生成背景字典 */
  backgrounds: Workbench.BackgroundOption[]
  /** 输出压缩档位字典 */
  compressions: Workbench.CompressionOption[]
  /** 视频生成能力配置 */
  videoConfig?: Workbench.VideoCapabilityConfig
  /** 各能力配置全集(音效/音乐/配音/编辑类) */
  configs?: Workbench.ConfigResponse['data']
}

/**
 * 内嵌面板通用样式:亮色主题浅灰蓝渐变底,暗色主题深色渐变底
 * (提示词工具条 / 上传区 / footer 共用,双主题分别适配)
 */
const insetPanelCls =
  'border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(237,241,255,0.9),rgba(226,233,250,0.85))] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(9,14,25,0.98),rgba(7,11,22,0.98))]'

/** 通用下拉(轻量实现,radix Select 会与受控布局耦合,这里用原生 button + 绝对定位列表)
 *  变体:list = 纯文字行(参考站分辨率/输出格式样式,h-9 行 + 选中项 Check);grid = 比例缩略卡网格 */
function MiniDropdown({
  label,
  options,
  value,
  onChange,
  variant = 'list',
}: {
  label: string
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  variant?: 'list' | 'grid'
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  // 与参考站 Headless UI 行为一致:点击外部或 Escape 关闭
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  const ratioOf = (v: string) => {
    const [w, h] = v.split(':').map(Number)
    if (!w || !h) return { w: 18, h: 18 }
    const scale = 18 / Math.max(w, h)
    return { w: Math.max(6, Math.round(w * scale)), h: Math.max(6, Math.round(h * scale)) }
  }
  return (
    <div
      className="relative"
      ref={rootRef}
    >
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex h-9 w-full items-center gap-2 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.9)] px-3 text-[13px] font-medium text-[#091423] transition-colors hover:border-[rgba(56,103,255,0.35)] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:hover:border-white/20"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <span className="min-w-0 flex-1 truncate text-left font-medium">{value}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 shrink-0 text-[#8a9bc0] transition-transform dark:text-[#8a9bc0]', open && 'rotate-180')}
          strokeWidth={1.75}
        />
      </button>
      {open ? (
        <ul
          aria-label={label}
          className={cn(
            'absolute top-[calc(100%+4px)] right-0 z-30 overflow-hidden rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-white p-1 shadow-[0_16px_40px_rgba(8,20,48,0.16)] dark:border-white/10 dark:bg-[#101828]',
            variant === 'grid' ? 'grid w-full grid-cols-4 gap-1 p-1.5' : 'min-w-full',
          )}
          role="listbox"
        >
          {options.map((opt) => {
            const selected = opt.value === value
            const ratio = ratioOf(opt.value)
            return (
              <li
                aria-selected={selected}
                className={variant === 'grid' ? 'contents' : undefined}
                key={opt.value}
                role="option"
              >
                {variant === 'grid' ? (
                  <button
                    className={cn(
                      'flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border px-1 py-2 transition-colors',
                      selected
                        ? 'border-transparent bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white'
                        : 'border-transparent text-[#4a6080] hover:bg-[rgba(12,24,36,0.04)] dark:text-[#b6c4dc] dark:hover:bg-white/6',
                    )}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                    }}
                    type="button"
                  >
                    <span className="flex h-[18px] w-[26px] items-center justify-center">
                      <span
                        className="rounded-[2px] border border-current"
                        style={{ width: ratio.w, height: ratio.h }}
                      />
                    </span>
                    <span className="text-[10px] leading-none font-medium">{opt.label}</span>
                  </button>
                ) : (
                  <button
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-1.5 rounded-[9px] px-3 py-2 text-left text-[13px] whitespace-nowrap transition-colors',
                      selected ? 'bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white' : 'text-[#2e4268] hover:bg-[rgba(12,24,36,0.04)] dark:text-[#b6c4dc] dark:hover:bg-white/6',
                    )}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                    }}
                    type="button"
                  >
                    <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                    {selected ? (
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-[#3867ff] dark:text-[#8fa5ff]"
                        strokeWidth={2}
                      />
                    ) : null}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export function WorkbenchControls({
  activeCapability,
  activeNameKey,
  models,
  aspectRatios,
  resolutions,
  formats,
  qualityTiers,
  backgrounds,
  compressions,
  videoConfig,
  configs,
}: WorkbenchControlsProps) {
  const { t } = useT('workbench')

  const isImage = activeCapability === 'image-gen'
  const isVideo = activeCapability === 'video-gen'

  // 能力 → 提示词卡形态(无提示词卡的能力返回 null)
  const promptMeta = useMemo(() => {
    switch (activeCapability) {
      case 'image-gen':
      case 'video-gen':
        return { titleKey: 'Prompt', hintKey: 'Supports natural language', placeholderKey: 'Prompt placeholder hint', required: true }
      case 'sound-gen':
        return { titleKey: 'Sound description', hintKey: null, placeholderKey: 'Sound description placeholder', required: true }
      case 'music-gen':
        return { titleKey: 'Song description', hintKey: 'Supports natural language', placeholderKey: 'Song description placeholder', required: true }
      case 'voice-gen':
        return { titleKey: 'Voice text', hintKey: 'Voice text hint', placeholderKey: 'Voice text placeholder', required: true }
      default:
        return null
    }
  }, [activeCapability])

  // 能力 → footer 提交按钮文案(其余能力保持「提交生成」)
  const submitKey = useMemo(() => {
    switch (activeCapability) {
      case 'voice-gen':
        return 'Generate voice'
      case 'image-edit':
        return 'Start editing'
      case 'video-upscale':
        return 'Start upscaling'
      case 'video-remove-bg':
        return 'Start background removal'
      case 'video-lipsync':
        return 'Start lip sync'
      case 'motion-sync':
        return 'Start sync'
      case 'digital-human':
        return 'Generate digital avatar'
      default:
        return 'Submit generation'
    }
  }, [activeCapability])

  // 表单状态(参考站默认值:Seedream 5.0 Pro / 1:1 / 2K / JPEG / 优化关闭 / 1 张;视频默认 Wan 3.0 Prime)
  const [modelId, setModelId] = useState('seedream-5.0-pro')
  const [videoModelId, setVideoModelId] = useState('wan-3.0-prime')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [resolution, setResolution] = useState('2K')
  const [format, setFormat] = useState('JPEG')
  const [qualityTier, setQualityTier] = useState('standard')
  const [background, setBackground] = useState('auto')
  const [compression, setCompression] = useState('high')
  const [optimize, setOptimize] = useState<'on' | 'off'>('off')
  const [count, setCount] = useState(1)
  const [prompt, setPrompt] = useState('')
  const [modelOpen, setModelOpen] = useState(false)
  const [submittedEmpty, setSubmittedEmpty] = useState(false)
  // 视频生成专属状态
  const [videoMode, setVideoMode] = useState<Workbench.VideoCreateMode>('t2v')
  const [videoResolution, setVideoResolution] = useState('480P')
  const [videoAspectRatio, setVideoAspectRatio] = useState('auto')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [randomSeed, setRandomSeed] = useState('')

  const videoModel = useMemo(() => videoConfig?.models.find((m) => m.id === videoModelId) ?? videoConfig?.models[0], [videoModelId, videoConfig])
  const model = isVideo ? videoModel : (models.find((m) => m.id === modelId) ?? models[0])

  // 宽高像素值 = 比例宽高 × 分辨率基准 / 1024
  const pixelSize = useMemo(() => {
    const ar = aspectRatios.find((a) => a.value === aspectRatio)
    const res = resolutions.find((r) => r.value === resolution)
    if (!ar || !res) return '—'
    return `${Math.round((ar.width / 1024) * res.base)}x${Math.round((ar.height / 1024) * res.base)}`
  }, [aspectRatio, aspectRatios, resolutions, resolution])

  const totalCredits = (model?.credits ?? 0) * count

  const handleSubmit = () => {
    // 仅带提示词卡(必填)的能力做空值校验;编辑类/上传类面板不做必填拦截
    if (promptMeta?.required && !prompt.trim()) {
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
                {activeNameKey}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-2.5 pt-2.5 pb-[92px] scrollbar-slim">
            <div className="grid gap-2.5">
              {/* 生成模型(仅图片/视频生成有独立模型卡;其余能力模型在各自面板内) */}
              {isImage || isVideo ? (
                <div className="mt-3 rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                  <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
                    <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                      <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                        <BrainCircuit
                          className="h-3.5 w-3.5"
                          strokeWidth={1.75}
                        />
                      </span>
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
                          <ProviderLogo
                            className="h-4 w-4 shrink-0 text-[#3867ff] dark:text-[#8fa5ff]"
                            provider={model?.provider ?? ''}
                          />
                          <span className="min-w-0 truncate text-[13px] font-medium text-[#091423] dark:text-[#eef4ff]">{model?.displayName}</span>
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
                        className={cn('h-3.5 w-3.5 shrink-0 text-[#8a9bc0] transition-transform dark:text-[#8a9bc0]', modelOpen && 'rotate-180')}
                        strokeWidth={1.75}
                      />
                    </button>
                    {modelOpen ? (
                      <ul
                        aria-label={t('Generation model')}
                        className="absolute top-[calc(100%+4px)] right-0 z-30 max-h-[320px] w-full min-w-[320px] overflow-y-auto rounded-[14px] border border-[rgba(12,24,36,0.1)] bg-white p-1 shadow-[0_16px_40px_rgba(8,20,48,0.16)] dark:border-white/10 dark:bg-[#101828]"
                        role="listbox"
                      >
                        {(isVideo ? (videoConfig?.models ?? []) : models).map((m) => (
                          <li
                            aria-selected={m.id === (isVideo ? videoModelId : modelId)}
                            key={m.id}
                            role="option"
                          >
                            <button
                              className={cn(
                                'w-full cursor-pointer rounded-[10px] px-3 py-2 text-left transition-colors',
                                m.id === (isVideo ? videoModelId : modelId) ? 'bg-[rgba(56,103,255,0.08)]' : 'hover:bg-[rgba(12,24,36,0.04)] dark:hover:bg-white/6',
                              )}
                              onClick={() => {
                                if (isVideo) setVideoModelId(m.id)
                                else setModelId(m.id)
                                setModelOpen(false)
                              }}
                              type="button"
                            >
                              <span className="flex items-center gap-1.5">
                                <ProviderLogo
                                  className="h-4 w-4 shrink-0 text-[#3867ff] dark:text-[#8fa5ff]"
                                  provider={m.provider}
                                />
                                <span className="shrink-0 text-[10px] font-semibold text-[#8a9bc0] dark:text-[#8a9bc0]">{m.provider}</span>
                                <span className={cn('text-[13px] font-medium', m.id === (isVideo ? videoModelId : modelId) ? 'text-[#3867ff]' : 'text-[#091423] dark:text-[#eef4ff]')}>
                                  {m.displayName}
                                </span>
                                {m.badge ? (
                                  <span className="inline-flex shrink-0 items-center rounded-[6px] border border-[rgba(56,103,255,0.3)] bg-[rgba(56,103,255,0.1)] px-1 text-[9px] font-semibold text-[#3867ff] dark:text-[#8fa5ff]">
                                    {m.badge === 'new' ? t('New') : t('Hot')}
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-0.5 line-clamp-2 block text-[11px] leading-4 text-[#8a9bc0] dark:text-[#8a9bc0]">{m.description}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* 提示词卡(按能力显隐:图片/视频/音效/音乐/配音) */}
              {promptMeta ? (
                <div className="rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                  <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
                    <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                      <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                        <WandSparkles
                          className="h-3.5 w-3.5"
                          strokeWidth={1.75}
                        />
                      </span>
                      <span>
                        {t(promptMeta.titleKey)}
                        {promptMeta.required ? <span className="ml-0.5 text-rose-600 dark:text-rose-300">*</span> : null}
                      </span>
                    </p>
                    <span className="block max-w-[52%] min-w-0 shrink text-right text-[10px] leading-4 text-[#8a9bc0] dark:text-[#8a9bc0]">{promptMeta.hintKey ? t(promptMeta.hintKey) : ''}</span>
                  </div>
                  {/* 配音:Instruction 提示 + 标签 chips */}
                  {activeCapability === 'voice-gen' ? (
                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] leading-4 text-[#8a9bc0] dark:text-[#8a9bc0]">{t('Voice instruction hint')}</span>
                      <span className="inline-flex items-center rounded-[7px] border border-[rgba(56,103,255,0.3)] bg-[rgba(56,103,255,0.08)] px-1.5 py-0.5 text-[10px] font-medium text-[#3867ff] dark:border-[rgba(143,165,255,0.3)] dark:text-[#8fa5ff]">
                        {t('Control tags')}
                      </span>
                      <span className="inline-flex items-center rounded-[7px] border border-[rgba(56,103,255,0.3)] bg-[rgba(56,103,255,0.08)] px-1.5 py-0.5 text-[10px] font-medium text-[#3867ff] dark:border-[rgba(143,165,255,0.3)] dark:text-[#8fa5ff]">
                        {t('Rich language tags')}
                      </span>
                    </div>
                  ) : null}
                  {/* 提示词工具条(亮色浅灰蓝底 / 暗色深底) */}
                  <div className={cn('workbench-prompt-toolbar mt-1.5 rounded-[14px] px-3 py-1.5', insetPanelCls)}>
                    <div className="flex items-center gap-2.5">
                      <p className="min-w-0 flex-1 overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-[#4a6080] dark:text-[#8a9bc0]">{t('Prompt toolbar')}</p>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          className="inline-flex h-7 items-center justify-center gap-1 rounded-full px-2 text-[11px] text-[#4a6080] transition-colors hover:bg-[rgba(12,24,36,0.06)] hover:text-[#3867ff] dark:text-[#b6c4dc] dark:hover:bg-white/8 dark:hover:text-white"
                          type="button"
                        >
                          <BookOpen
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                          {t('Prompt library')}
                        </button>
                        <button
                          className="inline-flex h-7 items-center justify-center gap-1 rounded-full px-2 text-[11px] text-[#4a6080] transition-colors hover:bg-[rgba(12,24,36,0.06)] hover:text-[#3867ff] dark:text-[#b6c4dc] dark:hover:bg-white/8 dark:hover:text-white"
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
                      aria-label={t(promptMeta.titleKey)}
                      className="min-h-[64px] w-full resize-none bg-transparent text-[14px] leading-6 text-[#091423] outline-none placeholder:text-[#8a9bc0] dark:text-[#eef4ff] dark:placeholder:text-[#8a9bc0]"
                      onChange={(e) => {
                        setPrompt(e.target.value)
                        if (e.target.value.trim()) setSubmittedEmpty(false)
                      }}
                      placeholder={t(promptMeta.placeholderKey)}
                      value={prompt}
                    />
                  </div>
                  {submittedEmpty ? <p className="mt-1.5 text-[11px] leading-5 text-rose-600 dark:text-rose-300">{t('Prompt is required')}</p> : null}
                </div>
              ) : null}

              {/* 视频生成:创作模式 */}
              {isVideo && videoConfig ? (
                <div className="rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                  <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
                    <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                      <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                        <Clapperboard
                          className="h-3.5 w-3.5"
                          strokeWidth={1.75}
                        />
                      </span>
                      <span>{t('Creation mode')}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {videoConfig.createModes.map((mode) => (
                      <button
                        className={cn(
                          'inline-flex h-9 items-center rounded-[12px] border px-3 text-[13px] transition-colors',
                          videoMode === mode.value
                            ? 'border-transparent bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white'
                            : 'border-[rgba(12,24,36,0.1)] text-[#5b6b8c] hover:border-[rgba(56,103,255,0.3)] dark:border-white/10 dark:text-[#b6c4dc] dark:hover:border-white/20',
                        )}
                        key={mode.value}
                        onClick={() => setVideoMode(mode.value)}
                        type="button"
                      >
                        {t(mode.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* 视频生成:视频控制台(分辨率/画幅/时长/增强/负向提示词/随机种子) */}
              {isVideo && videoConfig ? (
                <div className="rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                  <div className="mb-1.5 flex min-w-0 items-start justify-between gap-2">
                    <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                      <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                        <SlidersHorizontal
                          className="h-3.5 w-3.5"
                          strokeWidth={1.75}
                        />
                      </span>
                      <span>{t('Video console')}</span>
                    </p>
                    <span className="block max-w-[52%] min-w-0 shrink text-right text-[10px] leading-4 text-[#8a9bc0] dark:text-[#8a9bc0]">
                      {t('Current mode')}: {t(videoConfig.createModes.find((m) => m.value === videoMode)?.labelKey ?? 'Text to video')}
                    </span>
                  </div>
                  <div className="grid min-w-0 gap-1.5">
                    {/* 分辨率 + 画幅比例(pc 一行两列,移动端堆叠换行) */}
                    <div className="grid min-w-0 grid-cols-1 gap-1.5 md:grid-cols-2">
                      {/* 分辨率 segment */}
                      <div>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                            <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                              <Film
                                className="h-3.5 w-3.5"
                                strokeWidth={1.75}
                              />
                            </span>
                            {t('Resolution')}
                          </div>
                        </div>
                        <div className="flex h-9 items-center gap-1 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] p-1 dark:border-white/10 dark:bg-white/5">
                          {videoConfig.resolutions.map((r) => (
                            <button
                              className={cn(
                                'inline-flex min-h-7 min-w-0 flex-1 items-center justify-center rounded-[9px] text-[12px] transition-colors',
                                videoResolution === r.value
                                  ? 'bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white'
                                  : 'text-[#8a9bc0] hover:bg-[rgba(12,24,36,0.04)] dark:hover:bg-white/6',
                              )}
                              key={r.value}
                              onClick={() => setVideoResolution(r.value)}
                              type="button"
                            >
                              {r.value}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* 画幅比例 segment */}
                      <div>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                            <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                              <Maximize
                                className="h-3.5 w-3.5"
                                strokeWidth={1.75}
                              />
                            </span>
                            {t('Aspect ratio')}
                          </div>
                        </div>
                        <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] p-1 [scrollbar-width:none] dark:border-white/10 dark:bg-white/5 [&::-webkit-scrollbar]:hidden">
                          {videoConfig.aspectRatios.map((r) => (
                            <button
                              className={cn(
                                'inline-flex min-h-7 min-w-0 flex-1 items-center justify-center rounded-[9px] text-[12px] whitespace-nowrap transition-colors',
                                videoAspectRatio === r.value
                                  ? 'bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white'
                                  : 'text-[#8a9bc0] hover:bg-[rgba(12,24,36,0.04)] dark:hover:bg-white/6',
                              )}
                              key={r.value}
                              onClick={() => setVideoAspectRatio(r.value)}
                              type="button"
                            >
                              {r.value === 'auto' ? t('Auto') : r.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* 时长 segment(更短 ← 5 秒 → 更长) */}
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                          <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                            <Clock
                              className="h-3.5 w-3.5"
                              strokeWidth={1.75}
                            />
                          </span>
                          {t('Duration')}
                        </div>
                      </div>
                      <div className="flex h-9 items-center gap-2 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 dark:border-white/10 dark:bg-white/5">
                        <span className="shrink-0 text-[11px] text-[#8a9bc0] dark:text-[#8a9bc0]">{t('Shorter')}</span>
                        <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
                          {videoConfig.durations.map((d) => (
                            <button
                              className="inline-flex min-h-7 items-center justify-center rounded-[9px] bg-[rgba(56,103,255,0.12)] px-3 text-[12px] font-medium text-[#3867ff] dark:bg-[rgba(143,165,255,0.16)] dark:text-[#8fa5ff]"
                              key={d.seconds}
                              type="button"
                            >
                              {t('{{seconds}} seconds', { seconds: d.seconds })}
                            </button>
                          ))}
                        </div>
                        <span className="shrink-0 text-[11px] text-[#8a9bc0] dark:text-[#8a9bc0]">{t('Longer')}</span>
                      </div>
                    </div>
                    {/* 提示词增强 segment */}
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                          <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                            <Lightbulb
                              className="h-3.5 w-3.5"
                              strokeWidth={1.75}
                            />
                          </span>
                          {t('Prompt optimization')}
                        </div>
                      </div>
                      <div className="flex h-9 items-center gap-1 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] p-1 dark:border-white/10 dark:bg-white/5">
                        {(['on', 'off'] as const).map((opt) => (
                          <button
                            className={cn(
                              'inline-flex min-h-7 min-w-0 flex-1 items-center justify-center rounded-[9px] text-[12px] transition-colors',
                              optimize === opt ? 'bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white' : 'text-[#8a9bc0] hover:bg-[rgba(12,24,36,0.04)] dark:hover:bg-white/6',
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
                    {/* 负向提示词 */}
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                          <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                            <MessageSquareOff
                              className="h-3.5 w-3.5"
                              strokeWidth={1.75}
                            />
                          </span>
                          {t('Negative prompt')}
                        </div>
                      </div>
                      <input
                        aria-label={t('Negative prompt')}
                        className="h-9 w-full rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 text-[13px] text-[#091423] outline-none transition-colors placeholder:text-[#8a9bc0] focus:border-[rgba(56,103,255,0.4)] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#8a9bc0]"
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder={t('Negative prompt placeholder')}
                        value={negativePrompt}
                      />
                    </div>
                    {/* 随机种子 */}
                    <div>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                          <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                            <Dices
                              className="h-3.5 w-3.5"
                              strokeWidth={1.75}
                            />
                          </span>
                          {t('Random seed')}
                        </div>
                      </div>
                      <input
                        aria-label={t('Random seed')}
                        className="h-9 w-full rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 text-[13px] text-[#091423] outline-none transition-colors placeholder:text-[#8a9bc0] focus:border-[rgba(56,103,255,0.4)] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#8a9bc0]"
                        onChange={(e) => setRandomSeed(e.target.value)}
                        placeholder={t('Random seed placeholder')}
                        value={randomSeed}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* 其余能力面板(音效/音乐/配音/图片编辑/视频超分/去背景/对口型/动作同步/数字人像) */}
              {!isImage && !isVideo && configs ? (
                <CapabilityPanels
                  capability={activeCapability}
                  configs={configs}
                />
              ) : null}

              {/* 图片生成:参数面板 */}
              {isImage ? (
                <div className="rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                  <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
                    <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                      <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                        <SlidersHorizontal
                          className="h-3.5 w-3.5"
                          strokeWidth={1.75}
                        />
                      </span>
                      <span>{t('Parameter panel')}</span>
                    </p>
                    <span className="block max-w-[52%] min-w-0 shrink text-right text-[10px] leading-4 text-[#8a9bc0] dark:text-[#8a9bc0]">{t('Fill in model parameters directly')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-1.5 gap-y-2.5">
                    {/* 宽高比(参考站同款:比例缩略卡网格下拉) */}
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                          <Aperture
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                        </span>
                        {t('Aspect ratio')}
                      </div>
                      <MiniDropdown
                        label={t('Aspect ratio')}
                        onChange={setAspectRatio}
                        options={aspectRatios.map((a) => ({ value: a.value, label: a.value }))}
                        value={aspectRatio}
                        variant="grid"
                      />
                    </div>
                    {/* 分辨率 */}
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                          <Maximize
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                        </span>
                        {t('Resolution')}
                      </div>
                      <MiniDropdown
                        label={t('Resolution')}
                        onChange={setResolution}
                        options={resolutions.map((r) => ({ value: r.value, label: r.value }))}
                        value={resolution}
                      />
                    </div>
                    {/* 质量档位 */}
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                          <Gauge
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                        </span>
                        {t('Quality tier')}
                      </div>
                      <MiniDropdown
                        label={t('Quality tier')}
                        onChange={setQualityTier}
                        options={qualityTiers.map((q) => ({ value: q.value, label: t(q.labelKey) }))}
                        value={t(qualityTiers.find((q) => q.value === qualityTier)?.labelKey ?? 'Standard')}
                      />
                    </div>
                    {/* 输出压缩 */}
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                          <FileArchive
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                        </span>
                        {t('Output compression')}
                      </div>
                      <MiniDropdown
                        label={t('Output compression')}
                        onChange={setCompression}
                        options={compressions.map((c) => ({ value: c.value, label: t(c.labelKey) }))}
                        value={t(compressions.find((c) => c.value === compression)?.labelKey ?? 'High quality')}
                      />
                    </div>
                    {/* 宽高像素值(静态) */}
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                          <Maximize
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                        </span>
                        {t('Pixel dimensions')}
                      </div>
                      <div className="flex h-9 items-center rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 text-[13px] text-[#5b6b8c] dark:border-white/10 dark:bg-white/5 dark:text-[#b6c4dc]">
                        {pixelSize}
                      </div>
                    </div>
                    {/* 背景 */}
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                          <Frame
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                        </span>
                        {t('Background')}
                      </div>
                      <MiniDropdown
                        label={t('Background')}
                        onChange={setBackground}
                        options={backgrounds.map((b) => ({ value: b.value, label: t(b.labelKey) }))}
                        value={t(backgrounds.find((b) => b.value === background)?.labelKey ?? 'Auto match')}
                      />
                    </div>
                    {/* 输出格式(跨列) */}
                    <div className="col-span-2">
                      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                          <Layers
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                        </span>
                        {t('Output format')}
                      </div>
                      <MiniDropdown
                        label={t('Output format')}
                        onChange={setFormat}
                        options={formats.map((f) => ({
                          value: `${f.value} · ${t(f.qualityLabel)}`,
                          label: `${f.value} · ${t(f.qualityLabel)}`,
                        }))}
                        value={`${format} · ${t(formats.find((f) => f.value === format)?.qualityLabel ?? '')}`}
                      />
                    </div>
                    {/* 提示词优化(跨列 segment,参考站 lightbulb 图标) */}
                    <div className="col-span-2">
                      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#091423] dark:text-[#eef4ff]">
                        <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                          <Lightbulb
                            className="h-3.5 w-3.5"
                            strokeWidth={1.75}
                          />
                        </span>
                        {t('Prompt optimization')}
                        <span className="min-w-0 flex-1 truncate text-right text-[11px] font-normal text-[#8a9bc0] dark:text-[#8a9bc0]">{t('Follow original prompt')}</span>
                      </div>
                      <div className="flex h-9 items-center gap-1 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] p-1 dark:border-white/10 dark:bg-white/5">
                        {(['on', 'off'] as const).map((opt) => (
                          <button
                            className={cn(
                              'inline-flex min-h-7 min-w-0 flex-1 items-center justify-center rounded-[9px] text-[12px] transition-colors',
                              optimize === opt ? 'bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white' : 'text-[#8a9bc0] hover:bg-[rgba(12,24,36,0.04)] dark:hover:bg-white/6',
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
              ) : null}

              {/* 参考素材(仅图片生成) */}
              {isImage ? (
                <div className="rounded-[16px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(56,103,255,0.02),transparent)] p-1.5 dark:border-white/8">
                  <div className="mb-1 flex min-w-0 items-start justify-between gap-2">
                    <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-[#091423] dark:text-[#eef4ff]">
                      <span className="shrink-0 text-[#3867ff] dark:text-[#8fa5ff]">
                        <Upload
                          className="h-3.5 w-3.5"
                          strokeWidth={1.75}
                        />
                      </span>
                      <span>{t('Reference assets')}</span>
                    </p>
                  </div>
                  <div className={cn('mt-1.5 rounded-[14px] px-3 py-2.5', insetPanelCls)}>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex h-12 w-12 shrink-0 cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[rgba(12,24,36,0.16)] bg-white/70 text-[#4a6080] transition-colors hover:border-[rgba(56,103,255,0.5)] hover:text-[#3867ff] dark:border-white/16 dark:bg-white/4 dark:text-[#8a9bc0] dark:hover:border-[rgba(143,165,255,0.5)] dark:hover:text-[#8fa5ff]">
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
                        <p className="text-[11px] leading-5 text-[#4a6080] dark:text-[#8a9bc0]">
                          {t('Uploaded')} 0/10 · {t('Drag here or pick from asset library')}
                        </p>
                      </div>
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
                </div>
              ) : null}
            </div>
          </div>

          {/* 提交 footer(亮色浅底 / 暗色深底) */}
          <div className="shrink-0 border-t border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(245,249,255,0.98),rgba(237,241,255,0.96))] px-2.5 pt-2.5 pb-4.5 backdrop-blur-md dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(7,11,20,0.95),rgba(5,8,16,0.98))]">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
              <button
                className="inline-flex h-11 max-w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-transparent bg-[linear-gradient(135deg,#8ccfe3,#5dafce,#7077e0)] text-[14px] font-medium text-[rgb(7,16,28)] transition-all duration-200 hover:opacity-90"
                onClick={handleSubmit}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  {t(submitKey)}
                  {isImage || isVideo ? (
                    <span className="text-[12px] font-normal opacity-75">
                      · {totalCredits} {t('credits')}
                    </span>
                  ) : null}
                </span>
              </button>
              {isImage || isVideo ? (
                <div className="flex h-11 min-w-0 items-center">
                  <MiniDropdown
                    label={t('Count')}
                    onChange={(v) => setCount(Number(v))}
                    options={[1, 2, 4].map((n) => ({
                      value: String(n),
                      label: isVideo ? t('{{count}} item', { count: n }) : t('{{count}} image', { count: n }),
                    }))}
                    value={String(count)}
                  />
                </div>
              ) : null}
              <button
                className="inline-flex h-11 max-w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[rgba(12,24,36,0.12)] px-4 text-[13px] font-medium text-[#4a6080] transition-colors hover:bg-[rgba(12,24,36,0.05)] hover:text-[#3867ff] dark:border-white/12 dark:text-[#b6c4dc] dark:hover:bg-white/8 dark:hover:text-white"
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
