'use client'

import { useRef, useState } from 'react'

import { Brush, Crop, Eraser, Image as ImageIcon, ImageMinus, Layers, PenLine, Plus, ScanFace, Sparkles, Wand2, X } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

import { AssetPickerDialog } from '../asset-picker-dialog'
import { DEFAULT_IMAGE_EDIT_PARAMS, type ImageEditParams, ImageEditToolForm } from './image-edit-tool-forms'
import { PanelCard, PanelIcon } from './shared'

/**
 * 图片编辑面板 —— 参考站结构:添加源图片(点击或拖拽上传 + 从资产库选择)+ 选择编辑工具(7 个竖排图标卡,单选切换显示不同功能表单)
 */

/** 编辑工具图标映射(lucide 语义对齐参考站:画笔/裁剪/增强/擦除/主体/线稿/背景) */
const TOOL_ICONS: Record<string, typeof Brush> = {
  inpaint: Brush,
  crop: Crop,
  'super-resolution': Sparkles,
  'scratch-removal': Eraser,
  'extract-subject': ScanFace,
  'extract-lineart': PenLine,
  'remove-bg': ImageMinus,
}

export function ImageEditPanel({ configs }: { configs: Workbench.ConfigResponse['data'] }) {
  const { t } = useT('workbench')
  // 单选工具(默认选中「裁剪」,进入面板即显示裁剪表单)
  const [selectedTool, setSelectedTool] = useState<string | null>('crop')
  // 各工具参数(集中持有,切换工具不丢值)
  const [params, setParams] = useState<ImageEditParams>(DEFAULT_IMAGE_EDIT_PARAMS)
  /** 局部更新编辑参数 */
  const patchParams = (patch: Partial<ImageEditParams>) => setParams((prev) => ({ ...prev, ...patch }))
  // 源图片(上传预览 / 更换 / 删除)
  const [sourceImage, setSourceImage] = useState<{ name: string; url: string | null; width: number; height: number } | null>(null)
  // 资产库选择弹窗
  const [pickerOpen, setPickerOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  /** 读取选中的图片文件,生成预览并记录原始尺寸 */
  const handleFile = (file?: File | null) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const probe = new window.Image()
    probe.onload = () => setSourceImage({ name: file.name, url, width: probe.naturalWidth, height: probe.naturalHeight })
    probe.src = url
  }

  /** 删除源图片,回到虚线上传态 */
  const clearSource = () => {
    setSourceImage((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url)
      return null
    })
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <>
      {/* 添加源图片(参考站:大虚线上传框即卡,内部含 图片+加号图标组 / 标题 / 提示 / 从资产库选择按钮) */}
      {sourceImage ? (
        <div className="mt-1.5 rounded-[14px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(237,241,255,0.9),rgba(226,233,250,0.85))] p-2 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(7,11,22,0.96),rgba(5,8,16,0.98))]">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="text-[11px] font-medium text-[#091423] dark:text-[#eef4ff]">{t('Source image')}</span>
              <span className="text-[10px] text-[#8a9bc0] dark:text-[#8a9bc0]">{t('Loaded')}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <button
                className="inline-flex h-[21px] items-center rounded-[8px] border border-[rgba(12,24,36,0.1)] bg-white/70 px-2 text-[11px] text-[#4a6080] transition-colors hover:text-[#3867ff] dark:border-white/12 dark:bg-white/6 dark:text-[#b6c4dc] dark:hover:text-[#8fa5ff]"
                onClick={() => fileRef.current?.click()}
                type="button"
              >
                {t('Replace')}
              </button>
              <button
                className="inline-flex h-[21px] items-center rounded-[8px] border border-[rgba(12,24,36,0.1)] bg-white/70 px-2 text-[11px] text-[#4a6080] transition-colors hover:border-[rgba(229,72,77,0.4)] hover:text-[#e5484d] dark:border-white/12 dark:bg-white/6 dark:text-[#b6c4dc] dark:hover:text-[#ff6b6f]"
                onClick={clearSource}
                type="button"
              >
                {t('Delete')}
              </button>
            </span>
          </div>
          <div className="relative mx-auto mt-1.5 w-fit max-w-full overflow-hidden rounded-[12px] border border-[rgba(12,24,36,0.08)] bg-white/60 dark:border-white/10 dark:bg-white/4">
            {sourceImage.url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                alt={sourceImage.name}
                className="mx-auto block max-h-[240px] w-auto max-w-full object-contain"
                src={sourceImage.url}
              />
            ) : (
              <span
                className="flex h-[168px] w-[240px] items-center justify-center"
                style={{ backgroundImage: 'linear-gradient(135deg,rgba(56,152,188,0.32),rgba(56,103,255,0.22))' }}
              >
                <ImageIcon
                  aria-hidden
                  className="h-8 w-8 text-white/80"
                  strokeWidth={1.5}
                />
              </span>
            )}
            <button
              aria-label={t('Delete')}
              className="absolute top-1.5 right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(12,24,36,0.1)] bg-white/90 text-[#4a6080] transition-colors hover:border-[rgba(229,72,77,0.4)] hover:text-[#e5484d] dark:border-white/14 dark:bg-[rgba(9,14,26,0.85)] dark:text-[#b6c4dc] dark:hover:text-[#ff6b6f]"
              onClick={clearSource}
              type="button"
            >
              <X
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-[#8a9bc0] dark:text-[#8a9bc0]">
            {sourceImage.name} · {sourceImage.width} × {sourceImage.height}
          </p>
        </div>
      ) : (
        // 用 div + 显式 input.click():<label> 内首个可标注元素是「从资产库选择」按钮,
        // label 激活目标会被它抢走,导致点「添加源图片」打不开文件选择
        <div
          aria-label={t('Add source image')}
          className="mt-1.5 flex cursor-pointer flex-col items-center gap-3 rounded-[14px] border border-dashed border-[rgba(12,24,36,0.16)] bg-[linear-gradient(180deg,rgba(245,249,255,0.98),rgba(238,244,252,0.96))] px-3 py-8 text-center transition-colors hover:border-[rgba(56,103,255,0.45)] dark:border-white/16 dark:bg-[linear-gradient(180deg,rgba(9,14,26,0.96),rgba(6,10,20,0.98))] dark:hover:border-[rgba(143,165,255,0.45)]"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFile(e.dataTransfer.files?.[0])
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return
            e.preventDefault()
            fileRef.current?.click()
          }}
          role="button"
          tabIndex={0}
        >
          <span className="relative flex h-[47px] w-[47px] items-center justify-center">
            <ImageIcon
              className="h-[22px] w-[22px] text-[#8a9bc0] dark:text-[#8a9bc0]"
              strokeWidth={1.75}
            />
            <Plus
              className="absolute right-1.5 bottom-1.5 h-2.5 w-2.5 text-[#4a6080] dark:text-[#b6c4dc]"
              strokeWidth={2}
            />
          </span>
          <span className="flex flex-col items-center gap-2">
            <span className="text-[13px] font-medium text-[#091423] dark:text-[#eef4ff]">{t('Add source image')}</span>
            <span className="text-[11px] text-[#8a9bc0] dark:text-[#8a9bc0]">{t('Click or drag an image')}</span>
            <button
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[rgba(12,24,36,0.12)] bg-[rgba(56,103,255,0.08)] px-3 text-[12px] text-[#091423] transition-colors hover:border-[rgba(56,103,255,0.4)] hover:text-[#3867ff] dark:border-white/14 dark:bg-[rgba(143,165,255,0.12)] dark:text-[#eef4ff] dark:hover:text-[#8fa5ff]"
              onClick={(e) => {
                // 只开弹窗,不触发外层的上传点击
                e.stopPropagation()
                setPickerOpen(true)
              }}
              type="button"
            >
              <Layers
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
              {t('Select from asset library')}
            </button>
          </span>
        </div>
      )}
      <input
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
        ref={fileRef}
        type="file"
      />
      <PanelCard
        icon={<PanelIcon icon={Wand2} />}
        title={t('Choose editing tool')}
      >
        <div className="grid grid-cols-5 gap-1">
          {configs.imageEdit.tools.map((tool) => {
            const Icon = TOOL_ICONS[tool] ?? Wand2
            const active = selectedTool === tool
            return (
              <button
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-[12px] border px-1.5 py-3 text-center transition-colors',
                  active
                    ? 'border-transparent bg-[#3867ff] font-medium text-white dark:bg-[#5d7dff] dark:text-white'
                    : 'border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.6)] text-[#4a6080] hover:border-[rgba(56,103,255,0.35)] hover:text-[#3867ff] dark:border-white/8 dark:bg-white/4 dark:text-[#8a9bc0] dark:hover:border-[rgba(143,165,255,0.4)] dark:hover:text-[#8fa5ff]',
                )}
                key={tool}
                onClick={() => setSelectedTool(tool)}
                type="button"
              >
                <Icon
                  className="h-3.5 w-3.5 shrink-0"
                  strokeWidth={1.75}
                />
                <span className="text-[10px] leading-none">{t(`Edit tool.${tool}`)}</span>
              </button>
            )
          })}
        </div>

        {/* 工具切换:下方显示对应工具的参数表单(每个工具独立组件,参考站同款) */}
        <ImageEditToolForm
          onChange={patchParams}
          params={params}
          tool={selectedTool}
        />
      </PanelCard>

      {/* 资产库选择弹窗:确认后写入源图(无真实图片,按资产信息渲染占位预览) */}
      <AssetPickerDialog
        assets={configs.libraryAssets}
        onConfirm={(asset) => {
          const [width, height] = asset.dimensions.split('x').map((value) => Number.parseInt(value, 10))
          setSourceImage({
            name: asset.name,
            url: null,
            width: Number.isNaN(width) ? 0 : width,
            height: Number.isNaN(height) ? 0 : height,
          })
        }}
        onOpenChange={setPickerOpen}
        open={pickerOpen}
      />
    </>
  )
}
