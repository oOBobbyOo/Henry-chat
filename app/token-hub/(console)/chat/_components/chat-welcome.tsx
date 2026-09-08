'use client'

import { ArrowRight, Compass, Sparkles } from 'lucide-react'
import { useT } from 'next-i18next/client'

/**
 * Agent Chat 空状态 —— 欢迎语 + 方向建议卡(居中,对齐生产 max-w-[800px])
 */
export function ChatWelcome({ directions, onPickDirection }: { directions: TokenHub.ChatDirection[]; onPickDirection: (title: string) => void }) {
  const { t } = useT('token-hub')

  return (
    <div className="flex h-full flex-col items-center justify-center px-5 py-10 sm:px-8">
      {/* 欢迎语 */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-(--tc-blue-bright)" />
        <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-(--tc-strong) sm:text-[24px]">{t('Chat Welcome Title')}</h2>
      </div>
      <p className="mt-2 max-w-md text-center text-sm leading-6 text-(--tc-body)">{t('Chat Welcome Desc')}</p>

      {/* 方向建议(生产 max-w-[800px] 居中) */}
      <div className="mx-auto mt-9 w-full max-w-200">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-(--tc-primary-text)" />
          <p className="text-[13px] font-semibold text-(--tc-strong)">{t('Chat Directions')}</p>
          <span className="text-[11px] text-(--tc-muted)">{t('Chat Directions Hint')}</span>
        </div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {directions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onPickDirection(d.title)}
              className="group flex cursor-pointer flex-col gap-1.5 rounded-xl border border-(--tc-border) bg-(--tc-surface) p-3.5 text-left transition-colors hover:border-(--tc-primary-hover)/40 hover:bg-(--tc-surface-raised) focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none"
            >
              <span className="text-[13px] font-semibold text-(--tc-strong)">{d.title}</span>
              <span className="text-[11px] leading-4 text-(--tc-muted)">{d.desc}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-(--tc-blue-bright)">
                {t('Chat Use Direction')}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-(--tc-muted)">{t('Chat Or Type Below')}</p>
      </div>
    </div>
  )
}
