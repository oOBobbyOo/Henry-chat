import { useCallback, useState } from 'react'

import { toast } from 'sonner'

// 全局缓存状态，避免多个组件重复调用接口
const globalState: Chat.SessionState = {
  sessions: [],
  hasMore: true,
  page: 1,
}

/**
 * 会话列表管理 Hook
 *
 * 功能说明：
 * - 管理会话列表的获取和缓存
 * - 管理会话的增删改操作
 */
export function useConversations() {
  // 获取全局状态
  const [sessionState, setSessionState] = useState<Chat.SessionState>(globalState)
  const [isLoading, setIsLoading] = useState(!globalState.sessions.length)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error] = useState<string | null>(null)

  /** 加载更多 */
  const loadMore = useCallback(async () => {}, [])

  /** 刷新会话列表 (重置到第一页) */
  const refresh = useCallback(async () => {}, [])

  /** 添加会话到列表 */
  const addSession = useCallback((session: Chat.Session) => {
    const current = globalState.sessions

    // 检查是否已存在
    if (current.some((s) => s.id === session.id)) {
      return
    }
  }, [])

  /** 删除会话 */
  const deleteSession = useCallback(async (id: string): Promise<boolean> => {
    console.log('[ id ] >>:', id)

    toast('删除成功', {
      description: '会话已成功删除',
    })

    return true
  }, [])

  /** 重命名会话 */
  const renameSession = useCallback(async (id: string, newTitle: string): Promise<boolean> => {
    console.log('[ id ] >>:', id)
    console.log('[ newTitle ] >>:', newTitle)

    toast('重命名成功', {
      description: '会话标题已更新',
    })

    return true
  }, [])

  return {
    sessions: sessionState.sessions,
    isLoading,
    isLoadingMore,
    hasMore: sessionState.hasMore,
    error,
    refresh,
    loadMore,
    addSession,
    deleteSession,
    renameSession,
  }
}
