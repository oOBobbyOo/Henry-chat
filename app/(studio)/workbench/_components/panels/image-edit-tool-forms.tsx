'use client'

import { Brush, Crop, ImageMinus, Palette, PenLine, ScanFace, Sparkles } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

import { FieldLabel, FieldLabelIcon, Seg } from './shared'

/**
 * 图片编辑 —— 选择编辑工具后,每个工具各自的参数表单
 * 说明:7 个工具各拆一个独立组件(局部重绘 / 裁剪 / 超分辨率 / 牛皮癣擦除 / 提取主体 / 提取线稿 / 去背景),
 * 由 `ImageEditToolForm` 按工具 id 分发;参数由面板统一持有,切换工具不丢值。
 * 文案对齐参考站:每个工具顶部一行说明(hint)+ 该工具独有的参数。
 */

/** 局部重绘:画笔预设色板 */
export const BRUSH_COLORS = ['#0f172a', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

/**
 * 裁剪比例预设(对齐参考站 original / free / 常见宽高比)
 * 注意:带冒号的宽高比不能用 t('16:9') —— i18next 会把 ':' 当命名空间分隔符,渲染成 '16'
 */
const CROP_RATIOS: Array<{ value: string; i18nKey?: string }> = [
  { value: 'original', i18nKey: 'Original ratio' },
  { value: 'free', i18nKey: 'Free ratio' },
  { value: '1:1' },
  { value: '4:3' },
  { value: '3:4' },
  { value: '16:9' },
  { value: '9:16' },
]

/** 提取主体档位(对齐参考站 general / human / product / humanv2 / productv2,每档带一句说明) */
const SUBJECT_TYPES = [
  { value: 'general', label: 'General subject', hint: 'Subject hint.general' },
  { value: 'human', label: 'Portrait subject', hint: 'Subject hint.human' },
  { value: 'product', label: 'Product subject', hint: 'Subject hint.product' },
  { value: 'humanv2', label: 'Portrait enhance', hint: 'Subject hint.humanv2' },
  { value: 'productv2', label: 'Product enhance', hint: 'Subject hint.productv2' },
]

/** 编辑参数集合(面板持有) */
export type ImageEditParams = {
  /** 局部重绘:画笔粗细(px) */
  brushSize: number
  /** 局部重绘:重绘强度(%) */
  brushStrength: number
  /** 局部重绘:画笔颜色 */
  brushColor: string
  /** 局部重绘:编辑意图(留空由模型判断) */
  editIntent: string
  /** 裁剪:比例预设 */
  cropRatio: string
  /** 超分辨率:放大倍率 */
  upscaleRatio: string
  /** 提取主体:档位 */
  subjectType: string
  /** 提取线稿:线条风格 */
  lineartType: string
}

/** 编辑参数默认值(裁剪默认「原图比例」) */
export const DEFAULT_IMAGE_EDIT_PARAMS: ImageEditParams = {
  brushSize: 2,
  brushStrength: 100,
  brushColor: BRUSH_COLORS[0],
  editIntent: '',
  cropRatio: 'original',
  upscaleRatio: '2x',
  subjectType: 'general',
  lineartType: 'fine',
}

type FormProps = {
  params: ImageEditParams
  onChange: (patch: Partial<ImageEditParams>) => void
}

/** 工具说明行(参考站每个编辑工具自带的一句说明) */
function ToolHint({ tool }: { tool: string }) {
  const { t } = useT('workbench')
  return <p className="text-[11px] leading-4 text-[#5b6b8c] dark:text-[#8a9bc0]">{t(`Edit tool hint.${tool}`)}</p>
}

/** 无需参数的工具(牛皮癣擦除 / 去背景):一行说明,点击开始编辑即自动处理 */
function NoParamHint() {
  const { t } = useT('workbench')
  return (
    <div className="rounded-[12px] border border-dashed border-[rgba(56,103,255,0.28)] bg-[rgba(56,103,255,0.06)] px-3 py-2.5 dark:border-[rgba(143,165,255,0.26)] dark:bg-[rgba(143,165,255,0.08)]">
      <p className="text-[12px] leading-4 text-[#5b6b8c] dark:text-[#8a9bc0]">{t('No params hint')}</p>
    </div>
  )
}

/** 局部重绘:画笔粗细 + 强度(PC 两列)+ 画笔颜色 + 编辑意图 */
export function InpaintForm({ params, onChange }: FormProps) {
  const { t } = useT('workbench')
  return (
    <div className="mt-3 grid gap-1.5">
      <ToolHint tool="inpaint" />
      <div className="grid min-w-0 grid-cols-1 gap-1.5 md:grid-cols-2">
        <div>
          <FieldLabel>
            <span className="flex min-w-0 items-center gap-1.5">
              <FieldLabelIcon icon={Brush} />
              {t('Brush')}
            </span>
          </FieldLabel>
          <div className="flex h-9 items-center gap-3">
            <input
              aria-label={t('Brush')}
              className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[rgba(56,103,255,0.15)] accent-[#3867ff] dark:bg-[rgba(143,165,255,0.15)]"
              max={20}
              min={1}
              onChange={(e) => onChange({ brushSize: Number(e.target.value) })}
              step={1}
              type="range"
              value={params.brushSize}
            />
            <span className="shrink-0 text-[11px] font-medium text-[#3867ff] dark:text-[#8fa5ff]">{params.brushSize}px</span>
          </div>
        </div>
        <div>
          <FieldLabel>
            <span className="flex min-w-0 items-center gap-1.5">
              <FieldLabelIcon icon={Sparkles} />
              {t('Strength')}
            </span>
          </FieldLabel>
          <div className="flex h-9 items-center gap-3">
            <input
              aria-label={t('Strength')}
              className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[rgba(56,103,255,0.15)] accent-[#3867ff] dark:bg-[rgba(143,165,255,0.15)]"
              max={100}
              min={0}
              onChange={(e) => onChange({ brushStrength: Number(e.target.value) })}
              step={1}
              type="range"
              value={params.brushStrength}
            />
            <span className="shrink-0 text-[11px] font-medium text-[#3867ff] dark:text-[#8fa5ff]">{params.brushStrength}%</span>
          </div>
        </div>
      </div>
      <div>
        <FieldLabel>
          <span className="flex min-w-0 items-center gap-1.5">
            <FieldLabelIcon icon={Palette} />
            {t('Color')}
          </span>
        </FieldLabel>
        <div className="flex items-center gap-1.5 py-1">
          {BRUSH_COLORS.map((c) => (
            <button
              aria-label={c}
              className={cn(
                'h-6 w-6 rounded-full border border-[rgba(12,24,36,0.1)] transition-transform dark:border-white/14',
                params.brushColor === c ? 'scale-110 ring-2 ring-[#3867ff] ring-offset-1 ring-offset-white dark:ring-[#8fa5ff] dark:ring-offset-[#0d1220]' : 'hover:scale-105',
              )}
              key={c}
              onClick={() => onChange({ brushColor: c })}
              style={{ backgroundColor: c }}
              type="button"
            />
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>
          <span className="flex min-w-0 items-center gap-1.5">
            <FieldLabelIcon icon={PenLine} />
            {t('Edit intent')}
          </span>
        </FieldLabel>
        <textarea
          aria-label={t('Edit intent')}
          className="w-full resize-none rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 py-2 text-[13px] leading-5 text-[#091423] outline-none transition-colors placeholder:text-[#8a9bc0] focus:border-[rgba(56,103,255,0.4)] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#8a9bc0]"
          onChange={(e) => onChange({ editIntent: e.target.value })}
          placeholder={t('Edit intent placeholder')}
          rows={3}
          value={params.editIntent}
        />
      </div>
    </div>
  )
}

/** 裁剪:裁剪比例 + 拖拽裁剪框说明 */
export function CropForm({ params, onChange }: FormProps) {
  const { t } = useT('workbench')
  return (
    <div className="mt-3 grid gap-1.5">
      <ToolHint tool="crop" />
      <div>
        <FieldLabel>
          <span className="flex min-w-0 items-center gap-1.5">
            <FieldLabelIcon icon={Crop} />
            {t('Crop ratio')}
          </span>
        </FieldLabel>
        <Seg
          onChange={(value) => onChange({ cropRatio: value })}
          options={CROP_RATIOS.map((r) => ({ value: r.value, label: r.i18nKey ? t(r.i18nKey) : r.value }))}
          wrap
          value={params.cropRatio}
        />
      </div>
      <p className="text-[11px] leading-4 text-[#5b6b8c] dark:text-[#8a9bc0]">{t('Crop frame hint')}</p>
    </div>
  )
}

/** 超分辨率:放大倍率 */
export function SuperResolutionForm({ params, onChange }: FormProps) {
  const { t } = useT('workbench')
  return (
    <div className="mt-3 grid gap-1.5">
      <ToolHint tool="super-resolution" />
      <div>
        <FieldLabel>
          <span className="flex min-w-0 items-center gap-1.5">
            <FieldLabelIcon icon={Sparkles} />
            {t('Upscale ratio')}
          </span>
        </FieldLabel>
        <Seg
          onChange={(value) => onChange({ upscaleRatio: value })}
          options={[
            { value: '2x', label: '2×' },
            { value: '4x', label: '4×' },
            { value: '8x', label: '8×' },
          ]}
          value={params.upscaleRatio}
        />
      </div>
      <p className="text-[11px] leading-4 text-[#5b6b8c] dark:text-[#8a9bc0]">{t('Upscale model hint')}</p>
    </div>
  )
}

/** 牛皮癣擦除:一键自动清理(无参数) */
export function ScratchRemovalForm() {
  return (
    <div className="mt-3 grid gap-1.5">
      <ToolHint tool="scratch-removal" />
      <NoParamHint />
    </div>
  )
}

/** 提取主体:主体档位(选中档位下方显示该档说明) */
export function ExtractSubjectForm({ params, onChange }: FormProps) {
  const { t } = useT('workbench')
  const active = SUBJECT_TYPES.find((s) => s.value === params.subjectType) ?? SUBJECT_TYPES[0]
  return (
    <div className="mt-3 grid gap-1.5">
      <ToolHint tool="extract-subject" />
      <div>
        <FieldLabel>
          <span className="flex min-w-0 items-center gap-1.5">
            <FieldLabelIcon icon={ScanFace} />
            {t('Subject type')}
          </span>
        </FieldLabel>
        <Seg
          onChange={(value) => onChange({ subjectType: value })}
          options={SUBJECT_TYPES.map((s) => ({ value: s.value, label: t(s.label) }))}
          value={params.subjectType}
        />
        <p className="mt-1.5 text-[11px] leading-4 text-[#5b6b8c] dark:text-[#8a9bc0]">{t(active.hint)}</p>
      </div>
    </div>
  )
}

/** 提取线稿:线条风格 */
export function ExtractLineartForm({ params, onChange }: FormProps) {
  const { t } = useT('workbench')
  return (
    <div className="mt-3 grid gap-1.5">
      <ToolHint tool="extract-lineart" />
      <div>
        <FieldLabel>
          <span className="flex min-w-0 items-center gap-1.5">
            <FieldLabelIcon icon={PenLine} />
            {t('Lineart type')}
          </span>
        </FieldLabel>
        <Seg
          onChange={(value) => onChange({ lineartType: value })}
          options={[
            { value: 'fine', label: t('Fine lineart') },
            { value: 'coarse', label: t('Coarse lineart') },
          ]}
          value={params.lineartType}
        />
      </div>
    </div>
  )
}

/** 去背景:一键去背景(无参数) */
export function RemoveBackgroundForm() {
  const { t } = useT('workbench')
  return (
    <div className="mt-3 grid gap-1.5">
      <ToolHint tool="remove-bg" />
      <NoParamHint />
      <p className="flex items-center gap-1.5 text-[11px] leading-4 text-[#5b6b8c] dark:text-[#8a9bc0]">
        <ImageMinus
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={1.75}
        />
        {t('Remove bg output hint')}
      </p>
    </div>
  )
}

/** 按工具 id 分发到对应表单(未选工具时返回 null) */
export function ImageEditToolForm({ tool, params, onChange }: { tool: string | null } & FormProps) {
  const { t } = useT('workbench')
  if (!tool) return null
  switch (tool) {
    case 'inpaint':
      return (
        <InpaintForm
          params={params}
          onChange={onChange}
        />
      )
    case 'crop':
      return (
        <CropForm
          params={params}
          onChange={onChange}
        />
      )
    case 'super-resolution':
      return (
        <SuperResolutionForm
          params={params}
          onChange={onChange}
        />
      )
    case 'scratch-removal':
      return <ScratchRemovalForm />
    case 'extract-subject':
      return (
        <ExtractSubjectForm
          params={params}
          onChange={onChange}
        />
      )
    case 'extract-lineart':
      return (
        <ExtractLineartForm
          params={params}
          onChange={onChange}
        />
      )
    case 'remove-bg':
      return <RemoveBackgroundForm />
    default:
      return <p className="mt-3 text-[11px] leading-4 text-[#5b6b8c] dark:text-[#8a9bc0]">{t('Edit tool hint.fallback')}</p>
  }
}
