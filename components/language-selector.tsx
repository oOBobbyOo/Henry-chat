'use client'

import { Check, ChevronDown, Globe } from 'lucide-react'
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

/** 语言选择器（地球图标 + 当前语言 + 下拉箭头）—— 独立于 LanguageSwitcher，适配 Token Hub 门户浅色头部 */
export function LanguageSelector() {
  const { i18n } = useT()
  // 当前语言
  const currentLanguage = i18n.language
  // 专用 hook 切换语言（自动更新 Cookie + 刷新页面）
  const changeLanguage = useChangeLanguage()
  // 当前语言的显示文案
  const currentLabel =
    INTERFACE_LANGUAGE_OPTIONS.find((lang) => lang.code === currentLanguage)?.label ?? ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="切换语言"
          className="h-10 gap-2 rounded-[13px] px-3 text-sm font-medium text-[#1c2c4d] transition-colors hover:bg-[#eef3ff] hover:text-[#294fd4]"
        >
          <Globe className="h-4.5 w-4.5 text-[#8a9bc0]" />
          <span>{currentLabel}</span>
          <ChevronDown className="h-4 w-4 text-[#8a9bc0]" />
        </Button>
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
            <span className="whitespace-nowrap">{lang.label}</span>
            <span className="ms-auto whitespace-nowrap text-xs text-[#8a9bc0]">
              {lang.code === 'zh' ? 'Chinese' : 'English'}
            </span>
            <Check
              size={14}
              className={cn('ms-2 text-[#294fd4]', currentLanguage !== lang.code && 'hidden')}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
