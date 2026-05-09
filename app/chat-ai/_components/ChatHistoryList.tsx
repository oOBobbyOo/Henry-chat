'use client'

import { useEffect, useRef, useState } from 'react'

import { Check, MessageSquare, Pencil, Plus, Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/time'
import { cn } from '@/lib/utils'

interface ChatHistoryListProps {
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
}

export function ChatHistoryList({
  sessions,
  activeSessionId,
  onSessionClick,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: ChatHistoryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // 监听滚动到底部
  const observerTarget = useRef<HTMLDivElement>(null)

  // 监听加载更多
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.1 },
    )

    // 在 effect 内部复制 ref 的当前值到局部变量
    const currentObserverTarget = observerTarget.current

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget)
    }

    // 清理函数使用复制的局部变量
    return () => {
      // 先取消对特定元素的观察
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget)
      }
      // 完全断开 observer
      observer.disconnect()
    }
  }, [onLoadMore, hasMore, isLoadingMore])

  const handleKeyDown = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (editValue.trim() && onRenameSession) {
        onRenameSession(sessionId, editValue.trim())
      }

      setEditingId(null)
      setEditValue('')
    } else if (e.key === 'Escape') {
      setEditingId(null)
      setEditValue('')
    }
  }

  const handleStartEdit = (e: React.MouseEvent, session: Chat.Session) => {
    e.stopPropagation()
    setEditingId(session.id)
    setEditValue(session.title)
  }

  const handleConfirmRename = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()

    if (editValue.trim() && onRenameSession) {
      onRenameSession(sessionId, editValue.trim())
    }

    setEditingId(null)
    setEditValue('')
  }

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(null)
    setEditValue('')
  }

  return (
    <div className="flex h-full flex-col">
      {/* --- 新建会话按钮 --- */}
      <div className="border-b border-gray-100 p-3">
        <Button
          onClick={onNewSession}
          className="w-full bg-blue-500 text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-600 active:scale-95"
          size="sm"
        >
          <Plus className="mr-1 h-4 w-4" />
          新建会话
        </Button>
      </div>
      {/* --- 会话列表 - 默认隐藏滚动条，悬停时显示 --- */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'transparent transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.scrollbarColor = '#d1d5db transparent'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.scrollbarColor = 'transparent transparent'
        }}
      >
        <div className="mt-2 mb-2 pl-2 text-xs text-gray-400">最近会话({sessions.length})</div>
        {sessions.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-gray-400">
            <MessageSquare className="mb-2 h-8 w-8" />
            <p className="text-center text-xs">暂无会话记录</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => editingId !== session.id && onSessionClick(session.id)}
                className={cn(
                  'group relative cursor-pointer rounded-lg p-2 transition-colors',
                  activeSessionId === session.id ? 'border border-blue-200 bg-blue-50' : 'border border-transparent hover:bg-gray-50',
                )}
              >
                {/* 会话信息 */}
                <div className="pr-14">
                  {editingId === session.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, session.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 rounded border border-blue-300 px-1 py-0.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleConfirmRename(e, session.id)}
                        className="rounded p-0.5 hover:bg-green-50"
                      >
                        <Check className="h-3 w-3 text-green-600" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="rounded p-0.5 hover:bg-gray-100"
                      >
                        <X className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4 className={cn('truncate text-xs font-medium', activeSessionId === session.id ? 'text-blue-600' : 'text-gray-700')}>{session.title}</h4>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{formatTime(session.lastMessageAt)}</span>
                        <span className="text-[10px] text-gray-400">{session.messageCount} 条消息</span>
                      </div>
                    </>
                  )}
                </div>

                {/* 操作按钮 */}
                {editingId !== session.id && (
                  <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {/* 编辑按钮 */}
                    <button
                      onClick={(e) => handleStartEdit(e, session)}
                      className="rounded p-1 hover:bg-blue-50"
                    >
                      <Pencil className="h-3 w-3 text-blue-500" />
                    </button>
                    {/* 删除按钮 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteSession(session.id)
                      }}
                      className="rounded p-1 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* 滚动加载触发点 */}
            {hasMore && (
              <div
                ref={observerTarget}
                className="flex h-4 w-full items-center justify-center py-4"
              >
                {isLoadingMore && (
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                    正在加载...
                  </div>
                )}
              </div>
            )}

            {!hasMore && sessions.length > 0 && <div className="py-4 text-center text-[10px] text-gray-300">已显示全部会话</div>}
          </div>
        )}
      </div>
    </div>
  )
}
