'use client'

import { Inbox } from 'lucide-react'

/**
 * 用量分析 —— 空状态(请求日志 / MCP 调用占位)
 */
export function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[15px] border border-dashed border-[#dce5f6] bg-white/60 px-6 py-20 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef3ff] text-[#4269ee]">
        <Inbox className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-[#0f1c3a]">{title}</p>
      <p className="max-w-md text-xs leading-5 text-[#8a9bc0]">{desc}</p>
    </div>
  )
}
