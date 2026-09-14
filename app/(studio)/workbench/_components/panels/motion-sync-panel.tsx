'use client'

import { ImagePlus } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { PanelCard, UploadGlyph, UploadZone } from './shared'

/**
 * 动作同步面板 —— 参考站结构:参考图(约束提示)+ 参考视频(建议提示 + 时长说明)+ 提示词(可选)
 * id: motion-sync
 */

export function MotionSyncPanel() {
  const { t } = useT('workbench')

  return (
    <>
      {/* 参考图 */}
      <PanelCard title={t('Reference image')}>
        <UploadZone
          hintLines={[t('Reference image hint')]}
          icon={
            <ImagePlus
              className="h-4.5 w-4.5"
              strokeWidth={1.75}
            />
          }
          title={t('Image')}
        />
      </PanelCard>

      {/* 参考视频 */}
      <PanelCard title={t('Reference video')}>
        <UploadZone
          hintLines={[t('Reference video hint')]}
          icon={<UploadGlyph />}
          title={t('Video')}
        />
        <p className="mt-2 text-[11px] leading-4 text-[#8a9bc0] dark:text-[#6b7f9d]">{t('Reference time hint')}</p>
      </PanelCard>

      {/* 提示词(可选) */}
      <PanelCard
        title={t('Prompt')}
        right={t('Optional')}
      >
        <textarea
          aria-label={t('Prompt')}
          className="min-h-[64px] w-full resize-none rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 py-2 text-[13px] leading-5 text-[#091423] outline-none placeholder:text-[#8a9bc0] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#8a9bc0]"
          placeholder={t('Motion sync prompt placeholder')}
        />
      </PanelCard>
    </>
  )
}
