import { LogOut, Settings, User, UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function UserDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group rounded-full p-0 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none">
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
  )
}
