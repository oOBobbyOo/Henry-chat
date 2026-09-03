'use client'

import { Bot, Brain, User } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { formatTime } from '@/lib/time'

/** 单条消息气泡 */
function MessageBubble({ message }: { message: TokenHub.ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* 头像 */}
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${isUser ? 'bg-[#edf1ff] text-[#3867ff]' : 'bg-[#10234f] text-white'}`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </span>

      {/* 内容 */}
      <div className={`flex max-w-[85%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[13px] leading-6 whitespace-pre-wrap ${
            isUser ? 'rounded-tr-md bg-[#294fd4] text-white' : 'rounded-tl-md border border-[#dce5f6] bg-white text-[#1f2d4d]'
          }`}
        >
          {message.content}
        </div>
        <span className="px-1 text-[10px] text-[#8a9bc0]">{formatTime(new Date(message.created_at))}</span>
      </div>
    </div>
  )
}

/** 推理内容(思考模式) */
function ReasoningBlock({ content }: { content: string }) {
  const { t } = useT('token-hub')
  return (
    <details className="group w-full max-w-[85%] rounded-xl border border-[#dce5f6]/80 bg-[#f7f9fd]/70 px-4 py-2.5">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-semibold text-[#8a9bc0] [&::-webkit-details-marker]:hidden">
        <Brain className="h-3.5 w-3.5 text-[#4269ee]" />
        {t('Chat Thinking')} <span className="text-[10px] text-[#aab8d4]">{t('Chat Thinking Auto')}</span>
      </summary>
      <p className="mt-2 text-[12px] leading-5 whitespace-pre-wrap text-[#5b6b8c]">{content}</p>
    </details>
  )
}

/**
 * Agent Chat 消息流 —— 用户/助手气泡 + 推理折叠块
 */
export function ChatMessageList({ messages }: { messages: TokenHub.ChatMessage[] }) {
  return (
    <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="flex flex-col gap-2"
        >
          {msg.role === 'assistant' && msg.reasoning_content && <ReasoningBlock content={msg.reasoning_content} />}
          <MessageBubble message={msg} />
        </div>
      ))}
    </div>
  )
}
