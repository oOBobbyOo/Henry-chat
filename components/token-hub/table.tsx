'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * 控制台风格 Table —— 基于 shadcn/ui table 重新封装
 * 适配 Token Hub 控制台视觉: 白底卡片 / 浅蓝表头 / 行 hover 浅蓝 / 边框 #dce5f6
 * 与 `@/components/ui/table` 相互独立,不改动 ui 目录下的原生组件
 */

function ConsoleTable({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot="console-table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="console-table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
}

function ConsoleTableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="console-table-header"
      className={cn('border-y border-[#dce5f6] bg-[#eef3ff] [&_tr]:border-b', className)}
      {...props}
    />
  )
}

function ConsoleTableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="console-table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function ConsoleTableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="console-table-footer"
      className={cn('border-t bg-[#f7f9fd] font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
}

function ConsoleTableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="console-table-row"
      className={cn(
        'border-b border-[#dce5f6]/80 transition-colors hover:bg-[#eef3ff] data-[state=selected]:bg-[#eef3ff]',
        className,
      )}
      {...props}
    />
  )
}

function ConsoleTableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="console-table-head"
      className={cn(
        'h-10 px-4 text-left align-middle text-[11px] font-semibold tracking-[0.07em] whitespace-nowrap text-[#8a9bc0] uppercase [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )
}

function ConsoleTableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="console-table-cell"
      className={cn(
        'px-4 py-3.5 align-middle text-[13px] whitespace-nowrap [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )
}

function ConsoleTableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="console-table-caption"
      className={cn('mt-4 text-sm text-[#8a9bc0]', className)}
      {...props}
    />
  )
}

export {
  ConsoleTable,
  ConsoleTableHeader,
  ConsoleTableBody,
  ConsoleTableFooter,
  ConsoleTableHead,
  ConsoleTableRow,
  ConsoleTableCell,
  ConsoleTableCaption,
}
