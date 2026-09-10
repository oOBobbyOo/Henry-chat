'use client'

import { ChevronRight, Star } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Skeleton } from '@/components/ui/skeleton'
import { usePlazaSkillsQuery } from '@/services/plaza'

/**
 * Agent 技能横滑卡片(152px 高、216px 宽,横向滚动 + 右侧渐隐)
 */
export function PlazaSkillScroller() {
  const { t } = useT('plaza')
  const { data, isLoading } = usePlazaSkillsQuery()
  const skills = data?.data.items ?? []

  if (isLoading) {
    return (
      <div className="relative min-w-0 flex-1">
        <div className="flex gap-3 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[152px] w-[216px] shrink-0 rounded-[16px]"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-w-0 flex-1">
      <div className="flex snap-x gap-3 overflow-x-auto select-none">
        {skills.map((skill) => (
          <article
            key={skill.id}
            className="group relative flex h-[152px] w-[216px] shrink-0 snap-start cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/8 dark:bg-[#10192b]"
          >
            <div className="relative min-h-0 flex-1 overflow-hidden">
              {/* 技能封面图(真实抓取的 CDN 图) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={skill.coverUrl}
                alt={skill.displayName}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              {skill.featured && (
                <span className="absolute top-2 right-2 inline-flex h-6 items-center gap-1 rounded-full bg-black/45 px-2 text-[11px] font-medium text-amber-300 backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-amber-300" />
                  {t('Featured')}
                </span>
              )}
            </div>
            <div className="px-3 py-2 text-left">
              <p className="truncate text-[13px] font-medium">{skill.displayName}</p>
              <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">{skill.description}</p>
            </div>
            <ChevronRight className="absolute right-2 bottom-2 h-4 w-4 opacity-0 transition group-hover:opacity-60" />
          </article>
        ))}
      </div>
      {/* 右侧渐隐遮罩 */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent dark:from-[#0b1220]" />
    </div>
  )
}
