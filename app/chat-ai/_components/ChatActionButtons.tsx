'use client'

import { useState } from 'react'

import { Check, Copy, RefreshCw, Share2, SquarePen, ThumbsDown, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ChatActionButtonsProps {
  onRegenerate?: () => void
  onCopy?: (text: string) => void
  content?: string // 用于复制 & 分享
  onLike?: () => void
  onDislike?: () => void
  liked?: boolean
  disliked?: boolean
  onShare?: (content: string) => void
  disabled?: boolean
  onEdit?: () => void
  isUser?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function ChatActionButtons({
  onRegenerate,
  onCopy,
  content = '',
  onLike,
  onDislike,
  liked = false,
  disliked = false,
  onShare,
  disabled = false,
  onEdit,
  isUser = false,
  side = 'bottom',
}: ChatActionButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (onCopy) {
      onCopy(content)
    } else {
      navigator.clipboard.writeText(content)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (onShare) {
      onShare(content)
    } else {
      // 默认使用 Web Share API（若环境支持）
      if (navigator.share) {
        navigator
          .share({
            title: 'AI 回复',
            text: content,
          })
          .catch(() => {})
      } else {
        // 降级：复制并提示
        navigator.clipboard.writeText(content)
        toast('已复制内容，可手动分享')
      }
    }
  }

  const handleEdit = () => {
    onEdit?.()
  }

  return (
    <TooltipProvider delayDuration={300}>
      {/* 复制 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-all duration-200',
              copied ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600',
            )}
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">复制内容</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>{copied ? '已复制' : '复制'}</TooltipContent>
      </Tooltip>

      {/* 重新生成 */}
      {!isUser && onRegenerate && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
              onClick={onRegenerate}
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              <span className="sr-only">重新生成</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>重新生成</TooltipContent>
        </Tooltip>
      )}

      {/* 点赞 */}
      {!isUser && onLike && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-all duration-200',
                liked ? 'bg-green-50 text-blue-600' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600',
              )}
              onClick={onLike}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="sr-only">赞</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>喜欢</TooltipContent>
        </Tooltip>
      )}

      {/* 踩 */}
      {!isUser && onDislike && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-all duration-200',
                disliked ? 'bg-green-50 text-red-600' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600',
              )}
              onClick={onDislike}
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="sr-only">踩</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>不喜欢</TooltipContent>
        </Tooltip>
      )}

      {/* 分享 */}
      {!isUser && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">分享</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>分享</TooltipContent>
        </Tooltip>
      )}

      {/* 编辑 */}
      {isUser && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-all duration-200',
                disabled ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer text-gray-400 hover:bg-blue-50 hover:text-blue-600',
              )}
              disabled={disabled}
              onClick={handleEdit}
            >
              <SquarePen className="h-4 w-4" />
              <span className="sr-only">编辑</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>编辑</TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  )
}
