'use client'

import { RotateCcw, Settings2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import { DEFAULT_MODEL_CONFIG } from '../constants'
import { ConfigFields } from './ConfigFields'

interface ModelConfigModalProps {
  /** 模型配置 */
  config: Chat.ModelConfig
  /** 配置变更回调 */
  onConfigChange: (config: Chat.ModelConfig) => void
  /** 是否处于对比模式 */
  isCompareMode?: boolean
  /** 添加对比模型回调 */
  onAddCompareModel?: () => void
  /** 取消模型对比回调 */
  onCancelCompare?: () => void
  /** 触发器按钮样式类 */
  triggerClassName?: string
  /** 标题图标 */
  icon?: React.ReactNode
  /** 标题文本 */
  title?: string
  /** 自定义触发器内容 */
  children?: React.ReactNode
}

export function ModelConfigModal({
  config,
  onConfigChange,
  isCompareMode = false,
  onAddCompareModel,
  onCancelCompare,
  triggerClassName,
  icon = <Settings2 className="h-4 w-4" />,
  title = '模型配置',
  children,
}: ModelConfigModalProps) {
  const updateConfig: Chat.UpdateConfigFn = (key, value) => {
    onConfigChange({ ...config, [key]: value })
  }

  const handleReset = () => {
    onConfigChange({ ...DEFAULT_MODEL_CONFIG, id: config.id })
  }

  const toggleCompare = () => {
    if (isCompareMode) {
      onCancelCompare?.()
    } else {
      onAddCompareModel?.()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          <span className={triggerClassName}>{children}</span>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={triggerClassName}
            title={title}
          >
            {icon}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden rounded-xl border-none p-0 shadow-2xl sm:max-w-[700px]">
        <DialogHeader className="border-b border-gray-50 bg-white px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 shadow-sm">{icon}</div>
            <DialogTitle className="text-xl font-bold text-gray-800">{title}</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription />

        <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-4">
          <ConfigFields
            config={config}
            updateConfig={updateConfig}
          />

          <style
            jsx
            global
          >{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #e2e8f0;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #3b82f6;
            }
          `}</style>
        </div>

        <DialogFooter className="mb-0 flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="rounded-lg text-gray-500 transition-all hover:bg-blue-50 hover:text-blue-600"
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              重置默认
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCompare}
              className={cn('rounded-lg transition-all', isCompareMode ? 'text-red-500 hover:bg-red-50 hover:text-red-600' : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600')}
            >
              {isCompareMode ? (
                <>
                  <X className="mr-1.5 h-4 w-4" />
                  取消对比
                </>
              ) : (
                <>
                  <Settings2 className="mr-1.5 h-4 w-4" />
                  开启对比
                </>
              )}
            </Button>
          </div>
          <DialogTrigger asChild>
            <Button className="rounded-lg bg-blue-500 px-8 text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-600 active:scale-95">确定</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
