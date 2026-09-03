'use client'

import { Globe, Maximize2, Paperclip, SendHorizonal, Trash2, Zap } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { ConsoleSelect, ConsoleSelectContent, ConsoleSelectItem, ConsoleSelectTrigger, ConsoleSelectValue } from '@/components/token-hub/select'

/**
 * Agent Chat 输入栏 —— 模型选择 + 附件 + 联网搜索(固定开启)+ MCP + 思考 + 清除 + 发送
 */
export function ChatInputBar({
  value,
  onChange,
  onSend,
  model,
  onModelChange,
  modelOptions,
  thinking,
  onThinkingChange,
  inputRef,
}: {
  value: string
  onChange: (v: string) => void
  onSend: (v: string) => void
  model: string
  onModelChange: (v: string) => void
  modelOptions: string[]
  thinking: boolean
  onThinkingChange: (v: boolean) => void
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}) {
  const { t } = useT('token-hub')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend(value)
    }
  }

  return (
    <div className="shrink-0 border-t border-[#dce5f6] bg-white/80 px-4 pt-3 pb-2 backdrop-blur sm:px-5">
      {/* 输入框 */}
      <div className="rounded-2xl border border-[#dce5f6] bg-white shadow-[0_2px_12px_rgb(15_38_79/0.04)] transition-colors focus-within:border-[#4269ee]">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('Chat Input Placeholder')}
          rows={2}
          className="scrollbar-hidden min-h-14 w-full resize-none bg-transparent px-4 py-3 text-[13px] leading-6 text-[#0f1c3a] outline-none placeholder:text-[#8a9bc0]"
        />

        {/* 工具行 */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[#dce5f6]/60 px-3 py-2">
          {/* 模型选择 */}
          <ConsoleSelect
            value={model}
            onValueChange={onModelChange}
          >
            <ConsoleSelectTrigger
              size="sm"
              aria-label={t('Chat Model Select')}
            >
              <ConsoleSelectValue />
            </ConsoleSelectTrigger>
            <ConsoleSelectContent>
              {modelOptions.map((m) => (
                <ConsoleSelectItem
                  key={m}
                  value={m}
                >
                  {m}
                </ConsoleSelectItem>
              ))}
            </ConsoleSelectContent>
          </ConsoleSelect>

          {/* 附件 */}
          <button
            type="button"
            title={t('Chat Attachment')}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#8a9bc0] transition hover:bg-[#eef3ff] hover:text-[#294fd4]"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          {/* 联网搜索(固定开启) */}
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 text-[11px] font-semibold text-emerald-600">
            <Globe className="h-3.5 w-3.5" />
            {t('Chat Web Search')}
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-bold">{t('Chat Always On')}</span>
          </span>

          {/* MCP 计数 */}
          <span className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#eef3ff] px-2.5 text-[11px] font-semibold text-[#3867ff]">
            <Zap className="h-3.5 w-3.5" />
            MCP <span className="tabular-nums">1</span>
          </span>

          {/* 思考 */}
          <button
            type="button"
            onClick={() => onThinkingChange(!thinking)}
            aria-pressed={thinking}
            title={t('Chat Thinking')}
            className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition ${
              thinking ? 'bg-[#edf1ff] text-[#3867ff]' : 'text-[#8a9bc0] hover:bg-[#eef3ff]'
            }`}
          >
            {t('Chat Thinking')}: {t('Chat Thinking Auto')}
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            {/* 清除上下文 */}
            <button
              type="button"
              title={t('Chat Clear Context')}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-[#8a9bc0] transition hover:bg-[#eef3ff] hover:text-[#294fd4]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('Chat Clear Context')}</span>
            </button>

            {/* 放大 */}
            <button
              type="button"
              title={t('Chat Zoom')}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#8a9bc0] transition hover:bg-[#eef3ff] hover:text-[#294fd4]"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>

            {/* 发送 */}
            <button
              type="button"
              onClick={() => onSend(value)}
              disabled={!value.trim()}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-[#294fd4] px-3 text-xs font-semibold text-white shadow-[0_3px_8px_rgb(49_88_232/0.2)] transition hover:bg-[#4269ee] disabled:pointer-events-none disabled:opacity-50"
            >
              <SendHorizonal className="h-3.5 w-3.5" />
              {t('Chat Send')}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-[#aab8d4]">
        {t('Chat Enter Hint')} · {t('Chat Shift Enter Hint')}
      </p>
    </div>
  )
}
