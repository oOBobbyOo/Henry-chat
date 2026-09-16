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
      {/* 移动端为底部导航栏预留空间(栏高约 64px + bottom-3 间距 + iOS 安全区) */}
      <div className="h-[calc(88px+env(safe-area-inset-bottom))] xl:hidden" aria-hidden />
      {children}
    </div>
  )
}
