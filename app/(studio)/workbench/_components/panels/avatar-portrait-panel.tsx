'use client'

import { ImagePlus, UserRound, AudioLines, SlidersHorizontal, Maximize, Zap } from 'lucide-react'
import { useT } from 'next-i18next/client'

import {
  FieldLabel,
  FieldLabelIcon,
  PanelCard,
  PanelIcon,
  Seg,
  UploadGlyph,
  UploadZone,
} from './shared'

/**
 * 数字人像面板 —— 参考站结构:① 人像参考图(肖像要求)+ ② 驱动音频(规格约束)+ 生成参数(分辨率 / 加速模式)
 * id: avatar-portrait
 */

export function AvatarPortraitPanel({ configs }: { configs: Workbench.ConfigResponse['data'] }) {
  const { t } = useT('workbench')

  return (
    <>
      {/* 人像参考图 */}
      <PanelCard
        icon={<PanelIcon icon={UserRound} />}
        title={t('Portrait reference')}
      >
        <UploadZone
          hintLines={[t('Portrait reference hint')]}
          icon={
            <ImagePlus
              className="h-4.5 w-4.5"
              strokeWidth={1.75}
            />
          }
          title={t('Image')}
        />
      </PanelCard>

      {/* 驱动音频 */}
      <PanelCard
        icon={<PanelIcon icon={AudioLines} />}
        title={t('Driver audio')}
      >
        <UploadZone
          hintLines={[t('Driver audio constraints')]}
          icon={<UploadGlyph />}
          title={t('Audio')}
        />
      </PanelCard>

      {/* 生成参数 */}
      <PanelCard
        icon={<PanelIcon icon={SlidersHorizontal} />}
        title={t('Generation parameters')}
      >
        <div className="grid gap-1.5">
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Maximize} />
                {t('Resolution')}
              </span>
            </FieldLabel>
            <Seg
              onChange={() => {}}
              options={configs.digitalHuman.resolutions.map((r) => ({
                value: r,
                label: t(`DH resolution.${r}`),
              }))}
              value={configs.digitalHuman.resolutions[0] ?? ''}
            />
          </div>
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Zap} />
                {t('Acceleration mode')}
              </span>
            </FieldLabel>
            <Seg
              onChange={() => {}}
              options={[{ value: 'full-quality', label: t('Keep full quality') }]}
              value="full-quality"
            />
          </div>
        </div>
      </PanelCard>
    </>
  )
}
