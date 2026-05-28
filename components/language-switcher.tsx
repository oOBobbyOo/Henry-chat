'use client'

import { Check, Languages } from 'lucide-react'
import { useChangeLanguage, useT } from 'next-i18next/client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { INTERFACE_LANGUAGE_OPTIONS } from '@/i18n/languages'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { i18n } = useT()
  // 当前语言
  const currentLanguage = i18n.language
  // 专用 hook 切换语言（自动更新 Cookie + 刷新页面）
  const changeLanguage = useChangeLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {INTERFACE_LANGUAGE_OPTIONS.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
          >
            <span>{lang.label}</span>
            <Check
              size={14}
              className={cn('ms-auto', currentLanguage !== lang.code && 'hidden')}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
