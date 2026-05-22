'use client'

import * as React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import './index.css'

type SlideRole = 'active' | 'prev' | 'next' | 'far-left' | 'far-right'

const SLIDE_TRANSFORMS: Record<SlideRole, string> = {
  active: 'translateX(-50%)',
  prev: 'translateX(calc(-50% - 88%))',
  next: 'translateX(calc(-50% + 88%))',
  'far-left': 'translateX(calc(-50% - 200%))',
  'far-right': 'translateX(calc(-50% + 200%))',
}

function getSlideRole(index: number, activeIndex: number, count: number): SlideRole {
  const offset = (((index - activeIndex) % count) + count) % count
  if (offset === 0) return 'active'
  if (count === 1) return 'far-left'
  if (offset === 1) return 'next'
  if (offset === count - 1) return 'prev'
  if (offset < count / 2) return 'far-right'
  return 'far-left'
}

export type CarouselItem = {
  id: string
  content: React.ReactNode
  /** Shown on prev/next peek slides */
  preview?: React.ReactNode
}

type CarouselProps = {
  items: CarouselItem[]
  className?: string
  autoPlayMs?: number
  showArrows?: boolean
  showDots?: boolean
}

export function Carousel({ items, className, autoPlayMs = 6000, showArrows = true, showDots = true }: CarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const count = items.length

  const goTo = React.useCallback(
    (index: number) => {
      if (count === 0) return
      setActiveIndex(((index % count) + count) % count)
    },
    [count],
  )

  const goBy = React.useCallback((delta: number) => goTo(activeIndex + delta), [activeIndex, goTo])

  React.useEffect(() => {
    if (!autoPlayMs || count <= 1 || isPaused) return
    const timer = window.setInterval(() => goBy(1), autoPlayMs)
    return () => window.clearInterval(timer)
  }, [activeIndex, autoPlayMs, count, goBy, isPaused])

  if (count === 0) return null

  return (
    <section
      className={cn('relative w-full', className)}
      aria-roledescription="carousel"
      aria-label="Featured carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        <div className="relative h-[236px] overflow-hidden rounded-[20px] sm:h-[248px]">
          {items.map((item, index) => {
            const role = getSlideRole(index, activeIndex, count)
            const isActive = role === 'active'
            const isAdjacent = role === 'prev' || role === 'next'
            const isFar = role === 'far-left' || role === 'far-right'

            return (
              <div
                key={item.id}
                role={isActive ? undefined : 'button'}
                aria-label={isActive ? undefined : `切换到 ${index + 1}`}
                tabIndex={isActive || isFar ? -1 : 0}
                onClick={() => {
                  if (!isActive) goTo(index)
                }}
                onKeyDown={(e) => {
                  if (isActive) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    goTo(index)
                  }
                }}
                className={cn(
                  'absolute top-0 left-1/2 h-full w-[clamp(280px,64%,920px)] overflow-hidden rounded-[20px]',
                  'shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]',
                  'transition-[transform,opacity,filter] duration-550 ease-[cubic-bezier(0.2,0.85,0.25,1)] will-change-transform',
                  isActive ? 'z-30 cursor-default opacity-100' : 'z-10 cursor-pointer',
                  isAdjacent && 'opacity-90',
                  isFar && 'pointer-events-none opacity-0',
                )}
                style={{
                  transform: SLIDE_TRANSFORMS[role],
                  filter: isAdjacent ? 'brightness(0.42) saturate(0.85)' : undefined,
                }}
              >
                {isActive ? item.content : (item.preview ?? item.content)}
              </div>
            )
          })}
        </div>

        {showArrows && count > 1 ? (
          <>
            <button
              type="button"
              aria-label="上一条"
              onClick={() => goBy(-1)}
              className="absolute top-1/2 left-2 z-40 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(15,18,28,0.9),rgba(11,14,22,0.94))] text-white/85 shadow-[0_16px_32px_-10px_rgba(0,0,0,0.65)] backdrop-blur-md transition hover:border-cyan-300/40 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300/40 focus-visible:outline-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="下一条"
              onClick={() => goBy(1)}
              className="absolute top-1/2 right-2 z-40 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(15,18,28,0.9),rgba(11,14,22,0.94))] text-white/85 shadow-[0_16px_32px_-10px_rgba(0,0,0,0.65)] backdrop-blur-md transition hover:border-cyan-300/40 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300/40 focus-visible:outline-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>

      {showDots && count > 1 ? (
        <div
          className="mt-3 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Carousel pagination"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`切换到第 ${index + 1} 条`}
                onClick={() => goTo(index)}
                className={cn(
                  'inline-flex h-[5px] rounded-full transition-all duration-300 focus-visible:ring-1 focus-visible:ring-cyan-300/40 focus-visible:outline-none',
                  isActive ? 'w-[22px] bg-[linear-gradient(90deg,#67E8F9,#22D3EE)] shadow-[0_0_12px_rgba(34,211,238,0.5)]' : 'w-[5px] bg-white/20 hover:bg-white/40',
                )}
              />
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export type PromoSlideData = {
  id: string
  tags?: { label: string; accent?: boolean }[]
  title: string
  subtitle?: string
  description?: string
  footer?: string
  countdown?: string
  cta?: { label: string; href: string }
  /** CSS gradient fallback when no image */
  background?: string
  /** Local path or remote URL, e.g. /promo/banner.jpg */
  imageSrc?: string
  imageAlt?: string
  accentClassName?: string
}

const DEFAULT_PROMO_BACKGROUND = 'linear-gradient(135deg, #1a1030 0%, #2d1b4e 35%, #0f2847 70%, #0a1628 100%)'

function PromoSlideBackground({ imageSrc, imageAlt, background, priority }: { imageSrc?: string; imageAlt?: string; background?: string; priority?: boolean }) {
  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={imageAlt ?? ''}
        fill
        priority={priority}
        sizes="(max-width: 768px) 92vw, 64vw"
        className="object-cover object-center"
      />
    )
  }

  return (
    <div
      className="absolute inset-0"
      style={{ background: background ?? DEFAULT_PROMO_BACKGROUND }}
    />
  )
}

function PromoSlideOverlays({ data, showGrid }: { data: PromoSlideData; showGrid?: boolean }) {
  return (
    <>
      <div className={cn('pointer-events-none absolute inset-0 bg-linear-to-br opacity-65', data.accentClassName)} />
      {showGrid ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            WebkitMaskImage: 'radial-gradient(80% 100% at 70% 50%, black, transparent 80%)',
            maskImage: 'radial-gradient(80% 100% at 70% 50%, black, transparent 80%)',
          }}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(95deg,rgba(7,7,14,0.92)_0%,rgba(7,7,14,0.7)_38%,rgba(7,7,14,0.32)_62%,rgba(7,7,14,0)_92%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_top,rgba(7,7,14,0.65),transparent)]" />
    </>
  )
}

