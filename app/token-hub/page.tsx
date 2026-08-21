import Link from 'next/link'

import { ArrowRight, BarChart3, Coins, CreditCard, RefreshCw, ShieldCheck, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PartnersShowcase } from './_components/partners-showcase'

const FEATURES = [
  {
    Icon: Coins,
    title: '余额总览',
    description: '清晰查看 Token 余额与可用额度，库存一目了然，避免关键时刻余额不足。',
  },
  {
    Icon: CreditCard,
    title: '一键快速充值',
    description: '支持多种支付方式，充值实时到账，随充随用，无需漫长等待。',
  },
  {
    Icon: BarChart3,
    title: '消费明细追踪',
    description: '按模型、按会话精细化记录每一次调用消耗，消费走向清晰可见。',
  },
  {
    Icon: Zap,
    title: '多模型通用',
    description: '一个 Token 账户即可通用于全部模型与功能，无需为每个能力单独充值。',
  },
  {
    Icon: RefreshCw,
    title: '余额自动刷新',
    description: '用量实时同步、余额自动更新，始终掌握最新状态，决策更从容。',
  },
  {
    Icon: ShieldCheck,
    title: '安全可靠',
    description: '账户与支付全程加密保护，消费记录可查可追溯，使用更安心。',
  },
]

const HIGHLIGHTS = [
  { value: '毫秒级', label: '实时余额同步' },
  { value: '全模型', label: '一套账户通用' },
  { value: '实时可查', label: '消费明细追踪' },
]

const HERO_BADGES = [
  { emoji: '⚡', label: '实时同步' },
  { emoji: '💳', label: '快速充值' },
  { emoji: '📊', label: '消费追踪' },
  { emoji: '🛡️', label: '安全可靠' },
]

export default function TokenHubPage() {
  return (
    <div className="mx-auto w-full max-w-(--app-content-max-width) flex-1 px-4 pt-16 pb-14 sm:px-6 sm:pt-20 sm:pb-16 xl:px-8">
      {/* Hero / intro */}
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-medium tracking-[0.28em] text-[#91a0b5] uppercase dark:text-white/45">
          用量管家 · 清晰可控
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {HERO_BADGES.map(({ emoji, label }) => (
            <span
              key={label}
              className="inline-flex h-7 items-center gap-1.5 rounded-full border border-gray-200 bg-white/60 px-3 text-[12px] text-gray-600 shadow-sm dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] dark:text-[#eef4ff]"
            >
              <span aria-hidden="true">{emoji}</span>
              {label}
            </span>
          ))}
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-700 sm:text-4xl dark:text-[#eef4ff]">
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">一个 Token 账户</span>
          ，管好全部 AI 用量
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#91a0b5]">
          Token 中心集中管理余额、快速充值并实时追踪每一次消费，让多模型 AI 的使用清晰、透明、可控。
        </p>
        <p className="mt-3 text-[12px] tracking-[0.06em] text-[#b1bfd0] dark:text-white/40">
          余额 · 充值 · 消费明细 · 多模型，真正的 AI 用量管家
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-10 rounded-full px-5"
          >
            <Link href="/chat-ai">
              立即体验
              <ArrowRight
                data-icon="inline-end"
                className="h-4 w-4"
              />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-10 rounded-full px-5"
          >
            <Link href="#features">查看功能</Link>
          </Button>
        </div>

        {/* Highlight stats */}
        <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-transparent px-4 py-4 saturate-145 backdrop-blur-xl dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(13,20,33,0.55),rgba(8,13,24,0.4))]"
            >
              <dt className="text-[16px] font-semibold text-gray-800 dark:text-[#eef4ff]">{item.value}</dt>
              <dd className="mt-0.5 text-[12px] text-[#91a0b5]">{item.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Feature grid */}
      <section
        id="features"
        className="mt-16"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-700 sm:text-[26px] dark:text-[#eef4ff]">核心能力，一站掌握</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#91a0b5]">从充值与消耗，到余额与明细，Token 中心把 AI 用量的每一步都打理得井井有条。</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, description }) => (
            <article
              key={title}
              className="group flex flex-col gap-4 rounded-[20px] border border-gray-200 bg-transparent p-6 saturate-145 backdrop-blur-xl transition-colors hover:border-gray-300 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(13,20,33,0.55),rgba(8,13,24,0.4))] dark:hover:border-white/15"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 shadow-sm dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] dark:text-[#eef4ff]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[16px] font-semibold text-gray-800 dark:text-[#eef4ff]">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#91a0b5]">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <PartnersShowcase />

      {/* CTA banner */}
      <section className="mt-14 overflow-hidden rounded-[24px] border border-gray-200 bg-transparent p-8 text-center saturate-145 backdrop-blur-xl sm:p-12 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(13,20,33,0.6),rgba(8,13,24,0.45))]">
        <h2 className="text-xl font-semibold tracking-tight text-gray-700 sm:text-2xl dark:text-[#eef4ff]">准备好掌控每一次 AI 用量了吗？</h2>
        <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-[#91a0b5]">前往 Token 中心，实时查看余额、按需充值与查看消费明细，让 AI 使用成本尽在掌握。</p>
        <Button
          asChild
          size="lg"
          className="mt-7 h-10 rounded-full px-6"
        >
          <Link href="/token-hub">
            进入 Token 中心
            <ArrowRight
              data-icon="inline-end"
              className="h-4 w-4"
            />
          </Link>
        </Button>
      </section>
    </div>
  )
}
