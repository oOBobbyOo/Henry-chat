/**
 * 团队控制台(Team)页 —— 本地 Mock 数据源
 *   - API:/api/v1/workspaces(参考站登录墙内 401 Missing bearer token → payload 按 UI 结构对齐构造)
 *   - 参考站初始无工作区(workspace: null)→ 空态;本地 template 供创建 dialog 构造工作区
 *   - 文案逐字对齐参考站(创建你的第一个团队工作区 / 与队友共享 / 权限与审计 / 默认 Team Free ...)
 */

/** 空态引导特性卡(顺序对齐参考站) */
const features: Team.Feature[] = [
  { icon: 'user', titleKey: 'Share with teammates', descKey: 'Share with teammates desc' },
  { icon: 'shield', titleKey: 'Roles & audit', descKey: 'Roles & audit desc' },
  { icon: 'sparkles', titleKey: 'Team Free by default', descKey: 'Team Free by default desc' },
]

/** 工作区模板(创建 dialog 提交后据此本地构造 Workspace) */
const template = {
  seatsUsed: 1,
  seatsTotal: 3,
  myRole: 'admin' as const,
  ownerName: 'Bobby Henry',
  creditsAvailable: 3,
  creditsSubscribed: 3,
  creditsGifted: 0,
  creditsLocked: 0,
  tasks: { total: 0, completed: 0, failed: 0, pendingReview: 0 },
  assets: { total: 0, produced: 0, shared: 0, favorited: 0, tagged: 0, tagCount: 0 },
  passRate: 0,
  failRate: 0,
  dailyAvg: 0,
  trend: [],
  members: [],
  invites: [],
  audit: [],
  billing: { successOrders: 0, invoices: 0, lastPayment: '—' },
  inviteToken: '_B7iRshUUqjqSu948IxsjQXN-qLub8FWT9csC9wK_yw',
}

export const teamMock = {
  features,
  template,
}
