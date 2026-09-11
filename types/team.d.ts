/**
 * 团队控制台(Team)页领域类型 —— 全局命名空间
 *   - API:/api/v1/workspaces(参考站登录墙内 401 Missing bearer token → payload 按 UI 结构对齐构造)
 *   - 两个视图:无工作区空态(创建引导卡) / 工作区详情(hero + KPI 五联卡 + 6 tab + 右侧订阅/日活/简报栏)
 *   - 三个弹窗:创建工作区(名称+描述) / 邀请成员(链接只读+复制) / 工作区设置(基本信息/所有权/危险操作)
 */
declare namespace Team {
  /** 详情页 tab */
  export type TabId = 'overview' | 'members' | 'insights' | 'assets' | 'billing' | 'audit'

  /** 成员角色(管理员可治理空间 / 制作者可创建 / 只读不能创建) */
  export type MemberRole = 'admin' | 'creator' | 'readonly'

  /** 成员列表筛选 pill(全部 + 三角色) */
  export type MemberFilter = 'all' | MemberRole

  /** 统计时间范围 pill */
  export type RangeId = '7d' | '14d' | '30d'

  /** 图标键(空态引导卡用,组件侧映射 lucide 图标) */
  export type FeatureIcon = 'layout' | 'user' | 'shield' | 'sparkles'

  /** 空态引导特性卡 */
  export interface Feature {
    /** 图标键 */
    icon: FeatureIcon
    /** 标题(i18n key) */
    titleKey: string
    /** 描述(i18n key) */
    descKey: string
  }

  /** 趋势单日数据点(任务量 + 日活成员) */
  export interface TrendPoint {
    /** 日期(MM/DD,tooltip 用) */
    date: string
    /** 柱下角标(D) */
    label: string
    /** 当日任务量 */
    tasks: number
    /** 当日活跃成员数 */
    active: number
  }

  /** 成员 */
  export interface Member {
    /** 成员 ID */
    id: string
    /** 显示名 */
    name: string
    /** 邮箱 */
    email: string
    /** 角色 */
    role: MemberRole
    /** 是否所有者 */
    isOwner: boolean
    /** 加入时间(ISO) */
    joinedAt: string
  }

  /** 待接受邀请 */
  export interface Invite {
    /** 邀请 ID */
    id: string
    /** 发起时间(ISO) */
    createdAt: string
  }

  /** 审计日志条目 */
  export interface AuditEntry {
    /** 条目 ID */
    id: string
    /** 操作人 */
    actor: string
    /** 动作(i18n key) */
    actionKey: string
    /** 动作对象(如工作区名) */
    target: string
    /** 发生时间(ISO) */
    createdAt: string
  }

  /** 团队账单统计 */
  export interface BillingStats {
    /** 成功订单数(含已支付/已授权/退款后) */
    successOrders: number
    /** 票据文件数(Invoice/Receipt/Credit note) */
    invoices: number
    /** 最近付款(无则 —) */
    lastPayment: string
  }

  /** 团队工作区 */
  export interface Workspace {
    /** 工作区 ID */
    id: string
    /** 工作区名称 */
    name: string
    /** 描述(可选) */
    description: string
    /** 席位(已用/总数) */
    seatsUsed: number
    /** 席位总数 */
    seatsTotal: number
    /** 我的角色 */
    myRole: MemberRole
    /** 所有者显示名 */
    ownerName: string
    /** 可用积分 */
    creditsAvailable: number
    /** 订阅积分 */
    creditsSubscribed: number
    /** 赠送积分 */
    creditsGifted: number
    /** 锁定额度 */
    creditsLocked: number
    /** 14 日任务统计 */
    tasks: { total: number; completed: number; failed: number; pendingReview: number }
    /** 资产统计(KPI + 资产 tab 六联) */
    assets: { total: number; produced: number; shared: number; favorited: number; tagged: number; tagCount: number }
    /** 任务通过率(%) */
    passRate: number
    /** 失败率(%) */
    failRate: number
    /** 日均任务 */
    dailyAvg: number
    /** 趋势序列(默认 14 日) */
    trend: TrendPoint[]
    /** 成员列表 */
    members: Member[]
    /** 待接受邀请 */
    invites: Invite[]
    /** 审计日志 */
    audit: AuditEntry[]
    /** 账单统计 */
    billing: BillingStats
    /** 邀请链接 token */
    inviteToken: string
    /** 创建时间(ISO) */
    createdAt: string
  }

  /** 团队控制台聚合响应 */
  export interface ConsoleResponse {
    success: boolean
    data: {
      /** 当前工作区(参考站初始为 null → 空态) */
      workspace: Workspace | null
      /** 空态引导特性卡 */
      features: Feature[]
      /** 创建工作区模板(页面据此本地构造 Workspace) */
      template: Omit<Workspace, 'id' | 'name' | 'description' | 'createdAt' | 'members' | 'invites' | 'audit'>
    }
  }
}
