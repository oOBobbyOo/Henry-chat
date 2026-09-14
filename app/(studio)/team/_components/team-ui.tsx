'use client'

import { LayoutDashboard, Plus, ShieldCheck, Sparkles, User } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * 团队控制台共享视觉元件
 * 卡面 rounded-[22px] 白卡渐变;主按钮蓝青渐变 #3898bc→#6060bc;uppercase 小节标题;点分隔元信息
 */

/** 卡面容器(rounded-[22px] + 双主题渐变,对齐参考站 surface-panel 22px 圆角) */
export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[22px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(245,249,255,0.96))] shadow-[0_10px_30px_-12px_rgba(8,20,48,0.10)] backdrop-blur-md',
        'dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(17,24,40,0.94),rgba(10,15,28,0.92))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_40px_rgba(2,6,23,0.35)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** uppercase 小节标题 pill(卡内标题/标签通用) */
export function KpiLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('text-[10.5px] font-medium tracking-[0.12em] text-[#4e6585] uppercase dark:text-[#7a8db0]', className)}>{children}</span>
}

/** 卡头(图标框 + 标题 + 副描述) */
export function CardHeader({ icon, title, desc, right }: { icon: React.ReactNode; title: React.ReactNode; desc?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] text-[#4a6080] dark:border-white/8 dark:bg-white/6 dark:text-[#8fa5c4]">
          {icon}
        </span>
        <div>
          <h3 className="text-[14px] leading-5 font-semibold text-[#091423] dark:text-[#eef4ff]">{title}</h3>
          {desc ? <p className="mt-0.5 text-[12px] leading-4 text-[#4e6585] dark:text-[#7a8db0]">{desc}</p> : null}
        </div>
      </div>
      {right}
    </div>
  )
}

/** 主按钮(蓝青渐变,对齐参考站创建/提交按钮) */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  className,
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-[rgba(93,175,206,0.28)] bg-[linear-gradient(135deg,#3898bc,#5dafce,#6060bc)] px-5 text-[13px] font-medium text-[#f4f9ff] shadow-[0_10px_24px_rgba(93,175,206,0.18)] transition-all duration-200 hover:brightness-105 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:saturate-50 dark:border-white/15',
        className,
      )}
    >
      {children}
    </button>
  )
}

/** 次级按钮(幽灵/描边) */
export function GhostButton({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-transparent px-3 text-[12.5px] font-medium text-[#4e6585] transition-all duration-200 hover:border-[rgba(12,24,36,0.08)] hover:bg-[rgba(245,249,255,0.95)] hover:text-[#091423] dark:text-[#8fa5c4] dark:hover:border-white/10 dark:hover:bg-white/6 dark:hover:text-[#eef4ff]',
        className,
      )}
    >
      {children}
    </button>
  )
}

/** 徽标 badge(订阅/计划等右侧角标) */
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] px-2 py-0.5 text-[11px] font-medium text-[#2e4268] dark:border-white/8 dark:bg-white/6 dark:text-[#b6c5e0]',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** 空态引导特性卡图标映射 */
const FEATURE_ICONS = {
  layout: LayoutDashboard,
  user: User,
  shield: ShieldCheck,
  sparkles: Sparkles,
} as const

/** 空态:创建你的第一个团队工作区 */
export function TeamEmptyState({ features, onCreate }: { features: Team.Feature[]; onCreate: () => void }) {
  const { t } = useT('team')

  return (
    <Panel className="p-8 lg:p-10">
      <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(12,24,36,0.10)] bg-[rgba(93,175,206,0.06)] text-[#3d8fb0] dark:border-white/10 dark:bg-[rgba(93,175,206,0.10)] dark:text-[#7fc4dc]">
          <LayoutDashboard
            aria-hidden
            className="h-6 w-6"
            strokeWidth={1.75}
          />
        </div>
        <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.02em] text-[#091423] dark:text-[#eef4ff]">{t('Create your first team workspace')}</h2>
        <p className="mt-2 text-[13px] leading-6 text-[#4a6080] dark:text-[#8fa5c4]">{t('Empty state desc')}</p>
        <div className="mt-7 grid w-full gap-3 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon]
            return (
              <div
                key={feature.titleKey}
                className="rounded-xl border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] p-4 text-left dark:border-white/8 dark:bg-white/4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] text-[#3d8fb0] dark:border-white/8 dark:bg-white/6 dark:text-[#7fc4dc]">
                  <Icon
                    aria-hidden
                    className="h-4 w-4"
                    strokeWidth={1.75}
                  />
                </div>
                <p className="mt-3 text-[13px] font-semibold text-[#091423] dark:text-[#eef4ff]">{t(feature.titleKey)}</p>
                <p className="mt-1 text-[11.5px] leading-5 text-[#4e6585] dark:text-[#7a8db0]">{t(feature.descKey)}</p>
              </div>
            )
          })}
        </div>
        <PrimaryButton
          onClick={onCreate}
          className="mt-7"
        >
          <Plus
            aria-hidden
            className="h-4 w-4"
            strokeWidth={1.75}
          />
          {t('Create team workspace')}
        </PrimaryButton>
        <p className="mt-3 text-[11px] text-[#4e6585] dark:text-[#7a8db0]">{t('Free default hint')}</p>
      </div>
    </Panel>
  )
}
