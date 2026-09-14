'use client'

import { useState } from 'react'

import { SlidersHorizontal, Shapes, Timer, FileArchive } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Drop, FieldLabel, FieldLabelIcon, PanelCard, PanelIcon, Seg } from './shared'

/**
 * 音效生成面板 —— 参考站结构:参数面板(生成方式 / 目标时长 / 输出格式)
 */

export function SoundPanel({ configs }: { configs: Workbench.ConfigResponse['data'] }) {
  const { t } = useT('workbench')
  const [soundMode, setSoundMode] = useState<string | null>(null)
  const [soundDuration, setSoundDuration] = useState('5')
  const [soundFormat, setSoundFormat] = useState(configs.sound.formats[0] ?? 'AAC')

  return (
    <PanelCard
      icon={<PanelIcon icon={SlidersHorizontal} />}
      title={t('Parameter panel')}
      right={t('Fill in model parameters directly')}
    >
      <div className="grid gap-1.5">
        {/* 生成方式 */}
        <div>
          <FieldLabel>
            <span className="flex min-w-0 items-center gap-1.5">
              <FieldLabelIcon icon={Shapes} />
              {t('Generation method')}
            </span>
          </FieldLabel>
          <Seg
            onChange={(v) => setSoundMode(v === soundMode ? null : v)}
            options={configs.sound.generateModes.map((v) => ({ value: v, label: t(v) }))}
            value={soundMode ?? ''}
          />
        </div>
        {/* 目标时长 */}
        <div>
          <FieldLabel>
            <span className="flex min-w-0 items-center gap-1.5">
              <FieldLabelIcon icon={Timer} />
              {t('Target duration')}
            </span>
          </FieldLabel>
          <Drop
            onChange={setSoundDuration}
            options={configs.sound.durations.map((d) => ({ value: String(d), label: t('{{seconds}} seconds', { seconds: d }) }))}
            value={t('{{seconds}} seconds', { seconds: Number(soundDuration) })}
          />
        </div>
        {/* 输出格式 */}
        <div>
          <FieldLabel>
            <span className="flex min-w-0 items-center gap-1.5">
              <FieldLabelIcon icon={FileArchive} />
              {t('Output format')}
            </span>
          </FieldLabel>
          <Drop
            onChange={setSoundFormat}
            options={configs.sound.formats.map((f) => ({ value: f, label: f }))}
            value={soundFormat}
          />
        </div>
      </div>
    </PanelCard>
  )
}
