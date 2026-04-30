'use client'

import { useState } from 'react'

import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'

import { cn } from '@/lib/utils'

import { ChatHistoryList } from './ChatHistoryList'

interface ChatSidebarProps {
  /** 当前模型配置 */
  config: Chat.ModelConfig
  /** 配置变更回调 */
  onConfigChange: (config: Chat.ModelConfig) => void
  /** 添加对比模型回调 */
  onAddCompareModel: () => void
  /** 是否处于对比模式 */
  isCompareMode?: boolean
  /** 取消模型对比回调 */
  onCancelCompare?: () => void
  /** 会话列表 */
  sessions: Chat.Session[]
  /** 当前激活的会话 ID */
  activeSessionId?: string
  /** 会话点击回调 */
  onSessionClick: (sessionId: string) => void
  /** 新建会话回调 */
  onNewSession: () => void
  /** 删除会话回调 */
  onDeleteSession: (sessionId: string) => void
  /** 重命名会话回调 */
  onRenameSession?: (sessionId: string, newTitle: string) => void
  /** 是否还有更多 */
  hasMore?: boolean
  /** 是否正在加载更多 */
  isLoadingMore?: boolean
  /** 加载更多回调 */
  onLoadMore?: () => void
  /** 移动端是否开启（由父组件控制） */
  isMobileOpen?: boolean
  /** 移动端关闭回调 */
  onMobileClose?: () => void
}

export function ChatSidebar({
  config,
  onConfigChange,
  onAddCompareModel,
  isCompareMode = false,
  onCancelCompare,
  sessions,
  activeSessionId,
  onSessionClick,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  isMobileOpen = false,
  onMobileClose,
}: ChatSidebarProps) {
  // 侧边栏折叠状态（默认展开）
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // 切换侧边栏折叠状态
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <>
      {/* --- 移动端遮罩层 --- */}
      <div
        className={cn('fixed inset-0 z-60 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden', isMobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0')}
        onClick={onMobileClose}
      >
        <aside
          className={cn(
            'z-70 flex flex-col border-r border-gray-100 bg-white transition-all duration-300',
            // 移动端样式
            'fixed inset-y-0 left-0 lg:relative',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            // 桌面端折叠样式
            isSidebarCollapsed ? 'lg:w-[48px] lg:min-w-[48px]' : 'w-[280px] min-w-[280px]',
          )}
        >
          {/* 侧边栏头部控制栏 */}
          <div className="flex min-h-[48px] items-center justify-between border-b border-gray-100 p-2">
            <div className="flex items-center gap-2 pl-2">
              <span
                className={cn(
                  'bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-sm font-bold text-transparent transition-opacity',
                  isSidebarCollapsed ? 'opacity-0 lg:hidden' : 'opacity-100',
                )}
              >
                AI
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* 桌面端折叠按钮 */}
              <button
                onClick={toggleSidebar}
                className="hidden rounded-lg p-1.5 text-gray-500 transition-all hover:bg-blue-50 hover:text-blue-600 lg:flex"
                title={isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>

              {/* 移动端关闭按钮 */}
              <button className="rounded-lg p-1.5 text-gray-500 transition-all hover:bg-gray-100 lg:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* --- 侧边栏内容 --- */}
          <div className={cn('flex min-h-0 flex-1 flex-col transition-opacity duration-200', isSidebarCollapsed ? 'lg:pointer-events-none lg:opacity-0' : 'opacity-100')}>
            {/* 历史记录（下方） */}
            <div className="min-h-0 flex-1">
              <ChatHistoryList
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSessionClick={onSessionClick}
                onNewSession={onNewSession}
                onDeleteSession={onDeleteSession}
                onRenameSession={onRenameSession}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={onLoadMore}
              />
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
