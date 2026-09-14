'use client'

import { useState } from 'react'

import { BookOpen, Music, SlidersHorizontal, Music2, Shapes, Sparkles, Activity, Waves, FileArchive } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Drop, FieldGrid, FieldLabel, FieldLabelIcon, PanelCard, PanelIcon, Seg } from './shared'

/**
 * 音乐生成面板 —— 参考站结构:歌词工作台(新写完整歌词 / 续写编辑 + 智能写词)+ 参数面板(音乐模型 / 创作形态 / 智能写词 / 采样率 / 比特率 / 输出格式)
 */

export function MusicPanel({ configs }: { configs: Workbench.ConfigResponse['data'] }) {
  const { t } = useT('workbench')
  const [lyricMode, setLyricMode] = useState<'new' | 'continue'>('new')
  const [musicForm, setMusicForm] = useState(configs.music.forms[0] ?? '')
  const [smartLyrics, setSmartLyrics] = useState('on')
  const [sampleRate, setSampleRate] = useState(configs.music.sampleRates[0] ?? '')
  const [bitrate, setBitrate] = useState(configs.music.bitrates[0] ?? '')
  const [musicFormat, setMusicFormat] = useState(configs.music.formats[0] ?? '')

  return (
    <>
      {/* 歌词工作台 */}
      <PanelCard
        icon={<PanelIcon icon={Music} />}
        title={t('Lyric workbench')}
        right={t('Supports smart lyrics / manual editing')}
      >
        <div className="grid gap-1.5">
          <div>
            <Seg
              onChange={(v) => setLyricMode(v as 'new' | 'continue')}
              options={[
                { value: 'new', label: t('Write full lyrics') },
                { value: 'continue', label: t('Continue / edit') },
              ]}
              value={lyricMode}
            />
            <p className="mt-1.5 text-[11px] leading-4 text-[#8a9bc0] dark:text-[#6b7f9d]">{lyricMode === 'new' ? t('Write full lyrics hint') : t('Continue / edit hint')}</p>
          </div>
          <button
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[12px] border border-[rgba(56,103,255,0.3)] bg-[rgba(56,103,255,0.08)] text-[13px] font-medium text-[#3867ff] transition-colors hover:bg-[rgba(56,103,255,0.14)] dark:border-[rgba(143,165,255,0.3)] dark:text-[#8fa5ff] dark:hover:bg-[rgba(143,165,255,0.14)]"
            type="button"
          >
            <BookOpen
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
            {t('Smart lyrics draft')}
          </button>
        </div>
      </PanelCard>

      {/* 参数面板 */}
      <PanelCard
        icon={<PanelIcon icon={SlidersHorizontal} />}
        title={t('Parameter panel')}
        right={t('Fill in model parameters directly')}
      >
        <div className="grid gap-1.5">
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Music2} />
                {t('Music model')}
              </span>
            </FieldLabel>
            <Drop
              onChange={() => {}}
              options={configs.music.models.map((m) => ({ value: m.displayName, label: m.displayName }))}
              value={configs.music.models[0]?.displayName ?? ''}
            />
          </div>
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Shapes} />
                {t('Creation form')}
              </span>
            </FieldLabel>
            <Seg
              onChange={setMusicForm}
              options={configs.music.forms.map((f) => ({ value: f, label: t(f) }))}
              value={musicForm}
            />
          </div>
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Sparkles} />
                {t('Smart lyrics')}
              </span>
            </FieldLabel>
            <Seg
              onChange={setSmartLyrics}
              options={[
                { value: 'on', label: t('On') },
                { value: 'off', label: t('Off') },
              ]}
              value={smartLyrics}
            />
          </div>
          <FieldGrid>
            <div>
              <FieldLabel>
                <span className="flex min-w-0 items-center gap-1.5">
                  <FieldLabelIcon icon={Activity} />
                  {t('Sample rate')}
                </span>
              </FieldLabel>
              <Drop
                onChange={setSampleRate}
                options={configs.music.sampleRates.map((s) => ({ value: s, label: s }))}
                value={sampleRate}
              />
            </div>
            <div>
              <FieldLabel>
                <span className="flex min-w-0 items-center gap-1.5">
                  <FieldLabelIcon icon={Waves} />
                  {t('Bitrate')}
                </span>
              </FieldLabel>
              <Drop
                onChange={setBitrate}
                options={configs.music.bitrates.map((b) => ({ value: b, label: b }))}
                value={bitrate}
              />
            </div>
          </FieldGrid>
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={FileArchive} />
                {t('Output format')}
              </span>
            </FieldLabel>
            <Drop
              onChange={setMusicFormat}
              options={configs.music.formats.map((f) => ({ value: f, label: f }))}
              value={musicFormat}
            />
          </div>
        </div>
      </PanelCard>
    </>
  )
}
