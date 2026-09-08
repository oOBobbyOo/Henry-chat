'use client'

import { useMemo, useRef, useState } from 'react'

import { Bot, Menu, Plus } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { CHAT_DIRECTIONS, buildMockReply } from '@/mock/token-hub-chat'
import { useChatConversationsQuery, useModelsQuery } from '@/services/token-hub'

import { ChatInputBar } from './_components/chat-input-bar'
import { ChatMessageList } from './_components/chat-message-list'
import { ChatWelcome } from './_components/chat-welcome'

/** 会话视图: null = 新对话(空工作区) */
type ActiveConversation = TokenHub.ChatConversation | null

/** 侧边栏宽度(对齐生产 var(--chat-sidebar-width)) */
const SIDEBAR_WIDTH = 212

/**
 * Token Hub 控制台 —— Agent Chat
 * 全屏 chat-shell: 左侧会话栏(标题 + 新建 + 分组会话)+ 右侧工作区(头部 + 欢迎/消息 + 输入栏)
 * 布局对齐生产: 侧边栏 212px,主区 flex-1 纵向
 */
export default function ChatPage() {
  const { t } = useT('token-hub')

  const { data: conversationsData } = useChatConversationsQuery()
  const { data: modelsData } = useModelsQuery()

  // 当前会话(默认新对话)
  const [active, setActive] = useState<ActiveConversation>(null)
  // 当前会话内的消息
  const [messages, setMessages] = useState<TokenHub.ChatMessage[]>([])
  // 当前输入
  const [input, setInput] = useState('')
  // 是否思考(自动)
  const [thinking, setThinking] = useState(true)
  // 输入栏是否聚焦(回车发送提示)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 模型选项(模型广场的展示名)
  const modelOptions = useMemo(() => modelsData.items.map((m) => m.display_name), [modelsData.items])
  const [model, setModel] = useState<string>(modelOptions[0] ?? 'Gemini 3.7 Flash')

  /** 按时间分组会话(本周 / 更早) */
  const groups = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay()) // 周日为一周起点
    const week: TokenHub.ChatConversation[] = []
    const earlier: TokenHub.ChatConversation[] = []
    for (const conv of conversationsData.items) {
      if (new Date(conv.last_message_at) >= weekStart) week.push(conv)
      else earlier.push(conv)
    }
    return [
      { label: t('Chat Group This Week'), count: week.length, items: week },
      { label: t('Chat Group Earlier'), count: earlier.length, items: earlier },
    ].filter((g) => g.items.length > 0)
  }, [conversationsData.items, t])

  /** 打开某条会话 */
  const openConversation = (conv: TokenHub.ChatConversation) => {
    setActive(conv)
    setMessages(conv.messages)
    setModel(conv.model)
  }

  /** 新建对话 */
  const newConversation = () => {
    setActive(null)
    setMessages([])
    setInput('')
    inputRef.current?.focus()
  }

  /** 选择方向建议(填入输入框) */
  const pickDirection = (title: string) => {
    setInput(title)
    inputRef.current?.focus()
  }

  /** 发送 */
  const handleSend = (value: string) => {
    if (!value.trim()) return
    const userMsg: TokenHub.ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: value.trim(),
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    // 模拟 Agent 回复(演示环境)
    setTimeout(() => {
      const reply = buildMockReply(value, model)
      setMessages((prev) => [...prev, reply])
    }, 900)
  }

  return (
    <main className="flex h-[calc(100dvh-68px)] min-h-0 w-full">
      {/* chat-shell 全屏工作区 */}
      <div className="chat-shell flex h-full min-h-0 w-full overflow-hidden bg-(--tc-surface-raised)">
        {/* ---- 左侧会话栏 ---- */}
        <aside
          className="flex h-full shrink-0 flex-col border-r border-(--tc-border) bg-(--tc-surface)"
          style={{ width: SIDEBAR_WIDTH }}
        >
          {/* 侧边栏头部 */}
          <div className="flex h-18 shrink-0 items-center justify-between border-b border-(--tc-border) px-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--tc-blue-soft) text-(--tc-blue-bright)">
                <Bot className="h-4 w-4" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[14px] font-semibold text-(--tc-strong)">{t('Chat Title')}</p>
                <p className="mt-0.5 truncate text-[11px] text-(--tc-muted)">{t('Chat Subtitle')}</p>
              </div>
            </div>
            <button
              type="button"
              className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-(--tc-muted) transition hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* 新建对话 */}
          <div className="shrink-0 p-3">
            <button
              type="button"
              onClick={newConversation}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--tc-primary) text-sm font-semibold text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition hover:bg-(--tc-primary-hover)"
            >
              <Plus className="h-4 w-4" />
              {t('Chat New Conversation')}
              <kbd className="ml-1 hidden rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-medium sm:block">⌘ K</kbd>
            </button>
          </div>

          {/* 最近对话 */}
          <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto px-3 pb-4">
            <div className="flex items-center justify-between px-1 pt-1 pb-2">
              <p className="text-[11px] font-bold tracking-[0.08em] text-(--tc-muted) uppercase">{t('Chat Recent')}</p>
              <span className="rounded-full bg-(--tc-blue-soft) px-1.5 py-0.5 text-[10px] font-bold text-(--tc-muted) tabular-nums">{conversationsData.items.length}</span>
            </div>

            {conversationsData.items.length === 0 && <p className="px-1 py-6 text-center text-xs text-(--tc-muted)">{t('Chat No Conversations')}</p>}

            {groups.map((group) => (
              <div
                key={group.label}
                className="mb-4 last:mb-0"
              >
                <div className="flex items-center justify-between px-1 pb-1">
                  <p className="text-[11px] font-semibold text-(--tc-body)">{group.label}</p>
                  <span className="text-[10px] font-semibold text-(--tc-muted) tabular-nums">{group.count}</span>
                </div>
                <div className="space-y-0.5">
                  {group.items.map((conv) => {
                    const activeConv = active?.id === conv.id
                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => openConversation(conv)}
                        aria-pressed={activeConv}
                        className={`group/row relative block w-full cursor-pointer px-1`}
                      >
                        <span
                          className={`flex min-h-13 w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 transition-colors ${activeConv ? 'bg-(--tc-blue-soft)' : 'hover:bg-(--tc-surface-raised)'}`}
                        >
                          <span
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-bold ${activeConv ? 'bg-(--tc-primary) text-white' : 'bg-(--tc-blue-soft) text-(--tc-blue-bright)'}`}
                          >
                            {conv.model.charAt(0)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-(--tc-strong)">{conv.title}</span>
                            <span className="mt-0.5 block">
                              <span className="inline-block max-w-full truncate rounded bg-(--tc-blue-soft) px-1.5 py-0.5 text-[10px] font-semibold text-(--tc-blue-bright)">{conv.model}</span>
                            </span>
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ---- 右侧工作区 ---- */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* 工作区头部 */}
          <div className="flex h-18 shrink-0 items-center justify-between border-b border-(--tc-border) bg-(--tc-surface)/60 px-5 backdrop-blur">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-(--tc-strong)">
                {t('Chat Token Hub Agent')}
                <span className="mx-1.5 text-[#c9d6ef]">/</span>
                <span className="font-medium text-(--tc-body)">{active ? active.title : t('Chat New Workspace')}</span>
              </p>
              <p className="mt-0.5 truncate text-[11px] text-(--tc-muted)">{model}</p>
            </div>
            <button
              type="button"
              onClick={newConversation}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-(--tc-border) bg-(--tc-surface) px-3 py-1.5 text-xs font-semibold text-(--tc-body) transition hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text)"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('Chat New')}
            </button>
          </div>

          {/* 消息区 */}
          <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <ChatWelcome
                directions={CHAT_DIRECTIONS}
                onPickDirection={pickDirection}
              />
            ) : (
              <ChatMessageList messages={messages} />
            )}
          </div>

          {/* 输入栏 */}
          <ChatInputBar
            value={input}
            onChange={setInput}
            onSend={handleSend}
            model={model}
            onModelChange={setModel}
            modelOptions={modelOptions}
            thinking={thinking}
            onThinkingChange={setThinking}
            inputRef={inputRef}
          />
        </div>
      </div>
    </main>
  )
}
