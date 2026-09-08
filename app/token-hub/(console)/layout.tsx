import type { Metadata } from 'next'

import { ConsoleHeader } from './_components/console-header'
import { ConsoleSidebar } from './_components/console-sidebar'

/** Token Hub 控制台 —— 页面元信息 */
export const metadata: Metadata = {
  title: 'Token Hub｜企业 AI 模型网关',
}

/** Token Hub 控制台布局 —— 固定侧边栏 + sticky 顶栏 + 内容区 */
export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-(--tc-surface-raised)">
      <ConsoleSidebar />
      <div className="min-w-0 transition-[padding] duration-300 ease-out lg:pl-67">
        <ConsoleHeader />
        {children}
      </div>
    </div>
  )
}
