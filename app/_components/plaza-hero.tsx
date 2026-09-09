'use client'

import { ArrowUpRight, Paperclip, Send, Sparkles } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { PlazaSkillScroller } from './plaza-skill-scroller'

/**
 * Hero 区:标题 + 创作输入框 + Agent 技能横滑
 */
export function PlazaHero() {
  const { t } = useT('plaza')

  return (
    <section className="px-1 pt-4 pb-1 text-center">
      {/* 问候标题(参考站按时间显示"晚上好",这里用统一文案) */}
      <h1 className="mx-auto max-w-none text-[clamp(24px,3.2vw,46px)] leading-tight font-semibold tracking-[-0.04em]">
        <span className="mr-[0.3em] inline-flex items-baseline gap-[0.18em] bg-gradient-to-r from-[#e2d9f3] to-[#a78bfa] bg-clip-text text-transparent dark:from-[#6d5bd0] dark:to-[#8b5cf6]">
          <Sparkles
            className="h-[0.72em] w-[0.72em] translate-y-[0.04em] self-center"
            aria-hidden
          />
        </span>
        <span className="bg-gradient-to-r from-[#67e8f9] via-[#22d3ee] to-[#818cf8] bg-clip-text text-transparent dark:from-[#0891b2] dark:via-[#2563eb] dark:to-[#4f46e5]">
          {t('Turn one idea into a set of works')}
        </span>
      </h1>
      <p className="mx-auto mt-2.5 max-w-[620px] text-[15px] leading-[1.85] text-muted-foreground">{t('Hero subtitle')}</p>

      {/* 创作输入框 */}
      <div className="mx-auto mt-5 max-w-[880px] text-left">
        <div className="rounded-[22px] border bg-card/80 p-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,22,38,0.85),rgba(10,15,28,0.85))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_48px_rgba(2,8,24,0.35)]">
          <Textarea
            placeholder={t('Composer placeholder')}
            className="min-h-[64px] resize-none border-0 bg-transparent px-2 text-[14px] shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <div className="flex items-center gap-1 px-1 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-2.5 text-[12px] text-muted-foreground dark:text-zinc-400"
            >
              <Paperclip className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('Add attachment')}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-2.5 text-[12px] text-muted-foreground dark:text-zinc-400"
            >
              <span className="hidden sm:inline">{t('Asset library')}</span>
            </Button>
            <div className="h-5 w-px shrink-0 bg-border dark:bg-white/8" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-2.5 text-[12px] text-muted-foreground dark:text-zinc-400"
            >
              <span className="hidden sm:inline">{t('Model')}</span>
              <span className="text-[12px] opacity-70">{t('Select model')}</span>
            </Button>
            <div className="h-5 w-px shrink-0 bg-border dark:bg-white/8" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-2.5 text-[12px] text-muted-foreground dark:text-zinc-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('Skills')}</span>
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              size="icon-sm"
              className="size-8 shrink-0 rounded-full bg-primary text-primary-foreground"
              aria-label={t('Send')}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Input type="hidden" />
      </div>
    </section>
  )
}

/** 技能区标题 + 横滑卡片的组合容器 */
export function PlazaSkillsSection() {
  const { t } = useT('plaza')

  return (
    <section className="px-1 pt-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="flex shrink-0 flex-col justify-between gap-5">
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.24em] text-[#60a5fa] uppercase dark:text-[#7dd3fc]">{t('Agent Skills')}</p>
            <h2 className="mt-2 text-[22px] leading-[1.25] font-semibold tracking-[-0.02em]">{t('What do you want to create today?')}</h2>
            <p className="mt-2 text-[12.5px] leading-[1.7] text-muted-foreground">{t('Pick a skill to start; the Agent will carry it through the whole creation.')}</p>
          </div>
          <button
            type="button"
            className="group inline-flex w-fit items-center gap-2 text-[13px] font-medium text-foreground/80 transition hover:text-foreground dark:text-zinc-300"
          >
            {t('Explore all skills')}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
        <PlazaSkillScroller />
      </div>
    </section>
  )
}
