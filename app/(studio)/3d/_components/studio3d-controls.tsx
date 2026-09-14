'use client'

import { useMemo, useState } from 'react'

import { ChevronDown, ChevronRight, Layers, Sparkles, Upload, Wand2 } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * 3D 建模中部控制面板 —— 模型选择 / 文生·图生·多视图 / 纹理与几何参数 / 高级参数折叠 / 生成 footer
 */

interface Studio3dControlsProps {
  /** 模型列表(config 接口返回) */
  models: Studio3d.ModelOption[]
  /** 纹理质量字典 */
  textureQualities: Studio3d.TextureQualityOption[]
  /** 几何质量字典 */
  geometryQualities: Studio3d.GeometryQualityOption[]
  /** 拓扑字典 */
  topologies: Studio3d.TopologyOption[]
}

/** 参数组标签 + 「?」气泡(悬停展开说明,与参考站 group/label 模式一致) */
function ParamLabel({ hint, label }: { hint?: string; label: string }) {
  return (
    <div className="group/label relative flex items-center gap-1.5">
      <p className="truncate text-[12px] text-[#4e6585] dark:text-[#8a9bc0]">{label}</p>
      {hint ? (
        <>
          <span
            aria-label={hint}
            aria-hidden
            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[rgba(12,24,36,0.08)] text-[10px] leading-none text-[#4e6585] transition-colors group-hover/label:border-[rgba(12,24,36,0.14)] group-hover/label:text-[#4a6080] dark:border-white/10 dark:text-[#6b7f9d]"
            role="img"
          >
            ?
          </span>
          <span className="pointer-events-none absolute bottom-full left-0 z-50 mb-1.5 w-max max-w-[220px] rounded-md border border-[rgba(12,24,36,0.08)] bg-white px-2.5 py-1.5 text-[11px] leading-[1.45] whitespace-normal text-[#2e4268] opacity-0 shadow-lg transition-opacity duration-150 group-hover/label:opacity-100 dark:border-white/10 dark:bg-[#101828] dark:text-[#b6c4dc]">
            {hint}
          </span>
        </>
      ) : null}
    </div>
  )
}

/** 开关(role=switch,激活蓝 #2563eb,与参考站逐字对齐) */
function ToggleSwitch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button
      aria-checked={checked}
      aria-label={checked ? label : undefined}
      className={cn(
        'relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full border transition focus-visible:ring-2 focus-visible:ring-[rgba(48,140,176,0.24)] focus-visible:outline-none',
        checked ? 'border-[#2563eb] bg-[#2563eb] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]' : 'border-[rgba(12,24,36,0.1)] bg-white dark:border-white/10 dark:bg-white/6',
      )}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={cn(
          'absolute h-[14px] w-[14px] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.30)] transition-transform duration-200',
          checked ? 'translate-x-[15px] bg-white' : 'translate-x-[1px] bg-[#aab7c8]',
        )}
      />
    </button>
  )
}

