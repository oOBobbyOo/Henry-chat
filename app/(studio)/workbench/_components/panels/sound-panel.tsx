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
  // 目标时长(秒,1–180 数字输入)
  const [soundDuration, setSoundDuration] = useState('8')
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
        {/* 目标时长 + 输出格式(pc 一行两列,移动端堆叠换行) */}
        <div className="grid min-w-0 grid-cols-1 gap-1.5 md:grid-cols-2">
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Timer} />
                {t('Target duration')}
              </span>
            </FieldLabel>
            <input
              aria-label={t('Target duration')}
              className="h-9 w-full rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 text-[13px] font-medium text-[#091423] outline-none transition-colors focus:border-[rgba(56,103,255,0.4)] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff]"
              inputMode="numeric"
              max={180}
              min={1}
              onChange={(e) => {
                const n = e.target.value.replace(/\D/g, '')
                setSoundDuration(n === '' ? '' : String(Math.min(180, Math.max(1, Number(n)))))
              }}
              placeholder={t('Target duration placeholder')}
              type="text"
              value={soundDuration}
            />
          </div>
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
      </div>
    </PanelCard>
  )
}
