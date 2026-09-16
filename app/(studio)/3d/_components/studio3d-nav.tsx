'use client'

import { Boxes, Brush, Layers, Merge, Palette, PersonStanding, Scissors, Wand2 } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * 3D 建模左侧能力导航 —— 7 项竖排图标按钮 + 底部 DCC Bridge
 * 激活项蓝色玻璃态(bg-[rgba(59,130,246,0.13)] + 内阴影描边),禁用项 50% 透明度
 */

/** 能力项图标(按能力 ID 匹配 lucide 图标) */
function CapabilityIcon({ id }: { id: string }) {
  const cls = 'h-[18px] w-[18px]'
  const props = { className: cls, strokeWidth: 2 } as const
  switch (id) {
    case 'model-generation':
      return <Boxes {...props} />
    case 'texture-generation':
      return <Palette {...props} />
    case 'retopology':
      return <Layers {...props} />
    case 'part-segmentation':
      return <Scissors {...props} />
    case 'part-completion':
      return <Merge {...props} />
    case 'auto-rigging':
      return <PersonStanding {...props} />
    case 'animation-retargeting':
      return <Brush {...props} />
    default:
      return <Wand2 {...props} />
  }
}

interface Studio3dNavProps {
  /** 全部能力项(config 接口返回) */
  capabilities: Studio3d.Capability[]
  /** 当前激活能力 ID */
  activeId: string
  /** 切换能力回调(仅 enabled 项可触发) */
  onSelect: (id: string) => void
}

export function Studio3dNav({ capabilities, activeId, onSelect }: Studio3dNavProps) {
  const { t } = useT('studio3d')

  return (
    <aside className="hidden min-h-0 xl:block">
      <div className="flex h-full flex-col items-center gap-0.5 px-1.5 py-3">
        {capabilities.map((item) => {
          const active = item.id === activeId && item.enabled
          return (
            <button
              className={cn(
                'flex w-full flex-col items-center gap-1.5 rounded-[10px] px-1 py-3 transition-all duration-150',
                active
                  ? 'bg-[rgba(59,130,246,0.13)] text-[#091423] shadow-[inset_0_1px_0_rgba(147,197,253,0.22),inset_0_0_0_1px_rgba(59,130,246,0.38),0_2px_14px_-4px_rgba(37,99,235,0.45)] dark:text-[#eef4ff]'
                  : item.enabled
                    ? 'text-[#4a6080] hover:bg-[rgba(59,130,246,0.06)] dark:text-[#b6c4dc]'
                    : 'cursor-not-allowed text-[#091423]/50 dark:text-white/40',
              )}
              disabled={!item.enabled}
              key={item.id}
              onClick={() => item.enabled && onSelect(item.id)}
              title={t(item.titleKey)}
              type="button"
            >
              <CapabilityIcon id={item.id} />
              <span className="text-[12px] leading-none font-semibold tracking-wide">
                {t(item.nameKey)}
              </span>
            </button>
          )
        })}
        {/* 分隔线 + DCC Bridge 入口 */}
        <div className="my-1 h-px w-full bg-[rgba(12,24,36,0.08)] dark:bg-white/8" />
        <button
          className="relative flex w-full flex-col items-center gap-1.5 rounded-[10px] px-1 py-3 text-[#4a6080] transition-all hover:bg-[rgba(59,130,246,0.06)] dark:text-[#b6c4dc]"
          title={t('DCC Bridge hint')}
          type="button"
        >
          <CableIcon />
          <span className="text-[12px] leading-none font-semibold tracking-wide">
            {t('DCC Bridge')}
          </span>
        </button>
      </div>
    </aside>
  )
}

/** DCC Bridge 图标(拼装:方块 + 插头语义,用 lucide 组合近似) */
function CableIcon() {
  return (
    <svg
      aria-hidden
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M4 8h6a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h6" />
      <rect
        height="4"
        width="4"
        x="1"
        y="6"
        rx="1"
      />
      <rect
        height="4"
        width="4"
        x="19"
        y="14"
        rx="1"
      />
    </svg>
  )
}
