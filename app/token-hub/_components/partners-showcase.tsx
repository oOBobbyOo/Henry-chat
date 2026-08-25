'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import type { SimpleIcon } from 'simple-icons'

import { useInView } from 'framer-motion'
import {
  siAlibabacloud,
  siAnthropic,
  siBaidu,
  siBilibili,
  siBytedance,
  siDeepseek,
  siGoogle,
  siHonor,
  siHuawei,
  siKuaishou,
  siMeituan,
  siMeta,
  siMinimax,
  siMoonshotai,
  siNvidia,
  siOppo,
  siQq,
  siQwen,
  siSinaweibo,
  siTripdotcom,
  siVivo,
  siXiaomi,
} from 'simple-icons'

import { cn } from '@/lib/utils'

import './partners-showcase.css'

/* ------------------------------------------------------------------ */
/*  Partner data                                                       */
/* ------------------------------------------------------------------ */

interface PartnerLogo {
  /** 公司名称 */
  name: string
  /** 品牌 logo 数据（来自 simple-icons） */
  icon: SimpleIcon
}

/* AI 大模型 / 云计算 */
const PARTNERS_ROW_A: PartnerLogo[] = [
  { name: '百度智能云', icon: siBaidu },
  { name: '阿里云', icon: siAlibabacloud },
  { name: '华为云', icon: siHuawei },
  { name: '字节跳动', icon: siBytedance },
  { name: '通义千问', icon: siQwen },
  { name: 'DeepSeek', icon: siDeepseek },
  { name: 'MiniMax', icon: siMinimax },
  { name: '月之暗面', icon: siMoonshotai },
  { name: 'Google', icon: siGoogle },
  { name: 'Meta', icon: siMeta },
  { name: 'NVIDIA', icon: siNvidia },
  { name: 'Anthropic', icon: siAnthropic },
]

/* 大厂 / 平台 */
const PARTNERS_ROW_B: PartnerLogo[] = [
  { name: '腾讯', icon: siQq },
  { name: '美团', icon: siMeituan },
  { name: '小米', icon: siXiaomi },
  { name: '携程集团', icon: siTripdotcom },
  { name: '快手', icon: siKuaishou },
  { name: '微博', icon: siSinaweibo },
  { name: '哔哩哔哩', icon: siBilibili },
  { name: 'OPPO', icon: siOppo },
  { name: 'vivo', icon: siVivo },
  { name: 'Honor', icon: siHonor },
]

/* ------------------------------------------------------------------ */
/*  Logo marquee                                                       */
/* ------------------------------------------------------------------ */

/** 判断品牌色是否接近黑色（仅针对极暗且低饱和度的单色标，暗色主题下需提亮显示；红色/深蓝等饱和品牌色不应被误判） */
function isNearBlack(hex: string): boolean {
  const h = hex.replace('#', '')
  const r = Number.parseInt(h.slice(0, 2), 16)
  const g = Number.parseInt(h.slice(2, 4), 16)
  const b = Number.parseInt(h.slice(4, 6), 16)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return max < 48 && max - min < 24
}

function BrandMark({ icon }: { icon: SimpleIcon }) {
  const hex = icon.hex.replace('#', '')

  if (isNearBlack(hex)) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path
          d={icon.path}
          className="fill-[#1a1e25] dark:fill-[#e8eef7]"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d={icon.path}
        fill={`#${hex}`}
      />
    </svg>
  )
}

function PartnerLogoItem({ logo }: { logo: PartnerLogo }) {
  return (
    <div
      className={cn(
        'group flex shrink-0 items-center gap-2.5 rounded-2xl border border-gray-200/60 px-4 py-3',
        'bg-white/40 backdrop-blur-sm transition-colors duration-300',
        'hover:border-gray-300/80 dark:border-white/6 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] dark:hover:border-white/14',
      )}
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200/70 bg-white dark:border-white/8 dark:bg-white/4">
        <BrandMark icon={logo.icon} />
      </span>
      <span className="whitespace-nowrap text-[13px] font-medium tracking-tight text-gray-500 dark:text-[#c8d0dc]">{logo.name}</span>
    </div>
  )
}

function MarqueeRow({ logos, reverse = false, duration = 36 }: { logos: PartnerLogo[]; reverse?: boolean; duration?: number }) {
  const doubled = useMemo(() => [...logos, ...logos], [logos])

  return (
    <div className="partners-marquee">
      <div
        className="partners-marquee-track gap-3"
        data-reverse={reverse}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        {doubled.map((logo, i) => (
          <PartnerLogoItem
            key={`${logo.name}-${i}`}
            logo={logo}
          />
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
      className="relative overflow-hidden rounded-[28px] border border-gray-200/70 bg-transparent saturate-145 backdrop-blur-xl dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(13,20,33,0.55),rgba(8,13,24,0.4))]"
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
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-700 sm:text-[26px] dark:text-[#eef4ff]">与顶尖伙伴携手共创</h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-[#91a0b5]">深入产业，为 500+ 企业创造卓越价值，让 AI 能力真正落地千行百业。</p>
        </div>

        {/* Stats */}
        <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((stat) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              active={inView}
            />
          ))}
        </dl>

        {/* Divider */}
        <div className="mx-auto my-8 h-px max-w-3xl bg-linear-to-r from-transparent via-gray-200/60 to-transparent dark:via-white/10" />

        {/* Marquee rows */}
        <div className="space-y-4">
          <MarqueeRow
            logos={PARTNERS_ROW_A}
            reverse={false}
            duration={40}
          />
          <MarqueeRow
            logos={PARTNERS_ROW_B}
            reverse={true}
            duration={45}
          />
        </div>

        <p className="mt-6 text-center text-[11px] tracking-wide text-[#91a0b5]/60">—— 以上仅为部分合作伙伴展示，排名不分先后 ——</p>
      </div>
    </section>
  )
}
