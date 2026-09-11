'use client'

import * as React from 'react'

import { Copy, Paperclip, Plus, Settings, Send, X } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import { GhostButton, PrimaryButton } from './team-ui'

/**
 * 团队控制台弹窗组 —— 创建工作区 / 邀请成员 / 工作区设置
 * 视觉对齐 fixed 遮罩 backdrop-blur + rounded-[20px] 面板 + uppercase 标签 + 蓝青渐变提交钮
 */

/** 输入控件通用样式(对齐参考站 ws-create-name / ws-create-desc) */
const inputCls =
  'mt-1.5 w-full rounded-md border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] px-3 text-[13px] text-[#091423] outline-none placeholder:text-[#4e6585] transition focus:border-[rgba(12,24,36,0.18)] focus:ring-2 focus:ring-[rgba(93,175,206,0.20)] dark:border-white/8 dark:bg-white/6 dark:text-[#eef4ff] dark:placeholder:text-[#7a8db0]'

/** 弹窗外框(title + desc + 关闭按钮) */
function DialogShell({
  title,
  desc,
  onClose,
  children,
  footer,
  className,
}: {
  title: string
  desc: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={cn(
          'w-full overflow-hidden rounded-[20px] border border-[rgba(12,24,36,0.08)] bg-white p-0 shadow-[0_24px_80px_rgb(16_38_79/0.22)] sm:max-w-[520px] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(20,26,42,0.98),rgba(12,17,30,0.98))]',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#091423] dark:text-[#eef4ff]">
              {title}
            </h2>
            <p className="mt-1.5 text-[12.5px] leading-5 text-[#4a6080] dark:text-[#8fa5c4]">
              {desc}
            </p>
          </div>
          <button
            type="button"
            aria-label="关闭"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#4a6080] transition hover:bg-[rgba(245,249,255,0.95)] hover:text-[#091423] dark:text-[#8fa5c4] dark:hover:bg-white/6 dark:hover:text-[#eef4ff]"
          >
            <X
              aria-hidden
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
          </button>
        </div>
        {children}
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-[rgba(12,24,36,0.08)] px-6 py-3 dark:border-white/8">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

/** 创建工作区弹窗(名称必填 + 描述选填) */
export function CreateWorkspaceDialog({
  onCreate,
  onClose,
}: {
  onCreate: (name: string, description: string) => void
  onClose: () => void
}) {
  const { t } = useT('team')

  return (
    <CreateWorkspaceDialogInner
      onCreate={onCreate}
      onClose={onClose}
      t={t}
    />
  )
}

/** 内层(持有输入状态,避免外层重渲染丢焦点) */
function CreateWorkspaceDialogInner({
  onCreate,
  onClose,
  t,
}: {
  onCreate: (name: string, description: string) => void
  onClose: () => void
  t: (key: string) => string
}) {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')

  return (
    <DialogShell
      title={t('Create workspace dialog title')}
      desc={t('Create workspace dialog desc')}
      onClose={onClose}
      footer={
        <>
          <GhostButton onClick={onClose}>{t('Cancel')}</GhostButton>
          <PrimaryButton
            disabled={!name.trim()}
            onClick={() => onCreate(name.trim(), description.trim())}
            className="h-8 px-3 text-[12.5px]"
          >
            {t('Create workspace')}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-4 px-6 py-5">
        <div>
          <label
            htmlFor="team-ws-create-name"
            className="text-[10.5px] font-medium tracking-[0.12em] text-[#4e6585] uppercase dark:text-[#7a8db0]"
          >
            {t('Workspace name')}
          </label>
          <input
            id="team-ws-create-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('Workspace name placeholder')}
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="team-ws-create-desc"
            className="text-[10.5px] font-medium tracking-[0.12em] text-[#4e6585] uppercase dark:text-[#7a8db0]"
          >
            {t('Description (optional)')}
          </label>
          <textarea
            id="team-ws-create-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('Description placeholder')}
            className={cn(inputCls, 'resize-y py-2')}
          />
        </div>
      </div>
    </DialogShell>
  )
}

/** 邀请成员弹窗(只读链接 + 复制 + 7 天有效提示) */
export function InviteDialog({
  inviteToken,
  onClose,
}: {
  inviteToken: string
  onClose: () => void
}) {
  const { t } = useT('team')
  const [copied, setCopied] = React.useState(false)
  const link = `https://example.com/workspace-invite?token=${inviteToken}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // 剪贴板不可用时降级为 execCommand
      const input = document.createElement('input')
      input.value = link
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    toast.success(t('Copied'))
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DialogShell
      title={t('Invite dialog title')}
      desc={t('Invite dialog desc')}
      onClose={onClose}
      footer={
        <>
          <GhostButton className="gap-1.5">
            <Settings
              aria-hidden
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
            {t('Edit link settings')}
          </GhostButton>
          <GhostButton
            onClick={onClose}
            className="text-[#2e4268] dark:text-[#b6c5e0]"
          >
            {t('Done')}
          </GhostButton>
        </>
      }
    >
      <div className="space-y-4 px-6 py-5">
        <div>
          <label className="text-[10.5px] font-medium tracking-[0.12em] text-[#4e6585] uppercase dark:text-[#7a8db0]">
            {t('Invite link')}
          </label>
          <div className="mt-1.5 flex items-stretch gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="h-11 flex-1 rounded-md border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] px-3 font-mono text-[12.5px] text-[#091423] outline-none dark:border-white/8 dark:bg-white/6 dark:text-[#eef4ff]"
            />
            <button
              type="button"
              aria-label={t('Copy')}
              onClick={handleCopy}
              className={cn(
                'inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[rgba(93,175,206,0.28)] bg-[linear-gradient(135deg,#3898bc,#5dafce,#6060bc)] text-[#f4f9ff] shadow-[0_10px_24px_rgba(93,175,206,0.18)] transition hover:brightness-105',
                copied && 'brightness-110',
              )}
            >
              <Paperclip
                aria-hidden
                className="h-4 w-4"
                strokeWidth={1.75}
              />
            </button>
          </div>
        </div>
        <div className="rounded-xl border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] p-3.5 dark:border-white/8 dark:bg-white/4">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[rgba(93,175,206,0.12)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3d8fb0] dark:bg-[#5dafce]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#091423] dark:text-[#eef4ff]">
                {t('Link valid note')}
              </p>
              <p className="mt-0.5 text-[11.5px] text-[#4e6585] dark:text-[#7a8db0]">
                {t('Link valid desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DialogShell>
  )
}

/** 设置弹窗(基本信息 / 所有权 / 危险操作 三 nav) */
export function SettingsDialog({
  workspace,
  onClose,
}: {
  workspace: Team.Workspace
  onClose: () => void
}) {
  const { t } = useT('team')
  const [tab, setTab] = React.useState<'basic' | 'ownership' | 'danger'>('basic')
  const [name, setName] = React.useState(workspace.name)

  const navItems = [
    { id: 'basic' as const, label: t('Settings nav basic') },
    { id: 'ownership' as const, label: t('Settings nav ownership') },
    { id: 'danger' as const, label: t('Settings nav danger') },
  ]

  return (
    <DialogShell
      title={t('Settings dialog title')}
      desc={workspace.name}
      onClose={onClose}
      className="flex flex-col sm:max-w-[640px]"
      footer={
        <>
          <GhostButton onClick={onClose}>{t('Cancel')}</GhostButton>
          <PrimaryButton
            disabled={!name.trim() || name.trim() === workspace.name}
            onClick={() => onClose()}
            className="h-8 px-3 text-[12.5px]"
          >
            {t('Save')}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid flex-1 grid-cols-[160px_minmax(0,1fr)] divide-x divide-[rgba(12,24,36,0.08)] dark:divide-white/8">
        <nav className="flex flex-col gap-0.5 px-2 py-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-left text-[12.5px] font-medium transition',
                tab === item.id
                  ? 'bg-[rgba(245,249,255,0.95)] text-[#091423] dark:bg-white/8 dark:text-[#eef4ff]'
                  : 'text-[#4a6080] hover:bg-[rgba(245,249,255,0.95)] hover:text-[#091423] dark:text-[#8fa5c4] dark:hover:bg-white/6 dark:hover:text-[#eef4ff]',
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-6 py-5">
          {tab === 'basic' ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="team-ws-name"
                  className="text-[10.5px] font-medium tracking-[0.12em] text-[#4e6585] uppercase dark:text-[#7a8db0]"
                >
                  {t('Workspace name')}
                </label>
                <input
                  id="team-ws-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  htmlFor="team-ws-desc"
                  className="text-[10.5px] font-medium tracking-[0.12em] text-[#4e6585] uppercase dark:text-[#7a8db0]"
                >
                  {t('Description (optional)')}
                </label>
                <textarea
                  id="team-ws-desc"
                  rows={3}
                  defaultValue={workspace.description}
                  placeholder={t('Description placeholder')}
                  className={cn(inputCls, 'resize-y py-2')}
                />
              </div>
            </div>
          ) : null}
          {tab === 'ownership' ? (
            <p className="text-[12.5px] text-[#4e6585] dark:text-[#7a8db0]">
              {t('Owner')}: {workspace.ownerName}
            </p>
          ) : null}
          {tab === 'danger' ? (
            <p className="text-[12.5px] text-[#c0392b] dark:text-[#e07a6a]">{workspace.name}</p>
          ) : null}
        </div>
      </div>
    </DialogShell>
  )
}

/** 成员 tab 内的邀请按钮(触发 InviteDialog 用) */
export function InviteButton({ onClick }: { onClick: () => void }) {
  const { t } = useT('team')

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[rgba(12,24,36,0.10)] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(245,249,255,0.9))] px-2.5 text-[12.5px] font-medium text-[#2e4268] transition hover:border-[rgba(12,24,36,0.16)] hover:text-[#091423] dark:border-white/10 dark:bg-white/6 dark:text-[#b6c5e0] dark:hover:text-[#eef4ff]"
    >
      <Plus
        aria-hidden
        className="h-3.5 w-3.5"
        strokeWidth={1.75}
      />
      {t('Invite members')}
    </button>
  )
}

/** 待接受邀请卡头部的 Send 图标(供 detail 复用,避免循环依赖) */
export function SendIcon() {
  return (
    <Send
      aria-hidden
      className="h-3.5 w-3.5"
      strokeWidth={1.75}
    />
  )
}

/** 邀请成员弹窗复制按钮内的 Paperclip 图标(同上) */
export function CopyIcon() {
  return (
    <Copy
      aria-hidden
      className="h-3.5 w-3.5"
      strokeWidth={1.75}
    />
  )
}
