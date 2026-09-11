/**
 * 创作工坊(Workbench)页领域类型 —— 全局命名空间
 * workbench:左侧功能导航 + 中部控制面板 + 右侧创作历史
 */
declare namespace Workbench {
  /** 功能能力类别(创作/编辑两组) */
  export type CapabilityGroup = 'create' | 'edit'

  /** 生成资产模态(对应历史 tab 与能力分类) */
  export type AssetModality = 'image' | 'video' | 'sound' | 'music' | 'voice'

  /** 功能徽标类型 */
  export type CapabilityBadge = 'new' | 'hot' | null

  /** 左侧导航功能项(一个 tab) */
  export interface Capability {
    /** 功能 ID */
    id: string
    /** 所属分组:创作 / 编辑 */
    group: CapabilityGroup
    /** 展示名(i18n key) */
    nameKey: string
    /** 对应资产模态 */
    modality: AssetModality
    /** 徽标:New / Hot / 无 */
    badge: CapabilityBadge
  }

  /** 生成模型选项(下拉) */
  export interface ModelOption {
    /** 模型 ID */
    id: string
    /** 供应方显示名 */
    provider: string
    /** 模型显示名 */
    displayName: string
    /** 一句话描述 */
    description: string
    /** 徽标:New / Hot / 无 */
    badge: CapabilityBadge
    /** 是否推荐 */
    recommended: boolean
    /** 单次生成积分 */
    credits: number
  }

  /** 宽高比选项 */
  export interface AspectRatioOption {
    /** 比例值(如 1:1) */
    value: string
    /** 宽(基准短边 1024) */
    width: number
    /** 高 */
    height: number
  }

  /** 分辨率档位 */
  export interface ResolutionOption {
    /** 档位名(1K / 2K / 4K) */
    value: string
    /** 基准边长 */
    base: number
  }

  /** 输出格式选项 */
  export interface FormatOption {
    /** 格式值(JPEG / PNG) */
    value: string
    /** 质量档位名(标准格式 / 高质量) */
    qualityLabel: string
  }

  /** 素材上传项 */
  export interface ReferenceAsset {
    /** 素材 ID */
    id: string
    /** 图片 URL */
    url: string
    /** 文件名 */
    name: string
  }

  /** 创作历史记录条目 */
  export interface HistoryItem {
    /** 记录 ID */
    id: string
    /** 资产模态 */
    modality: AssetModality
    /** 提示词/标题 */
    title: string
    /** 生成模型显示名 */
    modelName: string
    /** 结果封面 URL */
    coverUrl: string
    /** 视频时长(秒,仅视频) */
    durationSeconds?: number
    /** 是否精选 */
    featured: boolean
    /** 创建时间(ISO) */
    createdAt: string
  }

  /** 社群灵感卡(空态推荐) */
  export interface CommunityCase {
    /** 卡片 ID */
    id: string
    /** 资产模态 */
    modality: AssetModality
    /** 标题 */
    title: string
    /** 封面 URL */
    coverUrl: string
    /** 视频时长(秒,仅视频) */
    durationSeconds?: number
    /** 是否精选 */
    featured: boolean
  }

  /** GET /api/workbench/config 响应(能力 + 模型 + 参数字典) */
  export interface ConfigResponse {
    success: boolean
    data: {
      /** 左侧功能导航 */
      capabilities: Capability[]
      /** 当前功能(图片生成)的模型列表 */
      models: ModelOption[]
      /** 宽高比字典 */
      aspectRatios: AspectRatioOption[]
      /** 分辨率字典 */
      resolutions: ResolutionOption[]
      /** 输出格式字典 */
      formats: FormatOption[]
    }
  }

  /** GET /api/workbench/history 响应 */
  export interface HistoryResponse {
    success: boolean
    data: {
      items: HistoryItem[]
    }
  }

  /** GET /api/workbench/community 响应(空态社群推荐) */
  export interface CommunityResponse {
    success: boolean
    data: {
      items: CommunityCase[]
    }
  }

  /** 历史时间筛选 */
  export type HistoryRange = 'all' | 'today' | '7d' | '30d'

  /** 历史视图模式 */
  export type HistoryView = 'cards' | 'board'
}
