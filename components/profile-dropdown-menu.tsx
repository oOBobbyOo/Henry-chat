import { ChevronRight, CircleQuestionMark, LayoutDashboard, LogOut, Settings, ShieldCheck, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ProfileDropdownMenu() {
  const isLogin = true

  return (
    <div className="relative h-full">
      {!isLogin ? (
        <>
          <button
            type="button"
            className="inline-flex h-full min-w-0 cursor-pointer items-center gap-2 rounded-r-full pr-3.5 pl-1.5 transition hover:bg-white/4 focus-visible:outline-none"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[12px] text-zinc-200">登录</span>
          </button>
        </>
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-full min-w-0 cursor-pointer items-center gap-2 rounded-r-full pr-3.5 pl-1.5 transition hover:bg-white/4 focus-visible:outline-none"
              >
                <Avatar className="inline-flex h-7 w-7 shrink-0 overflow-hidden rounded-full bg-[#0c1320] ring-1 ring-white/10">
                  <AvatarImage
                    src={''}
                    alt={'User'}
                  />
                  <AvatarFallback className="text-zinc-200">
                    <User className="h-3.5 w-3.5" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-[12px] text-zinc-200">用户名</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[min(248px,calc(100vw-2rem))] rounded-[18px] border-white/10 bg-[linear-gradient(180deg,rgba(10,16,28,0.98),rgba(6,10,20,0.98))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_22px_48px_rgba(2,6,23,0.4)] backdrop-blur-[28px]"
            >
              <DropdownMenuItem className="flex w-full items-center gap-2.5 rounded-[13px] px-2.5 text-left text-[12.5px] font-medium text-rose-200/90 transition hover:bg-rose-400/8 hover:text-rose-100 focus-visible:outline-none">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/6 bg-white/4 text-zinc-400">
                  <Settings className="h-3.5 w-3.5" />
                </span>
                <span>账号管理</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex w-full items-center gap-2.5 rounded-[13px] px-2.5 text-left text-[12.5px] font-medium text-rose-200/90 transition hover:bg-rose-400/8 hover:text-rose-100 focus-visible:outline-none">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/6 bg-white/4 text-zinc-400">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                </span>
                <span>我的团队</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex h-10 w-full items-center gap-2.5 rounded-[13px] px-2.5 text-left text-[12.5px] font-medium text-rose-200/90 transition hover:bg-rose-400/8 hover:text-rose-100 focus-visible:outline-none">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/6 bg-white/4 text-zinc-400">
                  <User className="h-3.5 w-3.5" />
                </span>
                <span>个人中心</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex w-full items-center gap-2.5 rounded-[13px] px-2.5 text-left text-[12.5px] font-medium text-rose-200/90 transition hover:bg-rose-400/8 hover:text-rose-100 focus-visible:outline-none">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/6 bg-white/4 text-zinc-400">
                  <CircleQuestionMark className="h-3.5 w-3.5" />
                </span>
                <span>联系我们</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex w-full items-center gap-2.5 rounded-[13px] px-2.5 text-left text-[12.5px] font-medium text-rose-200/90 transition hover:bg-rose-400/8 hover:text-rose-100 focus-visible:outline-none">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/6 bg-white/4 text-zinc-400">
                  <LogOut className="h-3.5 w-3.5" />
                </span>
                <span>退出账号</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}
