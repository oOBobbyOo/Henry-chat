/**
 * 广场(Plaza)领域类型 —— 全局命名空间
 */
declare namespace Plaza {
  /** 作品资产类型 */
  export type AssetType = 'image' | 'video' | '3d'

  /** 社区作品卡(瀑布流条目) */
  export interface Post {
    /** 作品 ID */
    id: string
    /** 作品标题(通常为 prompt 摘要) */
    title: string
    /** 标签列表(原始 tag key) */
    tags: string[]
    /** 资产类型:图片 / 视频 / 3D */
    assetType: AssetType
    /** 封面缩略图 URL */
    thumbnailUrl: string
    /** 原始媒体 URL(视频为 mp4,可为空) */
    mediaUrl: string | null
    /** 资产展示名(模型侧文件名) */
    displayName: string | null
    /** 资产宽度(px) */
    width: number
    /** 资产高度(px) */
    height: number
    /** 是否官方精选 */
    isStaffPick: boolean
    /** 生成模型名 */
    modelName: string | null
  }

  /** Agent 技能卡(技能横滑区条目) */
  export interface Skill {
    /** 技能 ID */
    id: string
    /** 技能 slug */
    slug: string
    /** 技能名 */
    displayName: string
    /** 技能一句话描述 */
    description: string
    /** 技能封面图 URL */
    coverUrl: string
    /** 是否精选(带 ★) */
    featured: boolean
  }

  /** 热门标签(分类筛选条条目) */
  export interface Tag {
    /** 标签 key */
    tag: string
    /** 使用次数 */
    count: number
  }

  /** /api/plaza/posts 响应 */
  export interface PostsResponse {
    success: boolean
    data: {
      items: Post[]
    }
  }

  /** /api/plaza/skills 响应 */
  export interface SkillsResponse {
    success: boolean
    data: {
      items: Skill[]
    }
  }

  /** /api/plaza/tags 响应 */
  export interface TagsResponse {
    success: boolean
    data: {
      items: Tag[]
    }
  }

  /** 本地 Mock 数据整体结构 */
  export interface MockData {
    posts: Post[]
    skills: Skill[]
    tags: Tag[]
  }
}
