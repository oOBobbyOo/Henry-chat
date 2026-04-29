import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ChatHistoryList() {
  return (
    <div className="flex flex-col h-full">
      {/* --- 新建会话按钮 --- */}
      <div className="p-3 border-b border-gray-100">
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-blue-100 shadow-md active:scale-95 transition-all"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          新建会话
        </Button>
      </div>
      {/* --- 会话列表 --- */}
    </div>
  )
}
