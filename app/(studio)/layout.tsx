'use client'

import { AppRail } from '@/components/app-rail'
import { SiteHeader } from '@/components/site-header'

/**
 * Studio 布局 —— /plaza、/projects 等 studio 路由组共用
 * 顶部横条(SiteHeader) + 左侧悬浮导航栏(AppRail)统一在此挂载,页面本身不再各自引入
 */
export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-full xl:pl-[128px]">
      <AppRail />
      <SiteHeader />
      {children}
    </div>
  )
}
