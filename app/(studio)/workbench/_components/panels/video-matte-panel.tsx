'use client'

import { useState } from 'react'

import { ImageUp, Scissors, Frame, Volume2 } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { FieldLabel, FieldLabelIcon, PanelCard, PanelIcon, Seg, UploadGlyph, UploadZone } from './shared'

/**
 * 视频去背景面板 —— 参考站结构:添加源视频 + 去背景配置(输出背景 / 保留原音)
 * id: video-matte
 */

export function VideoMattePanel({ configs }: { configs: Workbench.ConfigResponse['data'] }) {
  const { t } = useT('workbench')
  const [bgOutput, setBgOutput] = useState(configs.videoRemoveBg.outputs[0] ?? '')
  const [keepAudio, setKeepAudio] = useState('on')

  return (
    <>
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

      {/* 去背景配置 */}
      <PanelCard
        icon={<PanelIcon icon={Scissors} />}
        title={t('Background removal config')}
      >
        <div className="grid gap-1.5">
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Frame} />
                {t('Output background')}
              </span>
            </FieldLabel>
            <Seg
              onChange={setBgOutput}
              options={configs.videoRemoveBg.outputs.map((o) => ({ value: o, label: t(`Bg output.${o}`) }))}
              value={bgOutput}
            />
          </div>
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Volume2} />
                {t('Keep original audio')}
              </span>
            </FieldLabel>
            <Seg
              onChange={setKeepAudio}
              options={[
                { value: 'on', label: t('On') },
                { value: 'off', label: t('Off') },
              ]}
              value={keepAudio}
            />
            <p className="mt-1.5 text-[11px] leading-4 text-[#8a9bc0] dark:text-[#6b7f9d]">{t('Keep original audio hint')}</p>
          </div>
        </div>
      </PanelCard>
    </>
  )
}
