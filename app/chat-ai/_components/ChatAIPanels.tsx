'use client'

import { useRef } from 'react'

import { Brain, Globe, LogOut, Send, Settings, Square, User, UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { QUICK_QUESTIONS } from '../constants'
import { ChatMessageBubble } from './ChatMessageBubble'
import { ModelConfigModal } from './ModelConfigModal'

interface ChatPanelProps {
  /** 模型配置信息 */
  config: Chat.ModelConfig
  /** 输入框内容 */
  inputValue: string
  /** 输入框变更回调 */
  onInputChange: (value: string) => void
  /** 发送消息回调 */
  onSend: () => void
  /** 是否显示边框（对比模式下使用） */
  showBorder?: boolean
  /** 聊天消息列表 */
  messages?: Chat.Message[]
  /** 当前状态 */
  status?: Chat.Status
  /** 停止生成回调 */
  onStopGenerating?: () => void
  /** 配置变更回调 */
  onConfigChange?: (config: Chat.ModelConfig) => void
  /** 是否处于对比模式 */
  isCompareMode?: boolean
  /** 添加对比模型回调 */
  onAddCompareModel?: () => void
  /** 取消模型对比回调 */
  onCancelCompare?: () => void
}
export function ChatAIPanels({
  config,
  inputValue,
  onInputChange,
  onSend,
  showBorder = false,
  messages = [],
  status = 'idle',
  onStopGenerating,
  onConfigChange,
  isCompareMode = false,
  onAddCompareModel,
  onCancelCompare,
}: ChatPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 处理键盘事件（Enter 发送）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 如果正在输入法输入中，不触发发送
    if (e.nativeEvent.isComposing) {
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      if (status !== 'streaming') {
        onSend()
      }
    }
  }

  // 是否禁用发送 (仅在空闲且输入为空时禁用)
  const isSendDisabled = status === 'idle' && !inputValue.trim()

  // 是否显示快捷问题（仅在消息为空时显示）
  const showQuickQuestions = messages.length === 0

  // 从 config 中读取网页搜索和深度思考状态
  const enableWebSearch = config.enableWebSearch || false
  const enableDeepThinking = config.enableThinking || false

  // 切换网页搜索
  const toggleWebSearch = () => {
    onConfigChange?.({ ...config, enableWebSearch: !enableWebSearch })
  }

  // 切换深度思考
  const toggleDeepThinking = () => {
    onConfigChange?.({ ...config, enableThinking: !enableDeepThinking })
  }

  return (
    <div className={cn('flex min-w-0 flex-1 flex-col bg-linear-to-br from-gray-50 to-blue-50/30', showBorder ? 'rounded-xl border border-gray-100' : '')}>
      {/* --- 模型标题栏 --- */}
      <header className="sticky top-0 z-10 hidden items-center justify-between border-b border-gray-100 bg-white px-4 py-2 shadow-sm lg:flex">
        <ModelConfigModal
          config={config}
          onConfigChange={onConfigChange || (() => {})}
          isCompareMode={isCompareMode}
          onAddCompareModel={onAddCompareModel}
          onCancelCompare={onCancelCompare}
          triggerClassName="text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-md transition-colors cursor-pointer"
          title="模型配置"
        ></ModelConfigModal>

        {
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group rounded-full p-1 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                <Avatar className="h-8 w-8 shadow-sm ring-2 ring-white transition-all group-hover:ring-blue-50">
                  <AvatarImage
                    src={''}
                    alt={'User'}
                  />
                  <AvatarFallback className="bg-blue-500 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56"
            >
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>个人中心</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>账户设置</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </header>

      {/* --- 消息区域 --- */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <p className="text-sm">开始新的对话吧 ✨</p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                isGenerating={status === 'streaming'}
              />
            ))}
          </div>
        )}
      </div>

      {/* ----- 底部操作区域 ----- */}
      <div className="w-full p-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {/* 快捷问题按钮组（仅在消息为空时显示） */}
          {showQuickQuestions && (
            <div className="flex flex-wrap items-center gap-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question.id}
                  onClick={() => {
                    onInputChange(question.text)
                    textareaRef.current?.focus()
                  }}
                  className={cn('cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600', 'transition-colors hover:border-blue-200 hover:bg-gray-50')}
                >
                  {question.text}
                </button>
              ))}
            </div>
          )}

          {/* 输入框区域 */}
          <div className="relative rounded-xl border border-gray-200 bg-white transition-all duration-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={status === 'streaming' ? 'AI 正在回复中...' : '请输入提示词...'}
              disabled={status === 'streaming'}
              className={cn('min-h-[60px] w-full resize-none px-4 py-3 pb-14 text-sm text-gray-800 outline-none', status === 'streaming' && 'cursor-not-allowed opacity-60')}
            />
            <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleWebSearch}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs transition-all duration-200',
                    enableWebSearch ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600',
                  )}
                  disabled={status === 'streaming'}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>网页搜索</span>
                </button>
                <button
                  type="button"
                  onClick={toggleDeepThinking}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs transition-all duration-200',
                    enableDeepThinking ? 'border-purple-200 bg-purple-50 text-purple-600' : 'border-gray-200 bg-white text-gray-500 hover:border-purple-200 hover:text-purple-600',
                  )}
                  disabled={status === 'streaming'}
                >
                  <Brain className="h-3.5 w-3.5" />
                  <span>深度思考</span>
                </button>
              </div>
              <button
                type="button"
                onClick={status === 'streaming' ? onStopGenerating : onSend}
                disabled={isSendDisabled}
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-all duration-200',
                  status === 'streaming'
                    ? 'border border-red-100 bg-red-50 text-red-500 shadow-red-100/50 hover:bg-red-100 active:scale-90'
                    : isSendDisabled
                      ? 'cursor-not-allowed border border-gray-100 bg-gray-100 text-gray-400'
                      : 'bg-blue-500 text-white shadow-lg shadow-blue-200/50 hover:bg-blue-600 active:scale-95',
                )}
                aria-label={status === 'streaming' ? '停止生成' : '发送'}
                title={status === 'streaming' ? '停止生成' : '发送'}
              >
                {status === 'streaming' ? <Square className="h-4 w-4 fill-current" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
