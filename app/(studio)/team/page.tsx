'use client'

import * as React from 'react'

import { useT } from 'next-i18next/client'

import { useTeamConsoleQuery } from '@/services/team'

import { TeamDetailView } from './_components/team-detail'
import { CreateWorkspaceDialog, InviteDialog, SettingsDialog } from './_components/team-dialogs'
import { TeamEmptyState } from './_components/team-ui'

/**
 * 团队控制台(Team)
 * 两个视图:无工作区空态(创建引导卡) / 工作区详情(hero + KPI 五联 + 6 tab + 右侧订阅/日活/简报栏)
 * 三个弹窗:创建工作区 / 邀请成员 / 工作区设置
 * AppRail / SiteHeader 由 (studio) 路由组布局统一提供
 */
export default function TeamPage() {
  const { t } = useT('team')
  const { data } = useTeamConsoleQuery()

  const features = data?.data.features ?? []
  const template = data?.data.template

  const [workspace, setWorkspace] = React.useState<Team.Workspace | null>(null)
  const [dialog, setDialog] = React.useState<'create' | 'invite' | 'settings' | null>(null)

  /** 创建工作区:按 template 本地构造(含所有者成员 + 审计首条) */
  const handleCreate = (name: string, description: string) => {
    if (!template) return
    const now = new Date().toISOString()
    setWorkspace({
      id: `ws-${Date.now()}`,
      name,
      description,
      createdAt: now,
      ...template,
      members: [
        {
          id: 'm-1',
          name: template.ownerName,
          email: 'bobbyhebo@gmail.com',
          role: 'admin',
          isOwner: true,
          joinedAt: now,
        },
      ],
      audit: [
        {
          id: 'a-1',
          actor: template.ownerName,
          actionKey: 'Audit action create',
          target: name,
          createdAt: now,
        },
      ],
      invites: [],
    })
    setDialog(null)
  }

  return (
    <main className="mx-auto w-full max-w-[var(--app-content-max-width)] px-4 pt-5 pb-10 lg:px-6 lg:pt-6">
      <div className="space-y-4">
        {workspace ? (
          <TeamDetailView
            workspace={workspace}
            onSettings={() => setDialog('settings')}
            onInvite={() => setDialog('invite')}
            onTopUp={() => setDialog('invite')}
          />
        ) : (
          <TeamEmptyState
            features={features}
            onCreate={() => setDialog('create')}
          />
        )}
      </div>

      {dialog === 'create' ? (
        <CreateWorkspaceDialog
          onCreate={handleCreate}
          onClose={() => setDialog(null)}
        />
      ) : null}
      {dialog === 'invite' && workspace ? (
        <InviteDialog
          inviteToken={workspace.inviteToken}
          onClose={() => setDialog(null)}
        />
      ) : null}
      {dialog === 'settings' && workspace ? (
        <SettingsDialog
          workspace={workspace}
          onClose={() => setDialog(null)}
        />
      ) : null}

      {/* t 引用占位:确保 useT 绑定 ns(空态文案在 team-ui 内部消费) */}
      <span className="hidden">{t('Member roles & permissions')}</span>
    </main>
  )
}
