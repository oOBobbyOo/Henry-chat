'use client'

import { useState } from 'react'

import Image from 'next/image'

import { Bot, Brain, Check, ChevronDown, ChevronUp, ClipboardCopy, Copy, Download, Link, Loader2, Pencil, Share2, Sparkles, User } from 'lucide-react'

import { ReactMarkdownRenderer } from '@/components/markdown/react-markdown-renderer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ChatMessageBubbleProps {
  message: Chat.Message
  isGenerating?: boolean
}

export function ChatMessageBubble({ message, isGenerating = false }: ChatMessageBubbleProps) {
  const [showReasoning, setShowReasoning] = useState(true) // 默认展开，不自动折叠
  const [copied, setCopied] = useState(false)

  // 是否用户
  const isUser = message.role === 'user'

  // 是否有推理内容
  const hasReasoning = !isUser && message.reasoningContent && message.reasoningContent.length > 0

  return (
    <div className="group">
      <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
        {/* 头像 - 移动端隐藏，桌面端显示 */}
        <div className="hidden shrink-0 md:flex">
          {isUser ? (
            <Avatar className="h-8 w-8 shadow-sm ring-1 ring-gray-100">
              <AvatarImage
                src={''}
                alt={'User'}
              />
              <AvatarFallback className="bg-blue-500 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-indigo-500 text-white shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className={cn('flex flex-col gap-2', isUser ? 'max-w-[85%] md:max-w-[75%]' : 'w-full md:max-w-[75%]')}>
          <div
            className={cn(
              'overflow-hidden rounded-2xl text-sm leading-relaxed',
              isUser ? 'w-fit rounded-tr-sm bg-blue-500 text-white shadow-md' : 'rounded-tl-sm border border-gray-100 bg-white text-gray-800 shadow-sm',
            )}
          >
            {isUser ? (
              // 用户消息直接显示
              <div className="px-4 py-3 whitespace-pre-wrap">{message.content}</div>
            ) : message.imageUrl ? (
              // 图片消息
              <div className="p-3">
                <div className="group/img relative overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={message.imageUrl}
                    alt={message.content || '生成的图片'}
                    className="h-auto max-h-[400px] w-full cursor-pointer object-contain transition-transform hover:scale-[1.02]"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover/img:opacity-100">
                    <button
                      className="rounded-md bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
                      title="复制图片"
                    >
                      <ClipboardCopy className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                    <button
                      className="rounded-md bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
                      title="复制链接"
                    >
                      <Link className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                    <a
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
                      title="下载图片"
                    >
                      <Download className="h-3.5 w-3.5 text-gray-600" />
                    </a>
                  </div>
                  <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/50 to-transparent p-2.5 opacity-0 transition-opacity group-hover/img:opacity-100">
                    <p className="line-clamp-2 text-xs text-white/90">{message.content}</p>
                  </div>
                </div>
                {message.imageSize && (
                  <div className="mt-2 flex items-center gap-1.5 px-1">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                    <span className="text-xs text-gray-400">{message.imageSize}</span>
                  </div>
                )}
              </div>
            ) : message.isStreaming && message.imageSize ? (
              // 图片加载状态
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-200 border-t-purple-500" />
                    <Sparkles className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform animate-pulse text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">AI 正在绘图...</p>
                    <p className="mt-0.5 text-xs text-gray-400">尺寸 {message.imageSize}</p>
                  </div>
                </div>
              </div>
            ) : (
              // AI 消息：包含推理内容和主回复
              <>
                {/* 推理内容（深度思考模式） */}
                {hasReasoning && (
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() => setShowReasoning(!showReasoning)}
                      className="group flex w-full items-center gap-2 px-4 py-3 text-left text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50/80"
                    >
                      <Brain className="h-4 w-4 shrink-0 text-blue-500" />
                      <span className="flex-1">{message.isStreaming && !message.content ? '正在思考...' : '深度思考'}</span>
                      {showReasoning ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
                      )}
                    </button>

                    <div className={cn('grid transition-all duration-300 ease-in-out', showReasoning ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                      <div className="overflow-hidden">
                        <div className="bg-gray-50/50 px-4 pt-2 pb-4">
                          <div
                            className={cn(
                              'prose prose-sm prose-gray max-w-none',
                              'prose-p:my-1.5 prose-p:text-gray-600 prose-p:leading-relaxed',
                              'prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-li:text-gray-600',
                              'prose-pre:my-3 prose-pre:bg-white prose-pre:border prose-pre:border-gray-200 prose-pre:shadow-sm',
                              'prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs',
                              'prose-code:before:content-none prose-code:after:content-none',
                              'prose-headings:text-gray-800 prose-headings:font-semibold prose-strong:text-gray-800',
                              'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline',
                              'text-[13px] leading-relaxed',
                              // 流式光标效果：仅在推理阶段（还没有主回复内容时）显示
                              message.isStreaming &&
                                message.reasoningContent &&
                                !message.content &&
                                'after:ml-1 after:inline-block after:animate-pulse after:align-middle after:text-blue-400 after:content-["▋"]',
                            )}
                          >
                            <ReactMarkdownRenderer content={message.reasoningContent || ''} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 主回复内容 */}
                <div className="px-4 py-3">
                  <div
                    className={cn(
                      'prose prose-sm prose-gray prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-2 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none max-w-none',
                      // 添加打字机光标效果：仅在主回复有内容且正在流式输出时显示
                      message.isStreaming && message.content && 'after:ml-1 after:inline-block after:animate-pulse after:align-middle after:text-blue-500 after:content-["▋"]',
                    )}
                  >
                    {message.content ? (
                      <ReactMarkdownRenderer content={message.content || ''} />
                    ) : message.isStreaming && !message.reasoningContent ? (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        思考中...
                      </span>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 消息操作按钮 */}
      {!message.isStreaming && (
        <div className={cn('mt-1.5 flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100', isUser ? 'justify-end md:pr-11' : 'md:pl-11')}>
          <button
            disabled={isGenerating}
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-all duration-200',
              isGenerating ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer text-gray-400 hover:bg-blue-50 hover:text-blue-600',
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>编辑</span>
          </button>
          <button
            className={cn(
              'flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-all duration-200',
              copied ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600',
            )}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>复制</span>
              </>
            )}
          </button>
          <button className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600">
            <Share2 className="h-3.5 w-3.5" />
            <span>分享</span>
          </button>
        </div>
      )}
    </div>
  )
}
