'use client'

import Link from 'next/link'

import { ArrowRight, KeyRound, SlidersHorizontal, TerminalSquare } from 'lucide-react'
import { useT } from 'next-i18next/client'

/** 快速开始卡片 —— 完成第一条调用链的三步引导 */
export function QuickStart() {
  const { t } = useT('token-hub')

  const steps = [
    {
      title: t('Dashboard QuickStep 1 Title'),
      desc: t('Dashboard QuickStep 1 Desc'),
      href: '/token-hub/keys',
      icon: KeyRound,
    },
    {
      title: t('Dashboard QuickStep 2 Title'),
      desc: t('Dashboard QuickStep 2 Desc'),
      href: '/token-hub/integrations',
      icon: TerminalSquare,
    },
    {
      title: t('Dashboard QuickStep 3 Title'),
      desc: t('Dashboard QuickStep 3 Desc'),
      href: '/token-hub/models',
      icon: SlidersHorizontal,
    },
  ]

  return (
    <div className="rounded-[15px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-(--tc-blue-soft) text-(--tc-primary-text)">
            <ArrowRight className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[-0.01em] text-(--tc-strong)">{t('Dashboard QuickStart Title')}</p>
            <p className="mt-0.5 text-xs text-(--tc-muted)">{t('Dashboard QuickStart Subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1 px-2.5 pt-4 pb-2.5">
        {steps.map(({ title, desc, href, icon: Icon }, idx) => (
          <Link
            key={title}
            href={href}
            className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-(--tc-blue-soft) focus-visible:ring-2 focus-visible:ring-(--tc-primary-hover)/35 focus-visible:outline-none"
          >
            <span className="relative mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-(--tc-border) bg-(--tc-surface) text-(--tc-primary-text)">
              <Icon className="h-4 w-4" />
              <span className="absolute -top-1.5 -left-1.5 grid h-4 w-4 place-items-center rounded-full bg-(--tc-primary) text-[9px] font-bold text-white">{idx + 1}</span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold text-(--tc-strong) transition-colors group-hover:text-(--tc-primary-text)">{title}</span>
              <span className="mt-0.5 block truncate text-xs text-(--tc-muted)">{desc}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
