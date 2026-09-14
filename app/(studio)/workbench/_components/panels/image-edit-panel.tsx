'use client'

import { useState } from 'react'

import { ImagePlus, ImageUp, Wand2 } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Chips, PanelCard, PanelIcon, UploadZone } from './shared'

/**
 * 图片编辑面板 —— 参考站结构:添加源图片(点击或拖拽上传 + 从资产库选择)+ 选择编辑工具(局部重绘 / 裁剪 / 超分辨率 / 牛皮癣擦除 / 提取主体 / 提取线稿 / 去背景)
 */

export function ImageEditPanel({ configs }: { configs: Workbench.ConfigResponse['data'] }) {
  const { t } = useT('workbench')
  const [imageTools, setImageTools] = useState<string[]>([])

  return (
    <>
      {/* 添加源图片 */}
      <PanelCard
        icon={<PanelIcon icon={ImageUp} />}
        title={t('Add source image')}
      >
        <UploadZone
          hintLines={[t('Click or drag an image')]}
          icon={
            <ImagePlus
              className="h-4.5 w-4.5"
              strokeWidth={1.75}
            />
          }
          multiple
          title={t('Image')}
        />
      </PanelCard>

      {/* 选择编辑工具 */}
      <PanelCard
        icon={<PanelIcon icon={Wand2} />}
        title={t('Choose editing tool')}
      >
        <Chips
          onToggle={(v) => setImageTools((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))}
          options={configs.imageEdit.tools.map((tool) => ({ value: tool, label: t(`Edit tool.${tool}`) }))}
          selected={imageTools}
        />
      </PanelCard>
    </>
  )
}