type PromoSlideProps = {
  data: PromoSlideData
  variant?: 'active' | 'preview'
  priority?: boolean
}

export function PromoSlide({ data, variant = 'active', priority }: PromoSlideProps) {
  const primaryTag = data.tags?.find((t) => t.accent) ?? data.tags?.[0]
  const secondaryTag = data.tags?.find((t) => t.label !== primaryTag?.label)

  if (variant === 'preview') {
    return (
      <div className="relative h-full overflow-hidden rounded-[20px]">
        <PromoSlideBackground
          imageSrc={data.imageSrc}
          imageAlt={data.imageAlt}
          background={data.background}
        />
        <PromoSlideOverlays data={data} />
        <div className="relative z-10 flex h-full flex-col justify-between p-5">
          {primaryTag ? (
            <span className="inline-flex h-6 w-fit items-center gap-1.5 rounded-full border border-cyan-300/40 bg-cyan-400/18 px-2.5 text-[10.5px] font-semibold text-cyan-100/90 backdrop-blur-sm">
              <span
                className="h-[5px] w-[5px] rounded-full bg-cyan-300"
                aria-hidden
              />
              {primaryTag.label}
            </span>
          ) : (
            <span />
          )}
          <div>
            {secondaryTag ? <div className="text-[10px] font-semibold tracking-[0.16em] text-white/55 uppercase">{secondaryTag.label}</div> : null}
            <div className="mt-2 line-clamp-2 text-[20px] leading-[1.05] font-bold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]">{data.title}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full overflow-hidden rounded-[20px]">
      <PromoSlideBackground
        imageSrc={data.imageSrc}
        imageAlt={data.imageAlt}
        background={data.background}
        priority={priority}
      />
      <PromoSlideOverlays
        data={data}
        showGrid
      />

      <div
        aria-hidden
        className="plaza-active-glow"
      />
      <div
        aria-hidden
        className="plaza-active-ring"
      />

      <div className="relative z-10 flex h-full flex-col px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {data.tags?.map((tag) => (
              <span
                key={tag.label}
                className={cn(
                  'inline-flex h-6 items-center gap-1.5 rounded-full px-3 text-[10.5px] font-semibold backdrop-blur-sm',
                  tag.accent ? 'border border-cyan-300/40 bg-cyan-400/18 text-cyan-100/95' : 'border border-white/10 bg-black/40 font-medium text-white/85',
                )}
              >
                {tag.accent ? (
                  <span
                    className="h-[5px] w-[5px] rounded-full bg-cyan-300"
                    aria-hidden
                  />
                ) : null}
                {tag.label}
              </span>
            ))}
          </div>
          {data.countdown ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
              </span>
              <span className="text-[9.5px] font-semibold tracking-[0.16em] text-white/45 uppercase">活动剩余</span>
              <span className="text-[12.5px] font-semibold text-white/95 tabular-nums">{data.countdown}</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col justify-center py-2">
          {data.subtitle ? <p className="text-[clamp(22px,3vw,36px)] leading-[0.98] font-black tracking-tighter text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">{data.subtitle}</p> : null}
          <h2 className="mt-2 max-w-[560px] text-[17px] leading-[1.18] font-semibold tracking-tight text-white/94">{data.title}</h2>
          {data.description ? <p className="mt-2 line-clamp-2 max-w-[560px] text-[12.5px] leading-[1.6] text-white/65">{data.description}</p> : null}
        </div>

        <div className="flex items-end justify-between gap-3">
          {data.footer ? <span className="line-clamp-1 text-[10.5px] text-white/55">{data.footer}</span> : <span />}
          {data.cta ? (
            <Link
              href={data.cta.href}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-semibold tracking-[-0.01em] text-stone-950 shadow-[0_12px_30px_-8px_rgba(34,211,238,0.6),inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-150 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-cyan-300/40 focus-visible:outline-none"
              style={{
                background: 'linear-gradient(135deg, #67E8F9 0%, #22D3EE 55%, #06B6D4 100%)',
              }}
            >
              {data.cta.label}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function PromoCarousel({ slides, className }: { slides: PromoSlideData[]; className?: string }) {
  const items: CarouselItem[] = slides.map((slide, index) => ({
    id: slide.id,
    content: (
      <PromoSlide
        data={slide}
        variant="active"
        priority={index === 0}
      />
    ),
    preview: (
      <PromoSlide
        data={slide}
        variant="preview"
      />
    ),
  }))

  return (
    <Carousel
      items={items}
      className={className}
    />
  )
}
