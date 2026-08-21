'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useInView } from 'framer-motion'

import { cn } from '@/lib/utils'

import './partners-showcase.css'

/* ------------------------------------------------------------------ */
/*  Partner data                                                       */
/* ------------------------------------------------------------------ */

interface PartnerLogo {
  name: string
  symbol: string
  /** Base hue used to tint the placeholder mark */
  hue: number
}

const PARTNERS_ROW_A: PartnerLogo[] = [
  { name: '云从科技', symbol: '☁️', hue: 210 },
  { name: '科大讯飞', symbol: '🎤', hue: 160 },
  { name: '百度智能云', symbol: '🔍', hue: 30 },
  { name: '阿里云', symbol: '☁️', hue: 260 },
  { name: '腾讯云', symbol: '💬', hue: 190 },
  { name: '华为云', symbol: '🌐', hue: 340 },
  { name: '字节跳动', symbol: '⚡', hue: 40 },
  { name: '商汤科技', symbol: '🧠', hue: 280 },
  { name: '旷视科技', symbol: '👁️', hue: 140 },
  { name: '第四范式', symbol: '📊', hue: 0 },
  { name: '智谱AI', symbol: '🔮', hue: 220 },
  { name: '百川智能', symbol: '🌊', hue: 200 },
  { name: 'MiniMax', symbol: '✨', hue: 50 },
  { name: '月之暗面', symbol: '🌙', hue: 240 },
  { name: '零一万物', symbol: '🌱', hue: 120 },
  { name: '面壁智能', symbol: '🛡️', hue: 170 },
]

const PARTNERS_ROW_B: PartnerLogo[] = [
  { name: '中国银行', symbol: '🏦', hue: 340 },
  { name: '平安科技', symbol: '🛡️', hue: 260 },
  { name: '招商银行', symbol: '💎', hue: 160 },
  { name: '中国人寿', symbol: '🎯', hue: 10 },
  { name: '国家电网', symbol: '⚡', hue: 30 },
  { name: '中国移动', symbol: '📶', hue: 180 },
  { name: '比亚迪', symbol: '🚗', hue: 200 },
  { name: '美的集团', symbol: '🏠', hue: 40 },
  { name: '海尔智家', symbol: '❄️', hue: 210 },
  { name: '京东集团', symbol: '🛒', hue: 340 },
  { name: '拼多多', symbol: '📦', hue: 340 },
  { name: '美团', symbol: '🍜', hue: 260 },
  { name: '小米集团', symbol: '📱', hue: 30 },
  { name: '携程集团', symbol: '✈️', hue: 40 },
  { name: '蔚来汽车', symbol: '🔋', hue: 40 },
  { name: '理想汽车', symbol: '🚀', hue: 200 },
  { name: '小鹏汽车', symbol: '🪽', hue: 210 },
  { name: '中兴通讯', symbol: '📡', hue: 140 },
]

/* ------------------------------------------------------------------ */
/*  Logo marquee                                                       */
/* ------------------------------------------------------------------ */

function PartnerLogoItem({ logo }: { logo: PartnerLogo }) {
  return (
    <div
      className={cn(
        'group flex shrink-0 items-center gap-2.5 rounded-2xl border border-gray-200/60 px-4 py-3',
        'bg-white/40 backdrop-blur-sm transition-colors duration-300',
        'hover:border-gray-300/80 dark:border-white/6 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] dark:hover:border-white/14',
      )}
    >
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[16px]"
        style={{
          background: `linear-gradient(135deg, hsl(${logo.hue} 60% 50% / 0.16), hsl(${logo.hue} 40% 60% / 0.05))`,
          border: `1px solid hsl(${logo.hue} 50% 55% / 0.18)`,
        }}
      >
        {logo.symbol}
      </span>
      <span className="whitespace-nowrap text-[13px] font-medium tracking-tight text-gray-500 dark:text-[#c8d0dc]">
        {logo.name}
      </span>
    </div>
  )
}

function MarqueeRow({
  logos,
  reverse = false,
  duration = 36,
}: {
  logos: PartnerLogo[]
  reverse?: boolean
  duration?: number
}) {
  const doubled = useMemo(() => [...logos, ...logos], [logos])

  return (
    <div className="partners-marquee">
      <div
        className="partners-marquee-track"
        data-reverse={reverse}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        {doubled.map((logo, i) => (
          <PartnerLogoItem key={`${logo.name}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Animated stats                                                     */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: '500+', label: '企业客户' },
  { value: '30+', label: '行业覆盖' },
  { value: '99.9%', label: '服务可用性' },
  { value: '千万级', label: '日均调用量' },
]

function useCountUp(target: string, active: boolean, duration = 1100) {
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!active) return

    const match = /^([\d.]+)(.*)$/.exec(target)
    if (!match) {
      setDisplay(target)
      return
    }

    const targetNum = Number.parseFloat(match[1])
    const suffix = match[2]
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const current = targetNum * eased
      setDisplay(`${Number.isInteger(current) ? current : current.toFixed(1)}${suffix}`)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])

  return display
}

function StatItem({ value, label, active }: { value: string; label: string; active: boolean }) {
  const display = useCountUp(value, active)
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-transparent px-3 py-3.5 text-center saturate-145 backdrop-blur-xl dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
      <dt className="text-[22px] font-semibold tabular-nums text-gray-800 dark:text-[#eef4ff]">{display}</dt>
      <dd className="mt-0.5 text-[11px] text-[#91a0b5]">{label}</dd>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function PartnersShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      className="relative mt-16 overflow-hidden rounded-[28px] border border-gray-200/70 bg-transparent saturate-145 backdrop-blur-xl dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(13,20,33,0.55),rgba(8,13,24,0.4))]"
    >
      {/* Decorative accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-80 w-80 rounded-full opacity-[0.05] blur-3xl dark:opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, hsl(210 60% 50%), transparent 70%)' }}
      />

      <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex h-6 items-center rounded-full border border-gray-200 px-2.5 text-[11px] tracking-[0.14em] text-[#718096] uppercase dark:border-white/8 dark:text-white/50">
            生态伙伴
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-700 sm:text-[26px] dark:text-[#eef4ff]">
            与顶尖伙伴携手共创
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-[#91a0b5]">
            深入产业，为 500+ 企业创造卓越价值，让 AI 能力真正落地千行百业。
          </p>
        </div>

        {/* Stats */}
        <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((stat) => (
            <StatItem key={stat.label} value={stat.value} label={stat.label} active={inView} />
          ))}
        </dl>

        {/* Divider */}
        <div className="mx-auto my-8 h-px max-w-3xl bg-linear-to-r from-transparent via-gray-200/60 to-transparent dark:via-white/10" />

        {/* Marquee rows */}
        <div className="space-y-4">
          <MarqueeRow logos={PARTNERS_ROW_A} reverse={false} duration={40} />
          <MarqueeRow logos={PARTNERS_ROW_B} reverse={true} duration={45} />
        </div>

        <p className="mt-6 text-center text-[11px] tracking-wide text-[#91a0b5]/60">
          —— 以上仅为部分合作伙伴展示，排名不分先后 ——
        </p>
      </div>
    </section>
  )
}
