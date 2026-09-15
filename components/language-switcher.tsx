'use client'

import { Check, ChevronRight, Globe } from 'lucide-react'
import { useChangeLanguage, useT } from 'next-i18next/client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { INTERFACE_LANGUAGE_OPTIONS } from '@/i18n/languages'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  /** 展示形态:icon = 纯图标按钮(默认);chip = SiteHeader 胶囊(地球圆座 + 当前语言 + 箭头) */
  variant?: 'icon' | 'chip'
  /** 无障碍标签(icon 形态默认「切换语言」) */
  ariaLabel?: string
}

export function LanguageSwitcher({ variant = 'icon', ariaLabel }: LanguageSwitcherProps) {
  const { i18n } = useT()
  // 当前语言
  const currentLanguage = i18n.language
  // 专用 hook 切换语言（自动更新 Cookie + 刷新页面）
  const changeLanguage = useChangeLanguage()
  // 当前语言的显示文案
  const currentLabel = INTERFACE_LANGUAGE_OPTIONS.find((lang) => lang.code === currentLanguage)?.label ?? ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'chip' ? (
          <button
            type="button"
            aria-label={ariaLabel ?? '切换语言'}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,251,0.96))] px-3 text-[12px] font-medium tracking-[0.01em] text-[#091423] shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_1px_0_rgba(12,24,36,0.06),0_10px_24px_rgba(8,20,48,0.07)] backdrop-blur-[22px] transition hover:border-[rgba(93,175,206,0.35)] hover:bg-[linear-gradient(180deg,rgba(252,254,255,1),rgba(240,247,253,0.98))] dark:border-white/8 dark:bg-none dark:bg-white/4 dark:text-zinc-200 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(0,0,0,0.2),0_10px_24px_rgba(2,6,23,0.35)] dark:hover:border-white/14 dark:hover:bg-white/8"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(250,252,255,0.98),rgba(239,245,251,0.96))] text-[#4a6080] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_1px_0_rgba(12,24,36,0.05)] dark:border-white/8 dark:bg-none dark:bg-white/6 dark:text-[#8fa5c4] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_1px_0_rgba(0,0,0,0.18)]">
              <Globe
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            </span>
            <span
              title={currentLabel}
              className="max-w-[104px] truncate"
            >
              {currentLabel}
            </span>
            <ChevronRight
              className="h-3 w-3 shrink-0 text-[#4a6080] transition-transform duration-200 dark:text-[#7a8db0]"
              strokeWidth={1.75}
            />
          </button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label={ariaLabel ?? '切换语言'}
            className="h-10 w-10 rounded-[13px] text-[#8a9bc0] transition-colors hover:bg-[#eef3ff] hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
          >
            <Globe className="h-4.5 w-4.5" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-40 border border-[#dce5f6] bg-white p-1.5 shadow-[0_12px_32px_rgb(16_35_79/0.12)]"
      >
        {INTERFACE_LANGUAGE_OPTIONS.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="rounded-md text-sm text-[#1c2c4d] data-highlighted:bg-[#eef3ff] data-highlighted:text-[#294fd4]"
          >
            <span>{lang.label}</span>
            <Check
              size={14}
              className={cn('ms-auto text-[#294fd4]', currentLanguage !== lang.code && 'hidden')}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
