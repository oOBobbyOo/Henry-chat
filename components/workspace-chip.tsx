'use client'

import { useState } from 'react'

import { Check, ChevronRight, LayoutDashboard, Plus } from 'lucide-react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

/** 工作区选项(下拉列表项) */
export interface WorkspaceOption {
  id: string
  name: string
  /** 我的角色 */
  role: 'admin' | 'creator' | 'readonly'
}

/** 角色显示文案 */
const ROLE_LABELS: Record<WorkspaceOption['role'], string> = {
  admin: '管理员',
  creator: '创作者',
  readonly: '只读',
}

/** 默认工作区列表(mock,可经 props 覆盖) */
const DEFAULT_WORKSPACES: WorkspaceOption[] = [
  { id: 'ws-1', name: 'Bobby Henry的工作区', role: 'admin' },
  { id: 'ws-2', name: 'Henry Studio 团队', role: 'creator' },
  { id: 'ws-3', name: '演示项目空间', role: 'readonly' },
]

interface WorkspaceChipProps {
  /** 当前工作区名称(不传时取当前选中项) */
  name?: string
  /** 当前角色文案(不传时取当前选中项角色) */
  role?: string
  /** 工作区列表(不传用内置 mock) */
  workspaces?: WorkspaceOption[]
  /** 选中工作区回调 */
  onSelect?: (ws: WorkspaceOption) => void
  /** 点击「创建工作区」回调 */
  onCreate?: () => void
}

/**
 * 工作区 chip(SiteHeader 右侧胶囊)
 * 点击弹出工作区切换下拉:工作区列表(当前项打勾)+ 创建工作区入口。
 */
export function WorkspaceChip({ name, role, workspaces = DEFAULT_WORKSPACES, onSelect, onCreate }: WorkspaceChipProps) {
  const [currentId, setCurrentId] = useState(workspaces[0]?.id ?? '')

  const current = workspaces.find((ws) => ws.id === currentId) ?? workspaces[0]
  const displayName = name ?? current?.name ?? 'Workspace'
  const displayRole = role ?? (current ? ROLE_LABELS[current.role] : undefined)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="切换当前工作区"
          className="inline-flex h-9 items-center gap-2.5 rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,251,0.96))] px-3.5 text-[12px] text-[#091423] shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_1px_0_rgba(12,24,36,0.06),0_10px_24px_rgba(8,20,48,0.07)] backdrop-blur-2xl transition hover:border-[rgba(93,175,206,0.35)] hover:bg-[linear-gradient(180deg,rgba(252,254,255,1),rgba(240,247,253,0.98))] dark:border-white/8 dark:bg-none dark:bg-white/4 dark:text-zinc-200 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(0,0,0,0.2),0_10px_24px_rgba(2,6,23,0.35)] dark:hover:border-white/14 dark:hover:bg-white/8"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(12,24,36,0.1)] bg-[linear-gradient(180deg,rgba(250,252,255,0.98),rgba(239,245,251,0.96))] text-[#091423] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_1px_0_rgba(12,24,36,0.05)] dark:border-white/8 dark:bg-none dark:bg-white/6 dark:text-zinc-300 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_1px_0_rgba(0,0,0,0.18)]">
            <LayoutDashboard
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
          </span>
          <span className="flex max-w-[224px] min-w-0 items-center gap-2">
            <span className="truncate text-left text-[12px] text-[#091423] dark:text-[#eef4ff]">
              {displayName}
            </span>
            {displayRole ? (
              <span className="shrink-0 text-[12px] text-[#4e6585] dark:text-[#6b7f9d]">
                · {displayRole}
              </span>
            ) : null}
            <ChevronRight
              className="h-3.5 w-3.5 shrink-0 text-[#4e6585] transition-transform duration-200 dark:text-[#6b7f9d]"
              strokeWidth={1.75}
            />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-56 rounded-[16px] border-gray-200 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(10,16,28,0.98),rgba(6,10,20,0.98))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_22px_48px_rgba(2,6,23,0.4)]"
      >
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => {
              setCurrentId(ws.id)
              onSelect?.(ws)
            }}
            className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[12.5px] font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-200 dark:hover:bg-white/5.5 dark:hover:text-white"
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-500 dark:border-white/6 dark:bg-white/4 dark:text-zinc-400">
              <LayoutDashboard className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1 truncate">{ws.name}</span>
            <span className="shrink-0 text-[11px] text-gray-400 dark:text-zinc-500">
              {ROLE_LABELS[ws.role]}
            </span>
            <Check
              size={14}
              className={`shrink-0 text-[#3867ff] dark:text-[#5d7dff] ${ws.id === currentId ? '' : 'hidden'}`}
            />
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/8" />
        <DropdownMenuItem
          onClick={onCreate}
          className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[12.5px] font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-200 dark:hover:bg-white/5.5 dark:hover:text-white"
        >
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-500 dark:border-white/12 dark:text-zinc-400">
            <Plus className="h-3.5 w-3.5" />
          </span>
          <span>创建工作区</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
