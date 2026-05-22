'use client'

import { PromoCarousel, type PromoSlideData } from '@/components/carousel'

const HOME_PROMO_SLIDES: PromoSlideData[] = [
  {
    id: 'nano-banana-2',
    tags: [{ label: '高速出图', accent: true }, { label: '高速图像生成' }],
    title: 'Nano Banana 2',
    subtitle: '更快出图',
    accentClassName: 'from-violet-600/40 via-fuchsia-500/20 to-cyan-500/30',
    description: '适合高频迭代与批量变体：更快生成、更快修改，减少等待，把创意验证节奏拉满。',
    footer: '注册即可直接体验',
    countdown: '活动剩余 39天07时',
    cta: { label: '立即出图', href: '/chat-ai' },
    imageSrc: '/promo/nano-banana.jpg',
    imageAlt: 'Nano Banana 2 高速图像生成',
  },
  {
    id: 'rankings',
    tags: [{ label: '实时榜单', accent: true }],
    title: '模型排行榜',
    subtitle: '实时榜单',
    accentClassName: 'from-emerald-600/35 via-teal-500/20 to-cyan-600/25',
    description: '基于真实使用数据，按日、周、月查看模型与厂商趋势，把握生态脉搏。',
    footer: '数据持续更新',
    cta: { label: '查看排行', href: '/rankings' },
    imageSrc: '/promo/rankings.jpg',
    imageAlt: '模型排行榜',
  },
  {
    id: 'chat-ai',
    tags: [{ label: '多模型', accent: true }, { label: '对话生产' }],
    title: 'AI 对话工作台',
    subtitle: '多模型对话',
    accentClassName: 'from-blue-700/40 via-indigo-600/25 to-slate-800/30',
    description: '支持多模型切换、参数调节与流式输出，在一个界面完成探索与落地。',
    footer: '登录后即可开始对话',
    cta: { label: '开始对话', href: '/chat-ai' },
    imageSrc: '/promo/chat-ai.jpg',
    imageAlt: 'AI 对话工作台',
  },
  {
    id: 'plaza',
    tags: [{ label: '广场', accent: true }],
    title: 'Henry 广场',
    subtitle: '创意广场',
    accentClassName: 'from-indigo-700/40 via-purple-600/25 to-slate-900/35',
    description: '聚合能力入口、活动与精选内容，帮助你快速找到下一步该做什么。',
    footer: '更多能力持续上线',
    cta: { label: '探索广场', href: '/' },
    imageSrc: '/promo/plaza.jpg',
    imageAlt: 'Henry 广场',
  },
]

export function HomePromoCarousel() {
  return (
    <PromoCarousel
      slides={HOME_PROMO_SLIDES}
      className="w-full"
    />
  )
}
