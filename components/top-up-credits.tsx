'use client'

import { ShoppingBag } from 'lucide-react'
import { useT } from 'next-i18next/client'

interface TopUpCreditsProps {
  /** 会员折扣数值(显示在「会员低至 N 折」中) */
  discount?: number
  /** 积分余额 */
  credits?: number
  /** 点击回调(如打开充值面板) */
  onClick?: () => void
}

/**
 * 充值 + 积分 按钮(SiteHeader 工具条左侧项)
 * 左侧金色胶囊:会员折扣;右侧:金币图标 + 积分余额。
 * 触发按钮使用 rounded-l-full,须置于工具条容器首位。
 */
export function TopUpCredits({ discount = 6, credits = 55, onClick }: TopUpCreditsProps) {
  const { t } = useT('common')

  return (
    <button
      type="button"
      aria-label={t('Top up')}
      onClick={onClick}
      className="group relative inline-flex h-full min-w-0 items-center gap-2 overflow-hidden rounded-l-full px-1.5 pr-3.5 transition hover:bg-[rgba(15,23,42,0.04)] focus-visible:ring-2 focus-visible:ring-[rgba(93,175,206,0.4)] focus-visible:outline-none focus-visible:ring-inset dark:hover:bg-white/6"
    >
      {/* 会员折扣胶囊(常显,不收纳) */}
      <span className="inline-flex h-7 shrink-0 items-center gap-1 overflow-hidden rounded-full bg-[linear-gradient(180deg,#ffd98a,#f4bc57)] px-2 text-[12px] font-semibold tracking-[0.08em] text-[#3b2500] [text-shadow:0_1px_0_rgba(255,222,140,0.55)]">
        <ShoppingBag
          className="h-3.5 w-3.5"
          strokeWidth={1.75}
        />
        <span className="inline-flex min-w-0 items-baseline truncate">
          {t('Membership from')}
          <span className="mx-0.5 text-[15px] leading-none font-extrabold tracking-normal text-[#c8102e] [text-shadow:0_1px_0_rgba(255,222,140,0.7),0_0_6px_rgba(200,16,46,0.32)]">
            {discount}
          </span>
          {t('Percent off')}
        </span>
      </span>
      {/* 积分余额 */}
      <span className="inline-flex h-8 items-center gap-2.5 overflow-hidden rounded-full px-2.5 text-[13px] font-semibold text-[#92701a] transition duration-200 group-hover:-translate-y-[0.5px] group-hover:brightness-[1.03] sm:px-3.5 dark:text-[#d9b45a]">
        <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center transition duration-200 group-hover:scale-[1.04]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 text-[#c8921e]"
            strokeWidth="1.75"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="currentColor"
            />
            <circle
              cx="12"
              cy="12"
              r="9.15"
              fill="none"
              stroke="rgba(255,248,222,0.42)"
              strokeWidth="1.1"
            />
            <rect
              x="8.9"
              y="8.9"
              width="6.2"
              height="6.2"
              rx="1.15"
              transform="rotate(45 12 12)"
              fill="#4b3512"
            />
          </svg>
        </span>
        <span>{credits}</span>
      </span>
    </button>
  )
}
