'use client'

import { useState } from 'react'

import { LogOut, Menu, Plus, Settings, User, UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { INITIAL_PRIMARY_MODEL } from '../constants'
import { useChatModels } from '../hooks/useChatModels'
import { ChatAIPanels } from './ChatAIPanels'
import { ChatSidebar } from './ChatSidebar'

export function ChatInterface() {
  // 获取动态模型列表
  const { models, isLoading: isModelsLoading } = useChatModels()

  // 模型配置列表：第一个是主模型，后续是对比模型
  const [modelConfigs, setModelConfigs] = useState<Chat.ModelConfig[]>([INITIAL_PRIMARY_MODEL])

  // 主模型配置
  const primaryConfig = modelConfigs[0]

  // 输入框内容：以模型 id 为 key
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  // 移动端侧边栏状态
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* --- 顶栏 --- */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-base font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="新建会话"
          >
            <Plus className="h-5 w-5" />
          </button>
          {
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-0 rounded-full transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                  <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm group-hover:ring-blue-50 transition-all">
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
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative">
        {/* --- 左侧侧边栏 --- */}
        <ChatSidebar isMobileOpen={isMobileSidebarOpen} />
        {/* --- 右侧聊天区 --- */}
        <div className="flex flex-1">
          <ChatAIPanels config={primaryConfig} />
        </div>
      </div>
    </div>
  )
}
