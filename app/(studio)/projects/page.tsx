'use client'

import { useState } from 'react'

import { useT } from 'next-i18next/client'

import { ProjectsRecentSection } from './_components/projects-recent-section'
import { ProjectsCreateSkillButton, ProjectsSkillMarket } from './_components/projects-skill-market'

type MarketTab = 'skills' | 'templates'

/**
 * 项目页(Projects)
 * 最近项目 + (技能市场 / 模板精选)Tab 切换区
 */
export default function ProjectsPage() {
  const { t } = useT('projects')
  const [tab, setTab] = useState<MarketTab>('skills')

  const tabs: Array<{ key: MarketTab; label: string }> = [
    { key: 'skills', label: t('Skill market') },
    { key: 'templates', label: t('Template picks') },
  ]

  return (
    <div className="mx-auto w-full max-w-[var(--app-content-max-width)] space-y-14 px-4 pt-6 pb-12 lg:px-6 lg:pt-8">
      <ProjectsRecentSection />

      <section>
        {/* 技能市场 / 模板精选 切换 pills */}
        <div className="flex items-center gap-1.5 border-b border-[#edf1f6] pb-3 dark:border-white/8">
          {tabs.map((item) => {
            const active = tab === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={
                  active
                    ? 'rounded-full border px-4 py-2 text-[13px] font-medium text-[#3867ff]'
                    : 'hover:text-foreground rounded-full border border-transparent px-4 py-2 text-[13px] font-medium text-[#5b6b8c] transition hover:bg-[#f7f9fd] dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200'
                }
                style={
                  active
                    ? {
                        borderColor: 'rgba(56,103,255,0.35)',
                        backgroundColor: 'rgba(56,103,255,0.1)',
                      }
                    : undefined
                }
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {tab === 'skills' ? (
          <div className="space-y-6">
            <div className="flex justify-end pt-3">
              <ProjectsCreateSkillButton />
            </div>
            <ProjectsSkillMarket />
          </div>
        ) : (
          <div className="pt-3">
            {/* 模板精选:参考站当前为空列表,保留区块与空态 */}
            <h2 className="text-foreground text-[18px] font-medium tracking-[-0.02em]">
              {t('Template picks')}
            </h2>
            <div className="mt-6 flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#dce5f6] py-16 text-center dark:border-white/10">
              <p className="text-foreground text-[15px] font-medium">{t('No matching skills')}</p>
              <p className="text-muted-foreground mt-1 text-[12px]">
                {t('Try other keywords or categories')}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
