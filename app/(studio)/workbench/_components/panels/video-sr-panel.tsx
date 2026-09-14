'use client'

import { useState } from 'react'

import { useT } from 'next-i18next/client'

import { Drop, FieldGrid, FieldLabel, PanelCard, SliderField, UploadGlyph, UploadZone } from './shared'

/**
 * 视频超分面板 —— 参考站结构:添加源视频 + 超分配置(超分模型 / 放大倍率 / 目标帧率)+ 高级参数(压缩 / 噪点滑块)
 * id: video-sr
 */

export function VideoSrPanel({ configs }: { configs: Workbench.ConfigResponse['data'] }) {
  const { t } = useT('workbench')
  const [upscaleScale, setUpscaleScale] = useState(configs.videoUpscale.scales[0] ?? '')
  const [frameRate, setFrameRate] = useState(configs.videoUpscale.frameRates[0] ?? '')
  const [compress, setCompress] = useState(50)
  const [noise, setNoise] = useState(50)

  return (
    <>
      {/* 添加源视频 */}
      <PanelCard title={t('Add source video')}>
        <UploadZone
          hintLines={[t('Click or drag a video')]}
          icon={<UploadGlyph />}
          title={t('Video')}
        />
      </PanelCard>

      {/* 超分配置 */}
      <PanelCard title={t('Upscale config')}>
        <div className="grid gap-1.5">
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">{t('Upscale model')}</span>
            </FieldLabel>
            <Drop
              onChange={() => {}}
              options={configs.videoUpscale.models.map((m) => ({ value: m.displayName, label: m.displayName }))}
              value={configs.videoUpscale.models[0]?.displayName ?? ''}
            />
          </div>
          <p className="mt-0.5 -mb-1 text-[10px] leading-4 text-[#8a9bc0] dark:text-[#6b7f9d]">{t('Upscale model hint')}</p>
          <FieldGrid>
            <div>
              <FieldLabel>
                <span className="flex min-w-0 items-center gap-1.5">{t('Scale factor')}</span>
              </FieldLabel>
              <Drop
                onChange={setUpscaleScale}
                options={configs.videoUpscale.scales.map((s) => ({ value: s, label: s }))}
                value={upscaleScale}
              />
            </div>
            <div>
              <FieldLabel>
                <span className="flex min-w-0 items-center gap-1.5">{t('Target frame rate')}</span>
              </FieldLabel>
              <Drop
                onChange={setFrameRate}
                options={configs.videoUpscale.frameRates.map((f) => ({ value: f, label: f }))}
                value={frameRate}
              />
            </div>
          </FieldGrid>
        </div>
      </PanelCard>

      {/* 高级参数 */}
      <PanelCard title={t('Advanced parameters')}>
        <div className="grid gap-1.5">
          <SliderField
            label={t('Compression')}
            max={100}
            min={0}
            onChange={setCompress}
            step={1}
            value={compress}
          />
          <SliderField
            label={t('Noise')}
            max={100}
            min={0}
            onChange={setNoise}
            step={1}
            value={noise}
          />
        </div>
      </PanelCard>
    </>
  )
}
