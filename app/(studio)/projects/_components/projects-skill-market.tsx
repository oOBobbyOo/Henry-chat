'use client'

import { useMemo, useState } from 'react'

import { Plus, Search } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectsSkillsQuery } from '@/services/projects'

/** 技能市场分类筛选条目(对应 market_category) */
const CATEGORY_FILTERS = [
  { key: 'all', labelKey: 'All' },
  { key: 'featured', labelKey: 'Recommended' },
  { key: 'drama', labelKey: 'Drama' },
  { key: 'ecommerce', labelKey: 'E-commerce' },
  { key: 'game', labelKey: 'Game' },
  { key: 'design', labelKey: 'Design' },
  { key: 'general', labelKey: 'General' },
] as const

type CategoryFilter = (typeof CATEGORY_FILTERS)[number]['key']

/**
 * 技能市场
 * 分类横滑条 + 搜索框 + 5 列技能卡片网格(响应式 1/2/3/4/5 列)
 */
export function ProjectsSkillMarket() {
  const { t } = useT('projects')
  const { data, isLoading } = useProjectsSkillsQuery()
  const skills = useMemo(() => data?.data.items ?? [], [data])

  const [category, setCategory] = useState<CategoryFilter>('all')
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    return skills.filter((skill) => {
      if (category === 'featured' && !skill.featured) return false
      if (category !== 'all' && category !== 'featured' && skill.marketCategory !== category) return false
      if (keyword) {
        const kw = keyword.toLowerCase()
        const hit = skill.displayName.toLowerCase().includes(kw) || skill.description.toLowerCase().includes(kw)
        if (!hit) return false
      }
      return true
    })
  }, [skills, category, keyword])

  return (
    <section className="pt-3">
      <h2 className="text-[18px] font-medium tracking-[-0.02em] text-foreground">{t('Skill market')}</h2>
      <p className="mt-2 max-w-[720px] text-[13px] leading-6 text-muted-foreground">{t('Pick vertical skills to let the Agent work in your industry workflow')}</p>

      {/* 分类横滑条 + 搜索框 */}
      <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="[scrollbar-width:none] flex-1 overflow-x-auto">
          <div className="flex min-w-max gap-1.5">
            {CATEGORY_FILTERS.map((item) => {
              const active = category === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategory(item.key)}
                  className={
                    active
                      ? 'shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium text-[#3867ff]'
                      : 'shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium text-[#5b6b8c] hover:text-foreground'
                  }
                  style={active ? { borderColor: 'rgba(56,103,255,0.35)', backgroundColor: 'rgba(56,103,255,0.08)' } : undefined}
                >
                  {t(item.labelKey)}
                </button>
              )
            })}
          </div>
        </div>
        <div className="relative w-full shrink-0 xl:w-[280px]">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9bc0]" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('Search prompts, authors, tags')}
            className="h-11 rounded-full pr-11"
          />
        </div>
      </div>

      {/* 技能卡片网格 */}
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col"
            >
              <Skeleton className="aspect-[16/9] w-full rounded-[12px]" />
              <Skeleton className="mt-3 h-4 w-2/3 rounded" />
              <Skeleton className="mt-2 h-3 w-full rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-[16px] border border-dashed py-16 text-center">
          <p className="text-[15px] font-medium text-foreground">{t('No matching skills')}</p>
          <p className="mt-1 text-[12px] text-muted-foreground">{t('Try other keywords or categories')}</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((skill) => (
            <article
              key={skill.id}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[12px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-[2px] hover:border-[#8a9bc0]/60 hover:shadow-[0_10px_28px_-14px_rgba(15,23,42,0.22)] dark:border-white/8 dark:bg-[#0f1c3a]"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f7f9fd]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={skill.coverUrl}
                  alt={skill.displayName}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {skill.featured && <span className="absolute left-2.5 top-2.5 rounded-full bg-[#b45309] px-2 py-0.5 text-[10px] font-semibold text-white">★</span>}
              </div>
              <div className="flex min-w-0 flex-1 flex-col px-3.5 pb-3.5 pt-3">
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-[-0.01em] text-foreground">{skill.displayName}</p>
                  <button
                    type="button"
                    className="shrink-0 rounded-full bg-gradient-to-br from-[#3898bc] to-[#3867ff] px-3 py-1 text-[11px] font-semibold text-white transition hover:-translate-y-[1px]"
                  >
                    {t('Use')}
                  </button>
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] leading-[1.6] text-[#5b6b8c] dark:text-zinc-400">{skill.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

/**
 * "创建我的 Skill" 按钮(标题行右侧)
 */
export function ProjectsCreateSkillButton() {
  const { t } = useT('projects')
  return (
    <button
      type="button"
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#dce5f6] px-4 text-[13px] font-medium text-foreground transition hover:border-[#8a9bc0]/60 hover:bg-[#f7f9fd]"
    >
      <Plus className="h-4 w-4" />
      {t('Create my Skill')}
    </button>
  )
}
