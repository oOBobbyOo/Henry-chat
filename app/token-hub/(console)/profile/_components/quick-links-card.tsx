'use client'

import Link from 'next/link'

import { ArrowRight, BarChart3, KeyRound, Plug } from 'lucide-react'
import { useT } from 'next-i18next/client'

/** 常用入口(对齐生产: API Keys / 用量分析 / 应用接入) */
const LINKS = [
  { href: '/token-hub/keys', labelKey: 'Profile Quick Keys', descKey: 'Profile Quick Keys Desc', icon: KeyRound, tone: 'bg-[#edf1ff] text-[#3867ff]' },
  { href: '/token-hub/usage', labelKey: 'Profile Quick Usage', descKey: 'Profile Quick Usage Desc', icon: BarChart3, tone: 'bg-emerald-50 text-emerald-600' },
  { href: '/token-hub/integrations', labelKey: 'Profile Quick Integrations', descKey: 'Profile Quick Integrations Desc', icon: Plug, tone: 'bg-amber-50 text-amber-600' },
]

/**
 * 常用入口卡 —— 快速进入与当前账号相关的功能
 */
export function QuickLinksCard() {
  const { t } = useT('token-hub')

  return (
    <div className="overflow-hidden rounded-[15px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      <div className="px-5 pt-5 sm:px-6">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0f1c3a]">{t('Profile Quick Links')}</h2>
        <p className="mt-1 text-xs text-[#8a9bc0]">{t('Profile Quick Links Desc')}</p>
      </div>

      <div className="px-3 pt-2 pb-3">
        {LINKS.map(({ href, labelKey, descKey, icon: Icon, tone }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-[#f7f9fd]"
          >
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone}`}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-[#0f1c3a]">{t(labelKey)}</span>
              <span className="mt-0.5 block truncate text-[11px] text-[#8a9bc0]">{t(descKey)}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#8a9bc0] transition-transform group-hover:translate-x-0.5 group-hover:text-[#3867ff]" />
          </Link>
        ))}
      </div>
    </div>
  )
}
