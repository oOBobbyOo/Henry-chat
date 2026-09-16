'use client'

import * as React from 'react'

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * 控制台风格 Select —— 基于 radix-ui 重新封装
 * 适配 Token Hub 控制台视觉: 语义色板变量(亮/暗主题自适应) / 圆角 / 品牌聚焦态
 * 与 `@/components/ui/select` 相互独立,不改动 ui 目录下的原生组件
 */

function ConsoleSelect({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return (
    <SelectPrimitive.Root
      data-slot="console-select"
      {...props}
    />
  )
}

function ConsoleSelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="console-select-value"
      {...props}
    />
  )
}

function ConsoleSelectTrigger({
  className,
  size = 'md',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'md'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="console-select-trigger"
      data-size={size}
      className={cn(
        'flex w-fit cursor-pointer items-center justify-between gap-1.5 rounded-xl border border-(--tc-border) bg-(--tc-surface) px-3 text-[13px] font-medium text-(--tc-strong) shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition-colors outline-none select-none focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'hover:border-(--tc-primary-hover)/40 hover:bg-(--tc-surface-raised) data-[state=open]:border-(--tc-primary-hover)/40 data-[state=open]:bg-(--tc-surface-raised)',
        'data-[size=sm]:h-8 data-[size=sm]:rounded-lg data-[size=sm]:px-2.5 data-[size=sm]:text-xs',
        'data-[size=md]:h-10',
        '*:data-[slot=console-select-value]:flex *:data-[slot=console-select-value]:items-center *:data-[slot=console-select-value]:gap-1.5',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-(--tc-muted)" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function ConsoleSelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="console-select-content"
        className={cn(
          'bg-popover text-popover-foreground relative z-50 max-h-[min(var(--radix-select-content-available-height),320px)] min-w-36 overflow-y-auto rounded-xl border border-(--tc-border) bg-(--tc-surface) p-1 shadow-[0_10px_40px_rgb(16_38_79/0.14)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        {...props}
      >
        <ConsoleSelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            'p-1',
            position === 'popper' && 'w-full min-w-(--radix-select-trigger-width)',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <ConsoleSelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function ConsoleSelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="console-select-item"
      className={cn(
        'relative flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-1.5 pr-8 pl-2.5 text-[13px] text-(--tc-strong) outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50',
        'data-highlighted:bg-(--tc-blue-soft) data-highlighted:text-(--tc-blue-bright)',
        '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-3.5 text-(--tc-blue-bright)" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function ConsoleSelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronUpIcon className="size-3.5 text-(--tc-muted)" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function ConsoleSelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronDownIcon className="size-3.5 text-(--tc-muted)" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  ConsoleSelect,
  ConsoleSelectContent,
  ConsoleSelectItem,
  ConsoleSelectScrollDownButton,
  ConsoleSelectScrollUpButton,
  ConsoleSelectTrigger,
  ConsoleSelectValue,
}
