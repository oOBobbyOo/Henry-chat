'use client'

import { Check, Globe } from 'lucide-react'
import { useChangeLanguage, useT } from 'next-i18next/client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { INTERFACE_LANGUAGE_OPTIONS } from '@/i18n/languages'
import { cn } from '@/lib/utils'

export function LanguageSelector() {
  const { i18n } = useT()
  // 当前语言
  const currentLanguage = i18n.language
  // 专用 hook 切换语言（自动更新 Cookie + 刷新页面）
  const changeLanguage = useChangeLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="切换语言"
          className="h-10 w-10 rounded-[13px] text-[#8a9bc0] transition-colors hover:bg-[#eef3ff] hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
        >
          <Globe className="h-4.5 w-4.5" />
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
