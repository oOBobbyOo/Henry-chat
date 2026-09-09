'use client'

import { PlazaFeedSection } from './_components/plaza-feed-section'
import { PlazaHero, PlazaSkillsSection } from './_components/plaza-hero'

/**
 * 首页 Plaza(广场)
 * 首页 plaza —— Hero 创作框 + Agent 技能横滑 + 灵感瀑布流
 */
export default function HomePage() {
  return (
    <div className="plaza-page-shell mx-auto w-full max-w-(--app-content-max-width) space-y-4 overflow-x-hidden px-5 pt-6 pb-8">
      <PlazaHero />
      <PlazaSkillsSection />
      <PlazaFeedSection />
    </div>
  )
}
