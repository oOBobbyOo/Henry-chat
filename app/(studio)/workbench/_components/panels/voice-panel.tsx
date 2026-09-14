'use client'

import { useState } from 'react'

import { SlidersHorizontal, Settings2, Mic, Speech, FileArchive, Activity, Waves, Languages, MessageSquare, Code, Braces, Wrench, AudioWaveform, Volume2, Music2 } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Drop, FieldGrid, FieldLabel, FieldLabelIcon, PanelCard, PanelIcon, Seg, SliderField } from './shared'

/**
 * 配音生成面板 —— 参考站结构:参数面板(语音模型 / 音色 / 输出格式 / 采样率 / Opus 码率 / 目标语言 / 语速 / 音量 / 音调)+ 高级参数(表达指令 / SSML / Markdown 过滤 / 文本热修复)
 */

export function VoicePanel({ configs }: { configs: Workbench.ConfigResponse['data'] }) {
  const { t } = useT('workbench')
  const [voice, setVoice] = useState(configs.voice.voices[0] ?? '')
  const [voiceFormat, setVoiceFormat] = useState(configs.voice.formats[0] ?? '')
  const [voiceSampleRate, setVoiceSampleRate] = useState(configs.voice.sampleRates[0] ?? '')
  const [opusBitrate, setOpusBitrate] = useState(configs.voice.opusBitrates[0] ?? '')
  const [language, setLanguage] = useState(configs.voice.languages[0] ?? '')
  const [speed, setSpeed] = useState(1.0)
  const [volume, setVolume] = useState(50)
  const [pitch, setPitch] = useState(1.0)
  const [ssml, setSsml] = useState('off')
  const [mdFilter, setMdFilter] = useState('off')

  return (
    <>
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
                <FieldLabelIcon icon={Mic} />
                {t('Voice model')}
              </span>
            </FieldLabel>
            <Drop
              onChange={() => {}}
              options={configs.voice.models.map((m) => ({ value: m.displayName, label: m.displayName }))}
              value={configs.voice.models[0]?.displayName ?? ''}
            />
          </div>
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Speech} />
                {t('Voice timbre')}
              </span>
            </FieldLabel>
            <Seg
              onChange={setVoice}
              options={configs.voice.voices.map((v) => ({ value: v, label: t(v) }))}
              value={voice}
            />
          </div>
          <FieldGrid>
            <div>
              <FieldLabel>
                <span className="flex min-w-0 items-center gap-1.5">
                  <FieldLabelIcon icon={FileArchive} />
                  {t('Output format')}
                </span>
              </FieldLabel>
              <Drop
                onChange={setVoiceFormat}
                options={configs.voice.formats.map((f) => ({ value: f, label: f }))}
                value={voiceFormat}
              />
            </div>
            <div>
              <FieldLabel>
                <span className="flex min-w-0 items-center gap-1.5">
                  <FieldLabelIcon icon={Activity} />
                  {t('Sample rate')}
                </span>
              </FieldLabel>
              <Drop
                onChange={setVoiceSampleRate}
                options={configs.voice.sampleRates.map((s) => ({ value: s, label: s }))}
                value={voiceSampleRate}
              />
            </div>
            <div>
              <FieldLabel>
                <span className="flex min-w-0 items-center gap-1.5">
                  <FieldLabelIcon icon={Waves} />
                  {t('Opus bitrate')}
                </span>
              </FieldLabel>
              <Drop
                onChange={setOpusBitrate}
                options={configs.voice.opusBitrates.map((b) => ({ value: b, label: b }))}
                value={opusBitrate}
              />
            </div>
            <div>
              <FieldLabel>
                <span className="flex min-w-0 items-center gap-1.5">
                  <FieldLabelIcon icon={Languages} />
                  {t('Target language')}
                </span>
              </FieldLabel>
              <Drop
                onChange={setLanguage}
                options={configs.voice.languages.map((l) => ({ value: l, label: t(`Language.${l}`) }))}
                value={t(`Language.${language}`)}
              />
            </div>
          </FieldGrid>
          <p className="mt-0.5 -mb-1 text-[10px] leading-4 text-[#8a9bc0] dark:text-[#6b7f9d]">{t('Opus bitrate hint')}</p>
          <SliderField
            icon={<FieldLabelIcon icon={AudioWaveform} />}
            label={t('Speech rate')}
            max={2}
            min={0.5}
            onChange={setSpeed}
            step={0.1}
            value={speed}
          />
          <SliderField
            icon={<FieldLabelIcon icon={Volume2} />}
            label={t('Volume')}
            max={100}
            min={0}
            onChange={setVolume}
            step={1}
            value={volume}
          />
          <SliderField
            icon={<FieldLabelIcon icon={Music2} />}
            label={t('Pitch')}
            max={2}
            min={0.5}
            onChange={setPitch}
            step={0.1}
            value={pitch}
          />
        </div>
      </PanelCard>

      {/* 高级参数 */}
      <PanelCard
        icon={<PanelIcon icon={Settings2} />}
        title={t('Advanced parameters')}
        right={t('Optional')}
      >
        <div className="grid gap-1.5">
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={MessageSquare} />
                {t('Expression instruction')}
              </span>
            </FieldLabel>
            <textarea
              aria-label={t('Expression instruction')}
              className="min-h-[56px] w-full resize-none rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 py-2 text-[13px] leading-5 text-[#091423] outline-none placeholder:text-[#8a9bc0] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#8a9bc0]"
              placeholder={t('Expression instruction placeholder')}
            />
          </div>
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Code} />
                {t('SSML')}
              </span>
            </FieldLabel>
            <Seg
              onChange={setSsml}
              options={[
                { value: 'on', label: t('On') },
                { value: 'off', label: t('Off') },
              ]}
              value={ssml}
            />
          </div>
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Braces} />
                {t('Markdown filter')}
              </span>
            </FieldLabel>
            <Seg
              onChange={setMdFilter}
              options={[
                { value: 'on', label: t('On') },
                { value: 'off', label: t('Off') },
              ]}
              value={mdFilter}
            />
          </div>
          <div>
            <FieldLabel>
              <span className="flex min-w-0 items-center gap-1.5">
                <FieldLabelIcon icon={Wrench} />
                {t('Text hotfix')}
              </span>
            </FieldLabel>
            <textarea
              aria-label={t('Text hotfix')}
              className="min-h-[52px] w-full resize-none rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.85)] px-3 py-2 font-mono text-[12px] leading-5 text-[#091423] outline-none placeholder:text-[#8a9bc0] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#8a9bc0]"
              placeholder={t('Text hotfix placeholder')}
            />
          </div>
        </div>
      </PanelCard>
    </>
  )
}
