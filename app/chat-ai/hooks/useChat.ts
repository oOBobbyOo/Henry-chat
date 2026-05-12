/**
 * 聊天消息管理 Hook
 *
 * 功能说明：
 * - 管理消息列表和发送
 * - 处理 SSE 流式接收
 * - 管理会话状态
 */

import { useCallback, useRef, useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { parseStream } from '@/lib/sse'
import { ChatService } from '@/services/chat'

/** 生成临时消息 ID */
export function generateMessageId() {
  return uuidv4()
}

export interface UseChatResult {
  /** 消息列表 */
  messages: Chat.Message[]
  /** 当前状态 */
  status: Chat.Status
  /** 错误信息 */
  error: string | null
  /** 会话 ID（发送首条消息后获得） */
  conversationId: string | null
  /** 发送消息 */
  sendMessage: (content: string, config: Chat.ModelConfig, options?: { onSuccess?: () => void; onError?: (err: unknown) => void }) => Promise<void>
  /** 停止生成 */
  stopGenerating: () => void
  /** 清空消息 */
  clearMessages: () => void
  /** 加载会话历史 */
  loadConversation: (id: string, options?: { cursor?: string; limit?: number }) => Promise<boolean>
}

export function useChat() {
  const [messages, setMessages] = useState<Chat.Message[]>([])
  const [status, setStatus] = useState<Chat.Status>('idle')
  const [error, setError] = useState<string | null>(null)

  // 只有从后端成功获取或响应头返回的 ID 才是有效的 conversationId
  // 不要直接使用 URL 中的 ID，因为可能是前端生成的临时 ID
  const [conversationId, setConversationId] = useState<string | null>(null)

  // 用于取消 SSE 连接
  const cancelFnRef = useRef<(() => void) | null>(null)

  /** 设置当前的会话信息 */
  const setCurrentMessages = useCallback((id: string, msg: any) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...msg } : m)))
  }, [])

  /** 加载会话历史 */
  const loadConversation = useCallback(async (id: string): Promise<boolean> => {
    setStatus('loading')
    setError(null)

    console.log('[ chatId ] >>:', id)

    // setStatus('idle')

    return true
  }, [])

  /** 发送消息 */
  const sendMessage = useCallback(
    async (content: string, config: Chat.ModelConfig) => {
      if (!content.trim() || status === 'streaming') return

      // 添加用户消息
      const userMessage: Chat.Message = {
        id: generateMessageId(),
        role: 'user',
        content: content.trim(),
        createdAt: new Date(),
      }

      // 添加 AI 占位消息
      const assistantMessage: Chat.Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        isStreaming: true,
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setStatus('streaming')
      setError(null)

      // 构建请求参数
      const params = {
        model: 'deepseek-v4-flash',
        messages: [
          ...(config.systemPrompt ? [{ role: 'system' as const, content: config.systemPrompt.trim() }] : []),
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user' as const, content: content.trim() },
        ],
        stream: true,
      }

      try {
        const response = await ChatService.chatCompletions(params)

        await parseStream(response, {
          onReasoning: (delta, fullReasoning) => {
            setCurrentMessages(assistantMessage.id, { reasoningContent: fullReasoning })
            console.log('🔍 思考:', { delta, text: fullReasoning })
          },
          onContent: (delta, fullConetnt) => {
            setCurrentMessages(assistantMessage.id, { content: fullConetnt })
            console.log('🤖 回复:', { delta, text: fullConetnt })
          },
          onDone: (state) => {
            setStatus('idle')
            setCurrentMessages(assistantMessage.id, { isStreaming: false })
            console.log('✅ 完成:', state)
          },
          onError: (err) => {
            setStatus('error')
            setCurrentMessages(assistantMessage.id, { isStreaming: false })
            console.error('❌ 错误:', err)
          },
        })
      } catch (error) {
        console.warn('获取聊天流失败:', error)
      }
    },
    [status, messages, setCurrentMessages],
  )

  /** 停止生成 */
  const stopGenerating = useCallback(() => {
    if (cancelFnRef.current) {
      cancelFnRef.current()
      cancelFnRef.current = null
    }

    setStatus('idle')
    setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false, content: m.content || '已终止' } : m)))
  }, [])

  /** 清空消息 */
  const clearMessages = useCallback(() => {
    setMessages([])
    setConversationId(null)
    setError(null)
    setStatus('idle')
  }, [])

  return {
    messages,
    status,
    error,
    conversationId,
    sendMessage,
    stopGenerating,
    clearMessages,
    loadConversation,
  }
}
