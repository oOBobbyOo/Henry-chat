'use client'

import { useEffect, useRef } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { ChatInterface } from '../_components/ChatInterface'
import { useChat } from '../hooks/useChat'

/**
 * 聊天会话详情页面
 */
export default function ChatRoomPage() {
  const params = useParams()
  const router = useRouter()

  const chatId = params.id as string
  const isNewSession = /^\d{13,}$/.test(chatId)
  const hasInitializedRef = useRef(false)

  const { messages, status, conversationId, sendMessage, stopGenerating, loadConversation } = useChat()

  // 加载会话历史
  useEffect(() => {
    if (!isNewSession) {
      loadConversation(chatId)
    }
  }, [isNewSession, chatId, loadConversation])

  /** 初始化输入逻辑 */
  const handleInitInput = () => {
    if (hasInitializedRef.current) return
  }

  /** 发送消息 */
  const handleSend = (_modelId: string, value: string, config: Chat.ModelConfig) => {
    sendMessage(value, config)
  }

  /** 删除会话后的跳转 */
  const handleAfterDeleteSession = (deletedId: string) => {
    if (chatId === deletedId || conversationId === deletedId) {
      router.push('/chat-ai')
    }
  }

  return (
    <ChatInterface
      activeSessionId={conversationId || chatId}
      messages={messages}
      status={status}
      conversationId={conversationId}
      onSend={handleSend}
      onNewSession={() => router.push('/chat-ai')}
      onStopGenerating={stopGenerating}
      onAfterDeleteSession={handleAfterDeleteSession}
      onInitInput={handleInitInput}
    />
  )
}
