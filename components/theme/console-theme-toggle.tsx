'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

/** 主题切换器 —— 88px 三段滑动分段控件(系统/亮/暗),复刻生产 aimix 控制台顶栏 */
export function ConsoleThemeToggle() {
  const { theme, setTheme } = useTheme()
  // 归一化当前主题(无值/未定义视为跟随系统)
  const current = theme === 'light' || theme === 'dark' ? theme : 'system'

  const options = [
    { value: 'system', label: '主题：跟随系统', icon: Monitor },
    { value: 'light', label: '主题：亮色模式', icon: Sun },
    { value: 'dark', label: '主题：暗色模式', icon: Moon },
  ] as const

  const activeIndex = options.findIndex((o) => o.value === current)

  return (
    <div
      role="radiogroup"
      aria-label="界面主题"
      className="relative inline-flex h-9 w-22 shrink-0 items-center rounded-xl border border-(--tc-border) bg-(--tc-surface) p-1 shadow-[0_1px_2px_rgb(15_38_79/0.04)]"
    >
      {/* 滑动高亮块 */}
      <span
        aria-hidden
        className="absolute top-1 left-1 h-7 w-6.5 rounded-lg bg-(--tc-primary) shadow-[0_3px_8px_rgb(49_88_232/0.20)] transition-transform duration-200 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(${activeIndex * 26}px)` }}
      />
      {options.map(({ value, label, icon: Icon }) => {
        const active = current === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={`relative z-10 grid h-7 w-6.5 shrink-0 cursor-pointer place-items-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-(--tc-primary-hover)/35 focus-visible:outline-none ${
              active ? 'text-white' : 'text-(--tc-muted) hover:text-(--tc-primary-text)'
            }`}
          >
            <Icon
              className="h-3.5 w-3.5"
              strokeWidth={2.1}
            />
          </button>
        )
      })}
    </div>
  )
}
