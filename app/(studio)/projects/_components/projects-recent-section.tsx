'use client'

import { Plus } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Skeleton } from '@/components/ui/skeleton'
import { useProjectsRecentQuery } from '@/services/projects'

/**
 * 最近项目区
 * 未登录/无项目:16:9 虚线引导卡"+ 登录并开始创作";有项目:6 列封面卡网格
 */
export function ProjectsRecentSection() {
  const { t } = useT('projects')
  const { data, isLoading } = useProjectsRecentQuery()
  const projects = data?.data.items ?? []

  return (
    <section className="pt-1">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[18px] font-medium tracking-[-0.02em] text-foreground">{t('Recent projects')}</h2>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-6">
        {isLoading ? (
          Array.from({ length: 1 }).map((_, i) => (
            <div
              key={i}
              className="min-w-0"
            >
              <Skeleton className="aspect-[16/9] w-full rounded-[16px]" />
            </div>
          ))
        ) : projects.length === 0 ? (
          <div className="min-w-0">
            <button
              type="button"
              className="group block w-full text-left"
            >
              <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[16px] border-2 border-dashed border-[#8a9bc0]/45 bg-[#f7f9fd] transition-all duration-300 group-hover:border-[#3867ff]/70 group-hover:bg-[#3867ff]/[0.04] dark:border-white/15 dark:bg-[#10192b]">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dce5f6] bg-white text-foreground dark:border-white/15 dark:bg-[#0f1c3a]">
                    <Plus className="h-6 w-6" />
                  </div>
                  <p className="mt-2 text-[15px] font-medium tracking-[-0.02em] text-foreground">{t('Sign in to start creating')}</p>
                </div>
              </div>
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#5b6b8c]" />
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="min-w-0"
            >
              <button
                type="button"
                className="group block w-full text-left"
              >
                <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[16px] border border-[#dce5f6] bg-[#f7f9fd] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md dark:border-white/8 dark:bg-[#10192b]">
                  {project.coverUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={project.coverUrl}
                      alt={project.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[13px] text-[#8a9bc0]">{project.name}</span>
                  )}
                </div>
              </button>
              <p className="mt-2 truncate text-[13px] font-medium text-foreground">{project.name}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
