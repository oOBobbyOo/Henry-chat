import { Brain, Globe, LogOut, Send, Settings, Square, UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

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
  return (
    <div className={cn('flex flex-col flex-1 min-w-0 bg-linear-to-br from-gray-50 to-blue-50/30', showBorder ? 'border border-gray-100 rounded-xl' : '')}>
      {/* --- 模型标题栏 --- */}
      <header className="hidden lg:flex px-4 py-2 border-b border-gray-100 bg-white items-center justify-between sticky top-0 z-10 shadow-sm">
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
              <button className="p-1 rounded-full transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm group-hover:ring-blue-50 transition-all">
                  <AvatarImage src={''} />
                  <AvatarFallback className="bg-blue-500 text-white">{'U'}</AvatarFallback>
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
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </header>

      {/* --- 消息区域 --- */}
      <div className="flex-1 overflow-y-auto p-4"></div>

      {/* ----- 底部操作区域 ----- */}
      <div className="p-4 w-full">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* 快捷问题按钮组（仅在消息为空时显示） */}

          {/* 输入框区域 */}
          <div className="relative border border-gray-200 rounded-xl bg-white focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
            <textarea className={cn('w-full min-h-[60px] px-4 py-3 pb-14 text-sm text-gray-800 outline-none resize-none')} />
            <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={cn('flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg border transition-all duration-200')}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>网页搜索</span>
                </button>
                <button
                  type="button"
                  className={cn('flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg border transition-all duration-200')}
                >
                  <Brain className="h-3.5 w-3.5" />
                  <span>深度思考</span>
                </button>
              </div>
              <button
                type="button"
                className={cn('h-9 w-9 inline-flex items-center justify-center rounded-lg shadow-sm transition-all duration-200')}
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
