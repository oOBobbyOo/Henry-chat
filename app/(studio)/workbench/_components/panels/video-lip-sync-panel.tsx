'use client'

import { useState } from 'react'

import { Mic, ImageUp, AudioLines, AlignHorizontalJustifyCenter } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Chips, PanelCard, PanelIcon, Seg, UploadGlyph, UploadZone } from './shared'

/**
 * 视频对口型面板 —— 参考站结构:对口型模型(Sync LipSync / Kling LipSync)+ 添加源视频 + 驱动音频(必填)+ 对齐模式(截断 / 循环补齐 / 往返补齐 / 静音补齐 / 时长重映射)
 * id: video-lip-sync
 */

export function VideoLipSyncPanel({ configs }: { configs: Workbench.ConfigResponse['data'] }) {
  const { t } = useT('workbench')
  const [lipsyncModel, setLipsyncModel] = useState(configs.lipsync.models[0] ?? '')
  const [alignModes, setAlignModes] = useState<string[]>([configs.lipsync.alignModes[0] ?? ''])

  return (
    <>
      {/* 对口型模型 */}
      <PanelCard
        icon={<PanelIcon icon={Mic} />}
        title={t('Lip sync model')}
      >
        <Seg
          onChange={setLipsyncModel}
          options={configs.lipsync.models.map((m) => ({ value: m, label: t(`Lipsync model.${m}`) }))}
          value={lipsyncModel}
        />
      </PanelCard>

      {/* 添加源视频 */}
      <PanelCard
        icon={<PanelIcon icon={ImageUp} />}
        title={t('Add source video')}
      >
        <UploadZone
          hintLines={[t('Click or drag a video')]}
          icon={<UploadGlyph />}
          title={t('Video')}
        />
      </PanelCard>

      {/* 驱动音频(必填) */}
      <PanelCard
        icon={<PanelIcon icon={AudioLines} />}
        title={t('Driver audio')}
        right={t('Required')}
      >
        <UploadZone
          hintLines={[t('Drag driver audio here')]}
          icon={<UploadGlyph />}
          title={t('Audio')}
        />
      </PanelCard>

      {/* 对齐模式 */}
      <PanelCard
        icon={<PanelIcon icon={AlignHorizontalJustifyCenter} />}
        title={t('Alignment mode')}
      >
        <Chips
          onToggle={(v) => setAlignModes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))}
          options={configs.lipsync.alignModes.map((m) => ({ value: m, label: t(`Align mode.${m}`) }))}
          selected={alignModes}
        />
        <p className="mt-2 text-[11px] leading-4 text-[#8a9bc0] dark:text-[#6b7f9d]">{t('Alignment mode hint')}</p>
      </PanelCard>
    </>
  )
}