/** 单选组(radiogroup + role=radio,激活 bg-[#2563eb] 白字) */
function ChoiceGroup({
  ariaLabel,
  columns,
  options,
  value,
  onChange,
}: {
  ariaLabel: string
  columns: number
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div
      aria-label={ariaLabel}
      className={cn('grid gap-1 rounded-[10px] border border-[rgba(12,24,36,0.1)] bg-[rgba(245,249,255,0.95)] p-1 dark:border-white/10 dark:bg-white/5', columns === 3 ? 'grid-cols-3' : 'grid-cols-2')}
      role="radiogroup"
    >
      {options.map((opt) => {
        const checked = opt.value === value
        return (
          <button
            aria-checked={checked}
            className={cn(
              'flex h-7 min-w-0 items-center justify-center rounded-[7px] px-2 text-center text-[12px] leading-4 font-semibold transition focus-visible:ring-2 focus-visible:ring-[rgba(48,140,176,0.24)] focus-visible:outline-none',
              checked
                ? 'bg-[#2563eb] !text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]'
                : 'text-[#4e6585] hover:bg-[#dce5f3] hover:text-[#2e4268] dark:text-[#8a9bc0] dark:hover:bg-white/8 dark:hover:text-[#b6c4dc]',
            )}
            key={opt.value}
            onClick={() => onChange(opt.value)}
            role="radio"
            type="button"
          >
            <span className="truncate">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/** 带说明的开关行(标签左 + 开关右,参数面板最小行高 min-h-10) */
function ToggleRow({ checked, hint, label, onChange }: { checked: boolean; hint?: string; label: string; onChange: (v: boolean) => void }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-2.5 rounded-[10px] border border-[rgba(12,24,36,0.1)] bg-[rgba(245,249,255,0.95)] px-2.5 py-1 transition hover:border-[rgba(12,24,36,0.14)] dark:border-white/10 dark:bg-white/5">
      <div className="min-w-0">
        <ParamLabel
          hint={hint}
          label={label}
        />
      </div>
      <ToggleSwitch
        checked={checked}
        label={label}
        onChange={onChange}
      />
    </div>
  )
}

export function Studio3dControls({ models, textureQualities, geometryQualities, topologies }: Studio3dControlsProps) {
  const { t } = useT('studio3d')

  // 表单状态(默认值对齐参考站:Tripo3D 3.1 / 文生 3D / 纹理开+2K / PBR 开 / 标准几何 / 面数上限 / 三角面)
  const [modelId, setModelId] = useState('tripo3d-3.1')
  const [modelOpen, setModelOpen] = useState(false)
  const [inputMode, setInputMode] = useState<Studio3d.InputMode>('text')
  const [prompt, setPrompt] = useState('')
  const [submittedEmpty, setSubmittedEmpty] = useState(false)
  const [texture, setTexture] = useState(true)
  const [textureQuality, setTextureQuality] = useState('2K')
  const [pbr, setPbr] = useState(true)
  const [geometryQuality, setGeometryQuality] = useState('standard')
  const [faceCount, setFaceCount] = useState(1_500_000)
  const [topology, setTopology] = useState<'quad' | 'triangle'>('triangle')
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [geometrySeed, setGeometrySeed] = useState('')
  const [textureSeed, setTextureSeed] = useState('')
  const [textureAlignment, setTextureAlignment] = useState<Studio3d.TextureAlignment>('original_image')
  const [orientation, setOrientation] = useState<Studio3d.ModelOrientation>('default')
  const [realScale, setRealScale] = useState(false)
  const [artStyle, setArtStyle] = useState(false)
  const [compression, setCompression] = useState(false)
  const [uvUnwrap, setUvUnwrap] = useState(true)
  const [partGeneration, setPartGeneration] = useState(false)

  const model = useMemo(() => models.find((m) => m.id === modelId) ?? models[0], [modelId, models])
  const inputModes: Array<{ key: Studio3d.InputMode; labelKey: string }> = [
    { key: 'text', labelKey: 'Text to 3D' },
    { key: 'image', labelKey: 'Image to 3D' },
    { key: 'multiview', labelKey: 'Multiview' },
  ]

  const handleSubmit = () => {
    if (inputMode === 'text' && !prompt.trim()) {
      setSubmittedEmpty(true)
      return
    }
    setSubmittedEmpty(false)
  }

  return (
    <div className="flex h-full min-h-0 min-w-0">
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pt-2.5 pb-2">
          <div className="rounded-[5px] border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] dark:border-white/8 dark:bg-white/4">
            {/* 模型选择(下拉) */}
            <div className="px-2.5 pt-2 pb-1.5">
              <p className="mb-1 text-[12px] font-medium text-[#4e6585] dark:text-[#8a9bc0]">{t('Model selection')}</p>
              <div className="relative">
                <button
                  aria-expanded={modelOpen}
                  aria-haspopup="listbox"
                  className="inline-flex h-[42px] w-full cursor-pointer items-center gap-2 rounded-[12px] border border-[rgba(12,24,36,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,249,252,0.96))] px-3 text-left text-[12px] font-medium text-[#091423] transition hover:border-[rgba(12,24,36,0.2)] focus-visible:ring-2 focus-visible:ring-[rgba(93,175,206,0.28)] focus-visible:outline-none dark:border-white/10 dark:bg-white/6 dark:text-[#eef4ff]"
                  onClick={() => setModelOpen((prev) => !prev)}
                  type="button"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex min-w-0 items-center gap-2 overflow-hidden">
                      <span
                        className="min-w-0 truncate text-[13px] font-medium"
                        title={model?.displayName}
                      >
                        {model?.displayName}
                      </span>
                      {model?.badge ? (
                        <span className="inline-flex shrink-0 items-center rounded-full border border-[rgba(56,103,255,0.3)] bg-[rgba(56,103,255,0.08)] px-1.5 py-[2.5px] text-[10px] leading-none font-medium tracking-[-0.01em] text-[#3867ff]">
                          {t('New', { ns: 'workbench' })}
                        </span>
                      ) : null}
                      {model?.recommended ? (
                        <span className="inline-flex shrink-0 items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 py-[2.5px] text-[10px] leading-none font-medium tracking-[-0.01em] text-amber-600 dark:text-amber-400">
                          {t('Recommended', { ns: 'workbench' })}
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <ChevronRight
                    className={cn('h-3.5 w-3.5 shrink-0 text-[#8a9bc0] transition-transform duration-150', modelOpen && 'rotate-90')}
                    strokeWidth={1.75}
                  />
                </button>
                {modelOpen ? (
                  <ul
                    aria-label={t('Model selection')}
                    className="absolute top-[calc(100%+4px)] right-0 z-30 max-h-[320px] w-[250px] overflow-y-auto rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-white p-1 shadow-[0_16px_40px_rgba(8,20,48,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-[#101828]"
                    role="listbox"
                  >
                    {models.map((m) => {
                      const selected = m.id === modelId
                      return (
                        <li
                          aria-selected={selected}
                          key={m.id}
                          role="option"
                        >
                          <button
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-2 rounded-[9px] px-3 py-2.5 text-left text-[13px] transition',
                              selected ? 'bg-[rgba(56,103,255,0.08)] text-[#3867ff] dark:text-[#8fa5ff]' : 'text-[#2e4268] hover:bg-[rgba(12,24,36,0.04)] dark:text-[#b6c4dc] dark:hover:bg-white/6',
                            )}
                            onClick={() => {
                              setModelId(m.id)
                              setModelOpen(false)
                            }}
                            type="button"
                          >
                            <span
                              className="min-w-0 flex-1 truncate font-medium"
                              title={m.displayName}
                            >
                              {m.displayName}
                            </span>
                            {m.badge ? (
                              <span className="inline-flex shrink-0 items-center rounded-full border border-[rgba(56,103,255,0.3)] bg-[rgba(56,103,255,0.08)] px-2 py-[3px] text-[10px] leading-none font-medium text-[#3867ff]">
                                {t('New', { ns: 'workbench' })}
                              </span>
                            ) : null}
                            {m.recommended ? (
                              <span className="inline-flex shrink-0 items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-[3px] text-[10px] leading-none font-medium text-amber-600 dark:text-amber-400">
                                {t('Recommended', { ns: 'workbench' })}
                              </span>
                            ) : null}
                            {selected ? <span className="text-[11px]">✓</span> : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </div>
            </div>

            {/* 输入方式 tabs + 内容区 */}
            <div className="border-t border-[rgba(12,24,36,0.08)] px-2.5 py-2 dark:border-white/8">
              <div className="mb-2.5">
                <div className="flex gap-1 rounded-[5px] border border-[rgba(12,24,36,0.08)] bg-white p-1 dark:border-white/10 dark:bg-white/6">
                  {inputModes.map((mode) => (
                    <button
                      className={cn(
                        'flex-1 rounded-[8px] py-1.5 text-[12px] font-medium transition',
                        inputMode === mode.key ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#4e6585] dark:text-[#8a9bc0]',
                      )}
                      key={mode.key}
                      onClick={() => setInputMode(mode.key)}
                      type="button"
                    >
                      {t(mode.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
              {inputMode === 'text' ? (
                <div className="flex min-h-[104px] flex-col">
                  <textarea
                    aria-label={t('Text to 3D')}
                    className="min-h-0 w-full flex-1 resize-none rounded-[8px] border border-[rgba(12,24,36,0.08)] bg-white px-3 py-2.5 text-[12px] text-[#091423] outline-none placeholder:text-[#5b6b8c] focus:border-[rgba(12,24,36,0.14)] dark:border-white/10 dark:bg-white/6 dark:text-[#eef4ff] dark:placeholder:text-[#5b6b8c]"
                    onChange={(e) => {
                      setPrompt(e.target.value)
                      if (e.target.value.trim()) setSubmittedEmpty(false)
                    }}
                    placeholder={t('Prompt placeholder')}
                    rows={3}
                    value={prompt}
                  />
                </div>
              ) : (
                <div className="rounded-[8px] border border-[rgba(12,24,36,0.1)] bg-[rgba(245,249,255,0.95)] p-2 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-semibold tracking-[0.01em] text-[#2e4268] dark:text-[#b6c4dc]">
                      {t('Reference image')}
                      <span className="ml-0.5 text-rose-400/80">*</span>
                    </p>
                    <span className="rounded-full border border-[rgba(12,24,36,0.08)] bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#4e6585] tabular-nums dark:border-white/10 dark:bg-white/6 dark:text-[#8a9bc0]">
                      0/{inputMode === 'image' ? 1 : 4}
                    </span>
                  </div>
                  <label className="group mt-2 flex min-h-[104px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[8px] border border-dashed border-[rgba(12,24,36,0.1)] bg-white px-3 py-3 text-center transition focus-within:ring-2 focus-within:ring-[rgba(48,140,176,0.24)] focus-within:outline-none hover:border-[rgba(12,24,36,0.14)] hover:bg-[rgba(93,175,206,0.07)] dark:border-white/12 dark:bg-white/6">
                    <Upload
                      aria-hidden
                      className="h-4 w-4 text-[#8a9bc0] transition group-hover:text-[#091423] dark:group-hover:text-[#eef4ff]"
                      strokeWidth={1.75}
                    />
                    <span className="text-[12px] leading-4 text-[#2e4268] dark:text-[#b6c4dc]">{t('Drag image here or click to select')}</span>
                    <span className="text-[10px] leading-3 text-[#8a9bc0] dark:text-[#6b7f9d]">{t('PNG JPG WebP')}</span>
                    <input
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      type="file"
                    />
                  </label>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <button
                      className="inline-flex h-8 min-w-[112px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border border-[rgba(56,152,188,0.24)] bg-[rgba(93,175,206,0.14)] px-2 text-[12px] font-medium whitespace-nowrap text-[#2e6f8c] transition hover:border-[rgba(56,152,188,0.4)] hover:bg-[rgba(93,175,206,0.2)] focus-visible:outline-none dark:border-sky-300/24 dark:bg-sky-400/[0.14] dark:text-sky-100"
                      type="button"
                    >
                      <Wand2
                        className="h-3.5 w-3.5"
                        strokeWidth={1.75}
                      />
                      {t('Preprocess')}
                    </button>
                    <button
                      className="inline-flex h-8 min-w-[68px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border border-[rgba(12,24,36,0.1)] bg-white px-2 text-[12px] font-medium whitespace-nowrap text-[#2e4268] transition hover:border-[rgba(12,24,36,0.14)] hover:text-[#091423] focus-visible:outline-none dark:border-white/10 dark:bg-white/6 dark:text-[#b6c4dc]"
                      type="button"
                    >
                      <Layers
                        className="h-3.5 w-3.5"
                        strokeWidth={1.75}
                      />
                      {t('Asset library')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 生成参数区 */}
            <div className="border-t border-[rgba(12,24,36,0.08)] px-2.5 py-2 dark:border-white/8">
              <div className="flex flex-col gap-2.5">
                {/* 生成纹理 */}
                <ToggleRow
                  checked={texture}
                  hint={t('Texture hint')}
                  label={t('Texture')}
                  onChange={setTexture}
                />
                {/* 纹理质量 */}
                {texture ? (
                  <div>
                    <div className="mb-1.5">
                      <ParamLabel
                        hint={t('Texture quality hint')}
                        label={t('Texture quality')}
                      />
                    </div>
                    <ChoiceGroup
                      ariaLabel={t('Texture quality')}
                      columns={3}
                      onChange={setTextureQuality}
                      options={textureQualities.map((q) => ({ value: q.value, label: q.value }))}
                      value={textureQuality}
                    />
                  </div>
                ) : null}
                {/* PBR 材质 */}
                <ToggleRow
                  checked={pbr}
                  hint={t('PBR materials hint')}
                  label={t('PBR materials')}
                  onChange={setPbr}
                />
                {/* 几何质量 */}
                <div>
                  <div className="mb-1.5">
                    <ParamLabel
                      hint={t('Geometry quality hint')}
                      label={t('Geometry quality')}
                    />
                  </div>
                  <ChoiceGroup
                    ariaLabel={t('Geometry quality')}
                    columns={2}
                    onChange={setGeometryQuality}
                    options={geometryQualities.map((g) => ({
                      value: g.value,
                      label: g.value === 'standard' ? t('Standard') : t('Ultra'),
                    }))}
                    value={geometryQuality}
                  />
                </div>
                {/* 面数控制 */}
                <div>
                  <div className="mb-1.5">
                    <ParamLabel
                      hint={t('Face count hint')}
                      label={t('Face count')}
                    />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[11px] text-[#4e6585] dark:text-[#8a9bc0]">
                        <span>500</span>
                        <span>1,500,000</span>
                      </div>
                      <input
                        aria-label={t('Face count')}
                        className="studio3d-slider mt-1 w-full"
                        max={1_500_000}
                        min={500}
                        onChange={(e) => setFaceCount(Number(e.target.value))}
                        step={500}
                        style={
                          {
                            '--slider-fill': `${((faceCount - 500) / (1_500_000 - 500)) * 100}%`,
                          } as React.CSSProperties
                        }
                        type="range"
                        value={faceCount}
                      />
                    </div>
                    <input
                      aria-label={t('Face count')}
                      className="h-9 w-[104px] shrink-0 rounded-[7px] border border-[rgba(12,24,36,0.08)] bg-white px-3 text-right text-[12px] text-[#091423] transition outline-none focus:border-[rgba(12,24,36,0.14)] focus:bg-[rgba(245,249,255,0.95)] dark:border-white/10 dark:bg-white/6 dark:text-[#eef4ff]"
                      max={1_500_000}
                      min={500}
                      onChange={(e) => setFaceCount(Number(e.target.value))}
                      step={500}
                      type="number"
                      value={faceCount}
                    />
                  </div>
                </div>
                {/* 拓扑 */}
                <div>
                  <div className="mb-1.5">
                    <ParamLabel
                      hint={t('Topology hint')}
                      label={t('Topology')}
                    />
                  </div>
                  <div className="flex gap-1 rounded-[5px] border border-[rgba(12,24,36,0.08)] bg-white p-1 dark:border-white/10 dark:bg-white/6">
                    {topologies.map((tp) => (
                      <button
                        className={cn(
                          'flex-1 rounded-[8px] py-1.5 text-[12px] font-medium transition',
                          topology === tp.value ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#4e6585] dark:text-[#8a9bc0]',
                        )}
                        key={tp.value}
                        onClick={() => setTopology(tp.value)}
                        type="button"
                      >
                        {t(tp.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* 高级参数(折叠) */}
                <div className="overflow-hidden rounded-[10px] border border-[rgba(12,24,36,0.1)] bg-[rgba(245,249,255,0.95)] dark:border-white/10 dark:bg-white/5">
                  <button
                    aria-expanded={advancedOpen}
                    className="flex min-h-10 w-full items-center gap-2.5 px-2.5 py-1.5 text-left transition hover:bg-[#dce5f3]/60 focus-visible:outline-none dark:hover:bg-white/8"
                    onClick={() => setAdvancedOpen((prev) => !prev)}
                    type="button"
                  >
                    <span className="min-w-0 flex-1 text-[12px] font-medium text-[#2e4268] dark:text-[#b6c4dc]">{t('Advanced parameters')}</span>
                    <ChevronDown
                      className={cn('h-3.5 w-3.5 shrink-0 text-[#8a9bc0] transition-transform duration-200', advancedOpen && 'rotate-180')}
                      strokeWidth={2}
                    />
                  </button>
                  {advancedOpen ? (
                    <div className="flex flex-col gap-2.5 border-t border-[rgba(12,24,36,0.1)] px-2.5 py-2.5 dark:border-white/10">
                      <div>
                        <div className="mb-1.5">
                          <ParamLabel
                            hint={t('Geometry seed hint')}
                            label={t('Geometry seed')}
                          />
                        </div>
                        <input
                          aria-label={t('Geometry seed')}
                          className="h-9 w-full rounded-[7px] border border-[rgba(12,24,36,0.08)] bg-white px-3 text-[12px] text-[#091423] transition outline-none focus:border-[rgba(12,24,36,0.14)] dark:border-white/10 dark:bg-white/6 dark:text-[#eef4ff]"
                          min={0}
                          onChange={(e) => setGeometrySeed(e.target.value)}
                          placeholder={t('Optional')}
                          step={1}
                          type="number"
                          value={geometrySeed}
                        />
                      </div>
                      <div>
                        <div className="mb-1.5">
                          <ParamLabel
                            hint={t('Texture seed hint')}
                            label={t('Texture seed')}
                          />
                        </div>
                        <input
                          aria-label={t('Texture seed')}
                          className="h-9 w-full rounded-[7px] border border-[rgba(12,24,36,0.08)] bg-white px-3 text-[12px] text-[#091423] transition outline-none focus:border-[rgba(12,24,36,0.14)] dark:border-white/10 dark:bg-white/6 dark:text-[#eef4ff]"
                          min={0}
                          onChange={(e) => setTextureSeed(e.target.value)}
                          placeholder={t('Optional')}
                          step={1}
                          type="number"
                          value={textureSeed}
                        />
                      </div>
                      <div>
                        <div className="mb-1.5">
                          <ParamLabel
                            hint={t('Texture alignment hint')}
                            label={t('Texture alignment')}
                          />
                        </div>
                        <ChoiceGroup
                          ariaLabel={t('Texture alignment')}
                          columns={2}
                          onChange={(v) => setTextureAlignment(v as Studio3d.TextureAlignment)}
                          options={[
                            { value: 'original_image', label: t('Align to original') },
                            { value: 'geometry', label: t('Align to geometry') },
                          ]}
                          value={textureAlignment}
                        />
                      </div>
                      <div>
                        <div className="mb-1.5">
                          <ParamLabel
                            hint={t('Model orientation hint')}
                            label={t('Model orientation')}
                          />
                        </div>
                        <ChoiceGroup
                          ariaLabel={t('Model orientation')}
                          columns={2}
                          onChange={(v) => setOrientation(v as Studio3d.ModelOrientation)}
                          options={[
                            { value: 'default', label: t('Default') },
                            { value: 'align_image', label: t('Align to original') },
                          ]}
                          value={orientation}
                        />
                      </div>
                      <ToggleRow
                        checked={realScale}
                        hint={t('Real-world scale hint')}
                        label={t('Real-world scale')}
                        onChange={setRealScale}
                      />
                      <ToggleRow
                        checked={artStyle}
                        hint={t('Art style hint')}
                        label={t('Art style')}
                        onChange={setArtStyle}
                      />
                      <ToggleRow
                        checked={compression}
                        hint={t('Geometry compression hint')}
                        label={t('Geometry compression')}
                        onChange={setCompression}
                      />
                      <ToggleRow
                        checked={uvUnwrap}
                        hint={t('UV unwrap hint')}
                        label={t('UV unwrap')}
                        onChange={setUvUnwrap}
                      />
                      <ToggleRow
                        checked={partGeneration}
                        hint={t('Part generation hint')}
                        label={t('Part generation')}
                        onChange={setPartGeneration}
                      />
                    </div>
                  ) : null}
                </div>
                {/* 分部件生成(参考站放在折叠区外层尾部) */}
                <ToggleRow
                  checked={partGeneration}
                  hint={t('Part generation hint')}
                  label={t('Part generation')}
                  onChange={setPartGeneration}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 生成 footer */}
        <div className="shrink-0 px-2.5 pt-2 pb-2.5">
          <button
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-[14px] font-medium text-white transition hover:opacity-92 focus-visible:outline-none"
            onClick={handleSubmit}
            type="button"
          >
            <Sparkles
              className="h-4 w-4"
              strokeWidth={1.75}
            />
            {t('Generate model')}
            <span className="ml-1.5 rounded-full bg-[#dce5f3] px-2 py-0.5 text-[12px] text-[#091423] dark:bg-white/14 dark:text-[#eef4ff]">{model?.credits ?? 0}</span>
          </button>
          {submittedEmpty ? <p className="mt-1.5 text-center text-[11px] text-rose-600 dark:text-rose-300">{t('Prompt is required')}</p> : null}
        </div>
      </div>
    </div>
  )
}
