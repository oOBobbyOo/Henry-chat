'use client'

import type { LucideIcon } from 'lucide-react'

import { AudioWaveform, BookAudio, Eraser, Image, ImageUp, Mic, Music, Orbit, Scissors, Speech, Video } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * Workbench 左侧功能导航 —— 创作 / 编辑两组,激活项左侧 3px 竖条 + 语义色
 */

/** 能力 ID → lucide 图标(与参考站一致) */
const CAPABILITY_ICONS: Record<string, LucideIcon> = {
  'image-gen': Image,
  'video-gen': Video,
  'sound-gen': AudioWaveform,
  'music-gen': Music,
  'voice-gen': Mic,
  'image-edit': Eraser,
  'video-sr': ImageUp,
  'video-matte': Scissors,
  'video-lip-sync': BookAudio,
  'motion-sync': Orbit,
  'avatar-portrait': Speech,
}

interface WorkbenchNavProps {
  /** 全部能力项(config 接口返回) */
  capabilities: Workbench.Capability[]
  /** 当前激活能力 ID */
  activeId: string
  /** 切换能力回调 */
  onSelect: (id: string) => void
}

/** 能力项图标(按能力 ID 匹配,未命中回退图片图标) */
function CapabilityIcon({ capabilityId }: { capabilityId: string }) {
  const Icon = CAPABILITY_ICONS[capabilityId] ?? Image
  return (
    <Icon
      className="h-4.5 w-4.5"
      strokeWidth={1.75}
    />
  )
}

export function WorkbenchNav({ capabilities, activeId, onSelect }: WorkbenchNavProps) {
  const { t } = useT('workbench')

  const groups: Array<{ key: Workbench.CapabilityGroup; label: string }> = [
    { key: 'create', label: t('Create') },
    { key: 'edit', label: t('Edit') },
  ]

  return (
    <aside className="hidden min-h-0 xl:block">
      <div className="sticky top-[88px] isolate overflow-hidden rounded-[24px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(245,249,255,0.82))] shadow-[0_10px_30px_rgba(8,20,48,0.05)] backdrop-blur-md dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))]">
        <nav className="relative flex flex-col gap-6 px-1 py-1.5 pb-5">
          {groups.map((group) => (
            <div
              className="flex flex-col gap-[3px]"
              key={group.key}
            >
              {/* 分组标题 + 渐变分隔线 */}
              <div className="mb-2 flex items-center gap-2.5 px-2.5 text-[10px] font-semibold text-[#8a9bc0] dark:text-[#8a9bc0]">
                <span>{group.label}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-[rgba(12,24,36,0.14)] via-[rgba(12,24,36,0.08)] to-transparent dark:from-white/14 dark:via-white/8" />
              </div>
              {capabilities
                .filter((item) => item.group === group.key)
                .map((item) => {
                  const active = item.id === activeId
                  return (
                    <button
                      className={cn(
                        'group relative w-full cursor-pointer overflow-hidden rounded-[14px] text-left transition-colors',
                        active ? 'bg-[rgba(56,103,255,0.08)] dark:bg-white/6' : 'hover:bg-[rgba(12,24,36,0.03)] dark:hover:bg-white/4',
                      )}
                      key={item.id}
                      onClick={() => onSelect(item.id)}
                      type="button"
                    >
                      {/* 激活左侧竖条 */}
                      <span
                        className={cn(
                          'pointer-events-none absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#3898bc] to-[#3867ff]',
                          active ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <div className="relative flex min-w-0 items-center gap-2 px-3 py-2.5">
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-[rgba(12,24,36,0.06)] bg-[rgba(237,241,255,0.8)] text-[#3867ff] dark:border-white/8 dark:bg-white/6 dark:text-[#8fa5ff]">
                          <CapabilityIcon capabilityId={item.id} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={cn(
                              'truncate text-[13.5px] tracking-[0.01em] transition-colors',
                              active ? 'font-semibold text-[#091423] dark:text-[#eef4ff]' : 'font-medium text-[#2e4268] dark:text-[#b6c4dc]',
                            )}
                          >
                            {t(item.nameKey)}
                          </div>
                        </div>
                        {item.badge ? (
                          <span className="pointer-events-none inline-flex h-[22px] min-w-[38px] shrink-0 items-center justify-center rounded-full border border-[rgba(56,103,255,0.3)] bg-[rgba(56,103,255,0.1)] px-2 text-[10px] font-semibold text-[#3867ff] dark:border-[rgba(143,165,255,0.3)] dark:bg-[rgba(143,165,255,0.12)] dark:text-[#8fa5ff]">
                            <span className="whitespace-nowrap">{item.badge === 'new' ? t('New') : t('Hot')}</span>
                          </span>
                        ) : null}
                      </div>
                    </button>
                  )
                })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
