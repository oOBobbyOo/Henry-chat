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

  /** 默认的 OpenAI 格式流式响应解析器 */
  const parseOpenAIStreamLine = <T>(line: string): T | null => {
    // 处理 data: 开头的行
    if (line.startsWith('data: ')) {
      const jsonStr = line.slice(6).trim()
      if (jsonStr === '[DONE]') {
        return null
      }
      try {
        const parsed = JSON.parse(jsonStr)

        return parsed as T
      } catch {
        // 忽略解析错误
        return null
      }
    } else if (!line.startsWith('event:') && !line.startsWith('id:') && !line.startsWith('retry:')) {
      // 尝试直接解析非 SSE 格式的 JSON（兼容性处理）
      try {
        const parsed = JSON.parse(line)
        return parsed as T
      } catch {
        // 忽略解析错误
        return null
      }
    }
    return null
  }

  /** 加载会话历 */
  const loadConversation = useCallback(async (id: string): Promise<boolean> => {
    setStatus('loading')
    setError(null)

    console.log('[ chatId ] >>:', id)

    // setStatus('idle')

    return true
  }, [])

  /** 发送消息 */
  const sendMessage = useCallback(
    async (
      content: string,
      config: Chat.ModelConfig,
      options?: {
        onSuccess?: () => void
        onError?: (err: unknown) => void
      },
    ) => {
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

      console.log('[ config ] >>:', config)

      try {
        const response = await ChatService.chatCompletions(params)

        // 读取流式响应
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        let full_content = ''
        let full_reasoning_content = ''

        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read()

              if (done) {
                break
              }

              buffer += decoder.decode(value, { stream: true })
              const lines = buffer.split('\n')
              buffer = lines.pop() || '' // 保留不完整的最后一行

              for (const line of lines) {
                if (line.trim() === '') continue

                let chunk: any | null = null

                chunk = parseOpenAIStreamLine(line)

                if (chunk) {
                  full_content += chunk.choices?.[0]?.delta?.content || ''
                  full_reasoning_content += chunk.choices?.[0]?.delta?.reasoning_content || ''
                  const finish_reason = chunk.choices?.[0]?.finish_reason

                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? {
                            ...m,
                            content: m.content + full_content,
                            reasoningContent: (m.reasoningContent || '') + full_reasoning_content,
                            isStreaming: m.isStreaming, // 保留流式状态
                          }
                        : m,
                    ),
                  )

                  if (finish_reason) {
                    setStatus('idle')
                    setMessages((prev) => prev.map((m) => (m.id === assistantMessage.id ? { ...m, isStreaming: false } : m)))
                  }
                }
              }
            }
          } catch (err) {
            console.warn('解析聊天流失败:', err)
          } finally {
            // 释放读取锁
            reader?.releaseLock()
          }
        }

        processStream()

        console.log('[ full_content ] >>:', full_content)
        console.log('[ full_reasoning_content ] >>:', full_reasoning_content)
      } catch (error) {
        console.warn('获取聊天流失败:', error)
      }
    },
    [messages, status],
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
