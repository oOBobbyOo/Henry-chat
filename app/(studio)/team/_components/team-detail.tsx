'use client'

import * as React from 'react'

import { Bookmark, Clock, CreditCard, Crown, History, Image as ImageIcon, Layers, LayoutDashboard, Plus, Send, Share2, SlidersHorizontal, Sparkles, User } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

import { Badge, CardHeader, GhostButton, KpiLabel, Panel, PrimaryButton } from './team-ui'

/**
 * 团队详情视图 —— hero 卡 + KPI 五联卡 + tab 条(概览/成员/洞察/资产/账单/审计)
 * 布局对齐 左主列(积分池/趋势/状态/类型/贡献)+ 右 320~360px 侧栏(订阅/日活/空间简报)
 */

/** dot 元信息分隔(参考站 h-0.5 w-0.5 圆点) */
function Dot() {
  return (
    <span
      className="h-0.5 w-0.5 rounded-full bg-[rgba(12,24,36,0.35)] dark:bg-white/30"
      aria-hidden
    />
  )
}

/** hero 工作区信息卡 */
function HeroCard({ workspace, onSettings, onInvite }: { workspace: Team.Workspace; onSettings: () => void; onInvite: () => void }) {
  const { t } = useT('team')

  return (
    <Panel className="p-0">
      {/* 径向氛围(对齐参考站 inset 渐变) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-80"
        style={{
          background: 'radial-gradient(720px 220px at 0% 0%, rgba(93,175,206,0.10), transparent 60%), radial-gradient(540px 160px at 100% 100%, rgba(96,96,188,0.06), transparent 60%)',
        }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-6 lg:py-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(135deg,rgba(93,175,206,0.10),rgba(93,175,206,0.03),transparent)] text-[#3d8fb0] dark:border-white/10 dark:text-[#7fc4dc]">
            <LayoutDashboard
              aria-hidden
              className="h-5 w-5"
              strokeWidth={1.75}
            />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-[19px] leading-6 font-semibold tracking-[-0.01em] text-[#091423] dark:text-[#eef4ff]">{workspace.name}</h2>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[rgba(12,24,36,0.10)] bg-[linear-gradient(180deg,rgba(93,175,206,0.10),rgba(93,175,206,0.04))] px-1.5 py-0.5 text-[10.5px] font-medium tracking-[0.12em] text-[#3d8fb0] uppercase dark:border-white/10 dark:text-[#7fc4dc]">
                {t('Team Free badge')} {workspace.seatsUsed}/{workspace.seatsTotal}
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] leading-4 text-[#4e6585] dark:text-[#7a8db0]">
              <span className="inline-flex items-center gap-1.5">
                <LayoutDashboard
                  aria-hidden
                  className="h-3 w-3"
                  strokeWidth={1.75}
                />
                {t('Team workspace label')}
              </span>
              <Dot />
              <span>
                {t('My role')}{' '}
                <span className="font-medium text-[#2e4268] dark:text-[#b6c5e0]">{t(workspace.myRole === 'admin' ? 'Admin' : workspace.myRole === 'creator' ? 'Creator' : 'Readonly')}</span>
              </span>
              <Dot />
              <span>
                {t('Owner')} <span className="font-medium text-[#2e4268] dark:text-[#b6c5e0]">{workspace.ownerName}</span>
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] leading-4 text-[#4e6585] dark:text-[#7a8db0]">
              <span className="inline-flex items-center gap-1.5">
                <CreditCard
                  aria-hidden
                  className="h-3 w-3"
                  strokeWidth={1.75}
                />
                {t('Monthly')}
              </span>
              <Dot />
              <span className="inline-flex items-center gap-1">
                {t('Seats')}{' '}
                <span className="font-medium text-[#2e4268] tabular-nums dark:text-[#b6c5e0]">
                  {workspace.seatsUsed}/{workspace.seatsTotal}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <GhostButton onClick={onSettings}>{t('Settings')}</GhostButton>
          <button
            type="button"
            onClick={onInvite}
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[rgba(93,175,206,0.28)] bg-[linear-gradient(135deg,#3898bc,#5dafce,#6060bc)] px-3 text-[12.5px] font-medium text-[#f4f9ff] shadow-[0_10px_24px_rgba(93,175,206,0.18)] transition hover:brightness-105"
          >
            {t('Invite members')}
          </button>
        </div>
      </div>
    </Panel>
  )
}

/** KPI 五联卡(席位/可用积分/14 日任务/资产产出/任务通过率) */
function KpiStrip({ workspace, onTopUp }: { workspace: Team.Workspace; onTopUp: () => void }) {
  const { t } = useT('team')

  const cards = [
    {
      icon: (
        <User
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Seats KPI'),
      value: workspace.seatsUsed,
      suffix: `/ ${workspace.seatsTotal}`,
      accent: false,
      hint: t('Seats KPI hint', {
        free: workspace.seatsTotal - workspace.seatsUsed,
        active: workspace.tasks.total > 0 ? 1 : 0,
        total: workspace.seatsUsed,
      }),
    },
    {
      icon: (
        <Sparkles
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Credits KPI'),
      value: workspace.creditsAvailable,
      suffix: '',
      accent: false,
      hint: t('Credits KPI hint', {
        sub: workspace.creditsSubscribed,
        gift: workspace.creditsGifted,
        locked: workspace.creditsLocked,
      }),
      extra: (
        <button
          type="button"
          aria-label={t('Top up credits')}
          onClick={onTopUp}
          className="inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-[8px] border border-[rgba(93,175,206,0.28)] bg-[linear-gradient(135deg,#3898bc,#5dafce,#6060bc)] px-2 text-[11px] font-medium text-[#f4f9ff] transition hover:brightness-105"
        >
          <Plus
            className="h-3 w-3"
            strokeWidth={2}
          />
          {t('Top up credits')}
        </button>
      ),
    },
    {
      icon: (
        <History
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Tasks KPI'),
      value: workspace.tasks.total,
      suffix: '',
      accent: false,
      hint: t('Tasks KPI hint', {
        done: workspace.tasks.completed,
        failed: workspace.tasks.failed,
        review: workspace.tasks.pendingReview,
      }),
    },
    {
      icon: (
        <ImageIcon
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Assets KPI'),
      value: workspace.assets.total,
      suffix: '',
      accent: false,
      hint: t('Assets KPI hint', {
        total: workspace.assets.total,
        shared: workspace.assets.shared,
      }),
    },
    {
      icon: (
        <SlidersHorizontal
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Pass rate KPI'),
      value: workspace.passRate,
      suffix: '%',
      accent: true,
      hint: t('Pass rate KPI hint', {
        fail: workspace.failRate,
        avg: workspace.dailyAvg.toFixed(1),
      }),
    },
  ]

  return (
    <Panel className="p-0">
      <div className="grid divide-y divide-[rgba(12,24,36,0.08)] md:grid-cols-2 md:divide-x lg:grid-cols-5 lg:divide-y-0 dark:divide-white/8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex min-w-0 flex-col justify-between gap-3 px-5 py-4"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[#4e6585] dark:text-[#7a8db0]">{card.icon}</span>
              <KpiLabel>{card.label}</KpiLabel>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={cn('text-[24px] leading-none font-semibold tracking-[-0.01em] tabular-nums', card.accent ? 'text-[#3d8fb0] dark:text-[#5dafce]' : 'text-[#091423] dark:text-[#eef4ff]')}
                  >
                    {card.value}
                  </span>
                  {card.suffix ? <span className="text-[12px] text-[#4e6585] dark:text-[#7a8db0]">{card.suffix}</span> : null}
                  {card.extra}
                </div>
                <p className="mt-2 text-[11.5px] leading-4 text-[#4e6585] dark:text-[#7a8db0]">{card.hint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

/** 团队积分池卡 */
function CreditsPoolCard({ workspace }: { workspace: Team.Workspace }) {
  const { t } = useT('team')
  const total = Math.max(1, workspace.creditsSubscribed + workspace.creditsGifted + workspace.creditsLocked)

  const rows = [
    { label: t('Subscribed credits'), value: workspace.creditsSubscribed, opacity: 1 },
    { label: t('Gifted credits'), value: workspace.creditsGifted, opacity: 0.6 },
    { label: t('Locked credits'), value: workspace.creditsLocked, opacity: 0.25 },
  ]

  return (
    <Panel className="p-5">
      <CardHeader
        icon={
          <Sparkles
            className="h-3.5 w-3.5"
            strokeWidth={1.75}
          />
        }
        title={t('Credits pool')}
        desc={t('Credits pool desc')}
        right={
          <div className="text-right">
            <KpiLabel>{t('Available')}</KpiLabel>
            <p className="mt-1 text-[22px] leading-none font-semibold text-[#091423] tabular-nums dark:text-[#eef4ff]">{workspace.creditsAvailable}</p>
          </div>
        }
      />
      <div className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-[rgba(245,249,255,0.95)] dark:bg-white/8">
        {rows.map((row) => (
          <div
            key={row.label}
            title={`${row.label} ${row.value}`}
            className="h-full bg-[#5dafce] dark:bg-[#5dafce]"
            style={{ width: `${(row.value / total) * 100}%`, opacity: row.opacity }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-x-6 gap-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#5dafce]"
                style={{ opacity: row.opacity }}
              />
              <span className="text-[11.5px] text-[#4a6080] dark:text-[#8fa5c4]">{row.label}</span>
            </div>
            <p className="mt-1 text-[15px] font-semibold text-[#091423] tabular-nums dark:text-[#eef4ff]">{row.value}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

/** 14 日任务趋势(纯 CSS 柱状图,对齐参考站) */
function TaskTrendCard({ trend }: { trend: Team.TrendPoint[] }) {
  const { t } = useT('team')
  const tasks = trend.map((p) => p.tasks)
  const peak = Math.max(0, ...tasks)
  const trough = Math.min(...tasks, peak > 0 ? Math.max(0, ...tasks) : 0)
  const max = Math.max(1, peak)

  return (
    <Panel className="p-5">
      <CardHeader
        icon={
          <History
            className="h-3.5 w-3.5"
            strokeWidth={1.75}
          />
        }
        title={t('Task trend')}
        desc={t('Task trend desc')}
      />
      <div className="mt-5 flex items-end gap-1.5">
        {trend.map((point) => (
          <div
            key={point.date}
            className="group relative flex flex-1 flex-col items-center"
          >
            <div
              className="relative flex w-full items-end justify-center"
              style={{ height: 96 }}
            >
              <div
                title={`${point.date} · ${point.tasks} ${t('Tasks KPI')}`}
                className="w-full max-w-[16px] rounded-sm bg-[rgba(12,24,36,0.06)] transition group-hover:bg-[rgba(93,175,206,0.70)] dark:bg-white/10"
                style={{ height: `${(point.tasks / max) * 92}px` }}
              />
              <div
                title={`${point.date} · ${point.active} DAU`}
                className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#5dafce] ring-2 ring-white dark:ring-[#0b1326]"
                style={{
                  bottom: `${4 + (point.active / Math.max(1, Math.max(...trend.map((p) => p.active)))) * 84}px`,
                }}
              />
            </div>
            <span className="mt-1.5 text-[10px] text-[#4e6585] tabular-nums dark:text-[#7a8db0]">{point.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11.5px] text-[#4e6585] dark:text-[#7a8db0]">
        <span>
          {t('Peak')} <span className="text-[#2e4268] tabular-nums dark:text-[#b6c5e0]">{peak}</span>
        </span>
        <span>
          {t('Average')} <span className="text-[#2e4268] tabular-nums dark:text-[#b6c5e0]">{Math.round(tasks.reduce((a, b) => a + b, 0) / Math.max(1, tasks.length))}</span>
        </span>
        <span>
          {t('Trough')} <span className="text-[#2e4268] tabular-nums dark:text-[#b6c5e0]">{trough}</span>
        </span>
      </div>
    </Panel>
  )
}

/** 空态卡体(暂无任务/暂无资产等) */
function EmptyBody({ text }: { text: string }) {
  return <p className="text-[12px] text-[#4e6585] dark:text-[#7a8db0]">{text}</p>
}

/** 右侧栏:订阅卡 */
function SubscriptionCard({ workspace }: { workspace: Team.Workspace }) {
  const { t } = useT('team')

  return (
    <Panel className="p-5">
      <CardHeader
        icon={
          <CreditCard
            className="h-3.5 w-3.5"
            strokeWidth={1.75}
          />
        }
        title={t('Subscription')}
        desc={t('Monthly')}
        right={<Badge>{`${t('Team Free badge')} ${workspace.seatsUsed}/${workspace.seatsTotal}`}</Badge>}
      />
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <KpiLabel>{t('Plan validity')}</KpiLabel>
          <p className="mt-1.5 text-[18px] font-semibold text-[#091423] tabular-nums dark:text-[#eef4ff]">
            —<span className="ml-0.5 text-[11.5px] font-normal text-[#4e6585] dark:text-[#7a8db0]"> {t('Days unit')}</span>
          </p>
        </div>
        <div>
          <KpiLabel>{t('Seats')}</KpiLabel>
          <p className="mt-1.5 text-[18px] font-semibold text-[#091423] tabular-nums dark:text-[#eef4ff]">
            {workspace.seatsUsed}
            <span className="text-[12px] font-normal text-[#4e6585] dark:text-[#7a8db0]"> / {workspace.seatsTotal}</span>
          </p>
        </div>
      </div>
      <GhostButton className="mt-4 w-full justify-center">{t('Manage subscription')}</GhostButton>
    </Panel>
  )
}

/** 右侧栏:14 日日活卡(SVG polyline 折线) */
function DailyActiveCard({ trend, members }: { trend: Team.TrendPoint[]; members: number }) {
  const { t } = useT('team')
  const W = 300
  const H = 56
  const actives = trend.map((p) => p.active)
  const peak = actives.length ? Math.max(...actives) : 0
  const trough = actives.length ? Math.min(...actives) : 0
  const maxActive = Math.max(1, peak)
  const points = trend.map((p, i) => `${(i / Math.max(1, trend.length - 1)) * W},${H - 2 - (p.active / maxActive) * (H - 6)}`).join(' ')

  return (
    <Panel className="p-5">
      <CardHeader
        icon={
          <User
            className="h-3.5 w-3.5"
            strokeWidth={1.75}
          />
        }
        title={t('Daily active')}
        desc={t('Daily active desc')}
        right={<span className="text-[18px] font-semibold text-[#091423] tabular-nums dark:text-[#eef4ff]">{peak}</span>}
      />
      <div className="mt-4 text-[#5dafce] dark:text-[#5dafce]">
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="overflow-visible"
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="mt-2 text-[11.5px] text-[#4e6585] dark:text-[#7a8db0]">{t('Daily active footer', { peak, trough, members })}</p>
    </Panel>
  )
}

/** 右侧栏:空间简报卡 */
function SpaceBriefCard() {
  const { t } = useT('team')

  return (
    <Panel className="p-5">
      <CardHeader
        icon={
          <History
            className="h-3.5 w-3.5"
            strokeWidth={1.75}
          />
        }
        title={t('Space brief')}
        desc={t('Space brief empty')}
        right={<Badge>{t('Unpublished')}</Badge>}
      />
      <GhostButton className="mt-4 w-full justify-start gap-1.5">
        <History
          aria-hidden
          className="h-3.5 w-3.5"
          strokeWidth={1.75}
        />
        {t('View drafts')}
      </GhostButton>
    </Panel>
  )
}

/** 成员行 */
function MemberRow({ member }: { member: Team.Member }) {
  const { t } = useT('team')
  const initials = member.name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const roleLabel = member.role === 'admin' ? t('Admin') : member.role === 'creator' ? t('Creator') : t('Readonly')
  const joined = new Date(member.joinedAt).toLocaleDateString()

  return (
    <div className="group flex items-center gap-3 border-b border-[rgba(12,24,36,0.08)] px-1 py-3 last:border-b-0 hover:bg-[rgba(245,249,255,0.95)] dark:border-white/8 dark:hover:bg-white/4">
      <div
        className="flex shrink-0 items-center justify-center rounded-full bg-[rgba(93,175,206,0.12)] font-medium tracking-tight text-[#3d8fb0] ring-1 ring-[rgba(93,175,206,0.25)] ring-inset dark:text-[#7fc4dc]"
        style={{ width: 32, height: 32, fontSize: 11.5 }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-medium text-[#091423] dark:text-[#eef4ff]">{member.name}</p>
          {member.isOwner ? (
            <span className="inline-flex items-center rounded-md border border-[rgba(12,24,36,0.10)] bg-[rgba(93,175,206,0.06)] px-1.5 py-0.5 text-[10px] font-medium tracking-[0.1em] text-[#3d8fb0] uppercase dark:border-white/10 dark:text-[#7fc4dc]">
              {t('Owner')}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-[11.5px] text-[#4e6585] dark:text-[#7a8db0]">
          {member.email} · {t('Joined at', { date: joined })}
        </p>
      </div>
      <span className="shrink-0 rounded-md border border-[rgba(93,175,206,0.20)] bg-[rgba(93,175,206,0.06)] px-2 py-0.5 text-[11px] font-medium text-[#3d8fb0] dark:text-[#7fc4dc]">{roleLabel}</span>
    </div>
  )
}

/** 审计时间相对格式(N 分钟前) */
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  return `${Math.floor(hours / 24)} 天前`
}

/** 概览 tab */
function OverviewTab({ workspace }: { workspace: Team.Workspace }) {
  const { t } = useT('team')

  return (
    <div className="space-y-4">
      <CreditsPoolCard workspace={workspace} />
      <div className="grid gap-4 lg:grid-cols-2">
        <TaskTrendCard trend={workspace.trend} />
        <Panel className="p-5">
          <CardHeader
            icon={
              <SlidersHorizontal
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            }
            title={t('Task status')}
            desc={t('Task status desc', { count: workspace.tasks.total })}
          />
          <div className="mt-4 space-y-2.5">
            <EmptyBody text={t('No tasks')} />
          </div>
        </Panel>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <CardHeader
            icon={
              <Layers
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            }
            title={t('Task type')}
          />
          <div className="mt-4 space-y-3">
            <EmptyBody text={t('No tasks')} />
          </div>
        </Panel>
        <Panel className="p-5">
          <CardHeader
            icon={
              <User
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            }
            title={t('Member contribution', {
              count: workspace.members.length > 1 ? workspace.members.length : 0,
            })}
          />
          <div className="mt-4 space-y-3">
            <EmptyBody text={t('No member tasks')} />
          </div>
        </Panel>
      </div>
    </div>
  )
}

/** 成员 tab(角色筛选 pills + 成员行 + 待接受邀请) */
function MembersTab({ workspace }: { workspace: Team.Workspace }) {
  const { t } = useT('team')
  const [filter, setFilter] = React.useState<Team.MemberFilter>('all')

  const countOf = (role: Team.MemberFilter) => (role === 'all' ? workspace.members.length : workspace.members.filter((m) => m.role === role).length)
  const filtered = filter === 'all' ? workspace.members : workspace.members.filter((m) => m.role === filter)

  const filters: Array<{ id: Team.MemberFilter; label: string }> = [
    { id: 'all', label: t('Filter all') },
    { id: 'admin', label: t('Admin') },
    { id: 'creator', label: t('Creator') },
    { id: 'readonly', label: t('Readonly') },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-4">
        <Panel className="p-5">
          <CardHeader
            icon={
              <User
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            }
            title={t('Member list')}
            desc={t('Member list desc')}
            right={
              <div className="flex items-center gap-px rounded-md border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] p-0.5 dark:border-white/8 dark:bg-white/6">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded px-2 py-1 text-[11.5px] font-medium transition',
                      filter === f.id ? 'bg-white text-[#091423] shadow-sm dark:bg-white/12 dark:text-[#eef4ff]' : 'text-[#4e6585] hover:text-[#091423] dark:text-[#7a8db0] dark:hover:text-[#eef4ff]',
                    )}
                  >
                    {f.label}
                    <span className="text-[#4e6585] tabular-nums dark:text-[#7a8db0]">{countOf(f.id)}</span>
                  </button>
                ))}
              </div>
            }
          />
          <div className="mt-4">
            {filtered.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
              />
            ))}
          </div>
        </Panel>
      </div>
      <div className="space-y-4">
        <Panel className="p-5">
          <CardHeader
            icon={
              <Send
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            }
            title={t('Pending invites')}
            desc={t('Pending invites desc')}
            right={<Badge>{workspace.invites.length}</Badge>}
          />
          <div className="mt-4">{workspace.invites.length === 0 ? <div className="px-1 py-6 text-center text-[12.5px] text-[#4e6585] dark:text-[#7a8db0]">{t('No pending invites')}</div> : null}</div>
        </Panel>
      </div>
    </div>
  )
}

/** 洞察 tab */
function InsightsTab({ workspace }: { workspace: Team.Workspace }) {
  const { t } = useT('team')

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel className="p-5">
        <CardHeader
          icon={
            <Clock
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
          }
          title={t('Active hours')}
          desc={t('Active hours desc')}
        />
        <p className="mt-4 text-[12px] text-[#4e6585] dark:text-[#7a8db0]">{t('Active hours empty')}</p>
      </Panel>
      <Panel className="p-5">
        <CardHeader
          icon={
            <ImageIcon
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
          }
          title={t('Asset type dist')}
          desc={t('Asset type dist desc', { count: workspace.assets.total })}
        />
        <div className="mt-4 space-y-3">
          <EmptyBody text={t('No assets')} />
        </div>
      </Panel>
      <Panel className="p-5">
        <CardHeader
          icon={
            <Layers
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
          }
          title={t('Model dist')}
          desc={t('Model dist desc')}
        />
        <div className="mt-4 space-y-3">
          <EmptyBody text={t('No tasks')} />
        </div>
      </Panel>
    </div>
  )
}

/** 资产 tab(六联 KPI + 复用率 + 类型分布) */
function AssetsTab({ workspace }: { workspace: Team.Workspace }) {
  const { t } = useT('team')

  const kpis = [
    {
      icon: (
        <ImageIcon
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Asset KPI total'),
      value: workspace.assets.total,
    },
    {
      icon: (
        <Sparkles
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Asset KPI produced'),
      value: workspace.assets.produced,
    },
    {
      icon: (
        <Share2
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Asset KPI shared'),
      value: workspace.assets.shared,
    },
    {
      icon: (
        <Bookmark
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Asset KPI favorited'),
      value: workspace.assets.favorited,
    },
    {
      icon: (
        <Layers
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Asset KPI tagged'),
      value: workspace.assets.tagged,
    },
    {
      icon: (
        <SlidersHorizontal
          className="h-3 w-3"
          strokeWidth={1.75}
        />
      ),
      label: t('Asset KPI tags'),
      value: workspace.assets.tagCount,
    },
  ]

  return (
    <div className="space-y-4">
      <Panel className="p-0">
        <div className="grid grid-cols-2 divide-y divide-[rgba(12,24,36,0.08)] sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-6 dark:divide-white/8 [&>div]:border-[rgba(12,24,36,0.08)] dark:[&>div]:border-white/8">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="border-r border-b px-5 py-4 last:border-r-0 lg:border-b-0"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[#4e6585] dark:text-[#7a8db0]">{kpi.icon}</span>
                <KpiLabel>{kpi.label}</KpiLabel>
              </div>
              <p className="mt-2 text-[20px] font-semibold text-[#091423] tabular-nums dark:text-[#eef4ff]">{kpi.value}</p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <CardHeader
            icon={
              <Bookmark
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            }
            title={t('Asset reuse top')}
            desc={t('Asset reuse top desc')}
          />
          <div className="mt-4 space-y-1">
            <p className="px-1 py-4 text-[12px] text-[#4e6585] dark:text-[#7a8db0]">{t('No reusable assets')}</p>
          </div>
        </Panel>
        <Panel className="p-5">
          <CardHeader
            icon={
              <ImageIcon
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            }
            title={t('Asset type dist')}
            desc={t('Asset type dist desc', { count: workspace.assets.total })}
          />
          <div className="mt-4 space-y-3">
            <EmptyBody text={t('No assets')} />
          </div>
        </Panel>
      </div>
    </div>
  )
}

/** 账单 tab */
function BillingTab({ workspace }: { workspace: Team.Workspace }) {
  const { t } = useT('team')

  const stats = [
    {
      label: t('Success orders'),
      desc: t('Success orders desc'),
      value: workspace.billing.successOrders,
    },
    { label: t('Invoice files'), desc: t('Invoice files desc'), value: workspace.billing.invoices },
    {
      label: t('Last payment'),
      desc: t('Last payment desc'),
      value: workspace.billing.lastPayment,
    },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-4">
        <Panel className="p-5">
          <CardHeader
            icon={
              <CreditCard
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
            }
            title={t('Billing record')}
            desc={t('Billing record desc')}
            right={
              <div className="flex flex-wrap gap-2">
                <GhostButton className="gap-1.5">
                  <Crown
                    aria-hidden
                    className="h-3.5 w-3.5"
                    strokeWidth={1.75}
                  />
                  {t('Manage plan')}
                </GhostButton>
                <button
                  type="button"
                  className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[rgba(12,24,36,0.10)] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(245,249,255,0.9))] px-3 text-[12px] font-medium text-[#2e4268] transition hover:border-[rgba(12,24,36,0.16)] hover:text-[#091423] dark:border-white/10 dark:bg-white/6 dark:text-[#b6c5e0] dark:hover:text-[#eef4ff]"
                >
                  <CreditCard
                    aria-hidden
                    className="h-3.5 w-3.5"
                    strokeWidth={1.75}
                  />
                  {t('Top up')}
                </button>
              </div>
            }
          />
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] p-4 dark:border-white/8 dark:bg-white/4"
              >
                <KpiLabel>{stat.label}</KpiLabel>
                <p className="mt-2 text-[24px] leading-none font-semibold text-[#091423] tabular-nums dark:text-[#eef4ff]">{stat.value}</p>
                <p className="mt-2 text-[11.5px] leading-4 text-[#4e6585] dark:text-[#7a8db0]">{stat.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-[rgba(12,24,36,0.08)] pt-4 dark:border-white/8">
            <h4 className="text-[13px] font-semibold text-[#091423] dark:text-[#eef4ff]">{t('Order records')}</h4>
            <p className="mt-1 text-[12px] text-[#4e6585] dark:text-[#7a8db0]">{t('Order records desc')}</p>
            <p className="mt-3 text-[12.5px] text-[#4e6585] dark:text-[#7a8db0]">{t('No orders')}</p>
          </div>
        </Panel>
      </div>
      <div className="space-y-4">
        <SubscriptionCard workspace={workspace} />
      </div>
    </div>
  )
}

/** 审计 tab(竖排时间线) */
function AuditTab({ workspace }: { workspace: Team.Workspace }) {
  const { t } = useT('team')

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
      <Panel className="p-5">
        <CardHeader
          icon={
            <History
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
          }
          title={t('Audit log')}
          desc={t('Audit log desc')}
          right={<Badge>{workspace.audit.length}</Badge>}
        />
        <ol className="relative mt-4 ml-1 space-y-4 border-l border-[rgba(12,24,36,0.08)] pl-5 dark:border-white/8">
          {workspace.audit.map((entry) => (
            <li
              key={entry.id}
              className="relative"
            >
              <span className="absolute top-1 -left-[27px] flex h-3 w-3 items-center justify-center rounded-full border border-[rgba(12,24,36,0.08)] bg-white dark:border-white/10 dark:bg-[#0b1326]">
                <Sparkles className="h-2 w-2 text-[#4a6080] dark:text-[#8fa5c4]" />
              </span>
              <div className="flex items-start justify-between gap-3">
                <p className="text-[12.5px] leading-5 text-[#2e4268] dark:text-[#b6c5e0]">
                  <span className="font-medium text-[#091423] dark:text-[#eef4ff]">{entry.actor}</span>
                  <span className="mx-1.5 text-[#4e6585] dark:text-[#7a8db0]">·</span>
                  <span>{t(entry.actionKey)}</span>
                  <span className="mx-1.5 text-[#4e6585] dark:text-[#7a8db0]">→</span>
                  <span className="text-[#3d8fb0] dark:text-[#5dafce]">{entry.target}</span>
                </p>
                <span className="shrink-0 text-[11px] text-[#4e6585] tabular-nums dark:text-[#7a8db0]">{relativeTime(entry.createdAt)}</span>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
      <div className="space-y-4">
        <SubscriptionCard workspace={workspace} />
      </div>
    </div>
  )
}

/** 团队详情视图入口(hero + KPI + tabs) */
export function TeamDetailView({ workspace, onSettings, onInvite, onTopUp }: { workspace: Team.Workspace; onSettings: () => void; onInvite: () => void; onTopUp: () => void }) {
  const { t } = useT('team')
  const [tab, setTab] = React.useState<Team.TabId>('overview')
  const [range, setRange] = React.useState<Team.RangeId>('14d')

  const tabs: Array<{ id: Team.TabId; label: string; count?: number }> = [
    { id: 'overview', label: t('Tab overview') },
    { id: 'members', label: t('Tab members'), count: workspace.members.length },
    { id: 'insights', label: t('Tab insights') },
    { id: 'assets', label: t('Tab assets') },
    { id: 'billing', label: t('Tab billing') },
    { id: 'audit', label: t('Tab audit'), count: workspace.audit.length },
  ]

  const ranges: Array<{ id: Team.RangeId; label: string }> = [
    { id: '7d', label: t('7 days') },
    { id: '14d', label: t('14 days') },
    { id: '30d', label: t('30 days') },
  ]

  return (
    <div className="space-y-4">
      <HeroCard
        workspace={workspace}
        onSettings={onSettings}
        onInvite={onInvite}
      />
      <KpiStrip
        workspace={workspace}
        onTopUp={onTopUp}
      />

      {/* tab 条 + 时间范围 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(12,24,36,0.08)] dark:border-white/8">
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                'relative -mb-px flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium transition',
                tab === item.id ? 'text-[#091423] dark:text-[#eef4ff]' : 'text-[#4e6585] hover:text-[#091423] dark:text-[#7a8db0] dark:hover:text-[#eef4ff]',
              )}
            >
              {item.label}
              {item.count ? (
                <span className="rounded-md bg-[rgba(245,249,255,0.95)] px-1.5 py-0.5 text-[10.5px] text-[#4e6585] tabular-nums dark:bg-white/8 dark:text-[#7a8db0]">{item.count}</span>
              ) : null}
              {tab === item.id ? <span className="absolute right-2 bottom-0 left-2 h-px bg-[#5dafce]" /> : null}
            </button>
          ))}
        </div>
        <div className="mb-1 flex items-center gap-1 rounded-md border border-[rgba(12,24,36,0.08)] p-0.5 dark:border-white/8">
          {ranges.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRange(item.id)}
              className={cn(
                'rounded px-2 py-1 text-[11.5px] font-medium tabular-nums transition',
                range === item.id
                  ? 'bg-[rgba(245,249,255,0.95)] text-[#091423] dark:bg-white/10 dark:text-[#eef4ff]'
                  : 'text-[#4e6585] hover:text-[#091423] dark:text-[#7a8db0] dark:hover:text-[#eef4ff]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* tab 内容:左主列 + 右侧栏 */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          {tab === 'overview' ? <OverviewTab workspace={workspace} /> : null}
          {tab === 'members' ? <MembersTab workspace={workspace} /> : null}
          {tab === 'insights' ? <InsightsTab workspace={workspace} /> : null}
          {tab === 'assets' ? <AssetsTab workspace={workspace} /> : null}
          {tab === 'billing' ? <BillingTab workspace={workspace} /> : null}
          {tab === 'audit' ? <AuditTab workspace={workspace} /> : null}
        </div>
        <div className="space-y-4">
          <SubscriptionCard workspace={workspace} />
          <DailyActiveCard
            trend={workspace.trend}
            members={workspace.members.length}
          />
          <SpaceBriefCard />
        </div>
      </div>
    </div>
  )
}

/** PrimaryButton / SendIcon 再导出(page 用) */
export { PrimaryButton }
