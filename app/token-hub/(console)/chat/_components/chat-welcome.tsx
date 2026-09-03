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
        <Sparkles className="h-5 w-5 text-[#3867ff]" />
        <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#0f1c3a] sm:text-[24px]">{t('Chat Welcome Title')}</h2>
      </div>
      <p className="mt-2 max-w-md text-center text-sm leading-6 text-[#5b6b8c]">{t('Chat Welcome Desc')}</p>

      {/* 方向建议(生产 max-w-[800px] 居中) */}
      <div className="mx-auto mt-9 w-full max-w-200">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#4269ee]" />
          <p className="text-[13px] font-semibold text-[#0f1c3a]">{t('Chat Directions')}</p>
          <span className="text-[11px] text-[#8a9bc0]">{t('Chat Directions Hint')}</span>
        </div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {directions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onPickDirection(d.title)}
              className="group flex cursor-pointer flex-col gap-1.5 rounded-xl border border-[#dce5f6] bg-white p-3.5 text-left transition-colors hover:border-[#4269ee]/40 hover:bg-[#f7f9fd] focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none"
            >
              <span className="text-[13px] font-semibold text-[#0f1c3a]">{d.title}</span>
              <span className="text-[11px] leading-4 text-[#8a9bc0]">{d.desc}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#3867ff]">
                {t('Chat Use Direction')}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-[#8a9bc0]">{t('Chat Or Type Below')}</p>
      </div>
    </div>
  )
}
