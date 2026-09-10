'use client'

import { PlazaFeedSection } from './_components/plaza-feed-section'
import { PlazaHero, PlazaSkillsSection } from './_components/plaza-hero'

/**
 * Plaza(广场)页 —— /plaza
 * Hero 创作框 + Agent 技能横滑 + 灵感瀑布流
 * 与首页 (/) 内容一致;首页仅重定向到本路由
 */
export default function PlazaPage() {
  return (
    <div className="plaza-page-shell mx-auto w-full max-w-(--app-content-max-width) space-y-4 overflow-x-hidden px-5 pt-6 pb-8">
      <PlazaHero />
      <PlazaSkillsSection />
      <PlazaFeedSection />
    </div>
  )
}
