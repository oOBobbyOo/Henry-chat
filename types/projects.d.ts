/**
 * 项目(Projects)页领域类型 —— 全局命名空间
 */
declare namespace Projects {
  /** 技能市场分类(market_category) */
  export type MarketCategory = 'drama' | 'ecommerce' | 'game' | 'design' | 'general'

  /** 技能市场卡(技能市场条目) */
  export interface Skill {
    /** 技能 ID */
    id: string
    /** 技能 slug */
    slug: string
    /** 技能名 */
    displayName: string
    /** 技能一句话描述 */
    description: string
    /** 技能市场分类 */
    marketCategory: MarketCategory
    /** 是否精选(带 ★) */
    featured: boolean
    /** 技能封面图 URL */
    coverUrl: string
  }

  /** 最近项目条目(本地会话态) */
  export interface RecentProject {
    /** 项目 ID */
    id: string
    /** 项目名 */
    name: string
    /** 项目封面图 URL(可空,空则展示占位) */
    coverUrl: string | null
    /** 最近打开时间 */
    updatedAt: string
  }

  /** /api/projects/skills 响应 */
  export interface SkillsResponse {
    success: boolean
    data: {
      items: Skill[]
    }
  }

  /** /api/projects/recent 响应 */
  export interface RecentResponse {
    success: boolean
    data: {
      items: RecentProject[]
    }
  }

  /** 本地 Mock 数据整体结构 */
  export interface MockData {
    recentProjects: RecentProject[]
    skills: Skill[]
  }
}
