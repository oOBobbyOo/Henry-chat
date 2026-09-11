/**
 * 资产库(Assets)页领域类型 —— 全局命名空间
 *   - API:/api/v1/assets?scope=owned&limit=48、/api/v1/assets/facets?scope=owned、/api/v1/storage/quota
 *     (参考站登录墙内 401,payload 按 UI 结构对齐构造)
 *   - 工具栏:范围 segment(当前工作区/我收藏的/分享给我/我分享的)+ 搜索 + 类型 pills + 密度 segment
 *   - 时间 pills:全部时间/今天/近 7 天/近 30 天/自定义
 *   - 左侧 200px:快速筛选(系统分类/标签 facets)+ 云空间配额卡
 *   - 结果区:批量操作栏 + 资产网格(紧凑/标准/宽松三档密度)+ 空态
 */
declare namespace Assets {
  /** 资产范围(参考站 scope segment) */
  export type AssetScope = 'workspace' | 'favorites' | 'shared-with-me' | 'shared-by-me'

  /** 资产类型(类型 pills) */
  export type AssetType = 'all' | 'image' | 'video' | 'audio' | '3d'

  /** 网格密度(紧凑/标准/宽松) */
  export type GridDensity = 'compact' | 'standard' | 'comfortable'

  /** 时间筛选 pill 值 */
  export type TimeRange = 'all' | 'today' | '7d' | '30d' | 'custom'

  /** 范围选项 */
  export interface ScopeOption {
    /** 范围 ID */
    id: AssetScope
    /** 展示名(i18n key) */
    labelKey: string
  }

  /** 类型选项 */
  export interface TypeOption {
    /** 类型 ID */
    id: AssetType
    /** 展示名(i18n key) */
    labelKey: string
  }

  /** 密度选项 */
  export interface DensityOption {
    /** 密度 ID */
    id: GridDensity
    /** 展示名(i18n key) */
    labelKey: string
  }

  /** 时间筛选选项 */
  export interface TimeRangeOption {
    /** 时间范围 ID */
    id: TimeRange
    /** 展示名(i18n key) */
    labelKey: string
  }

  /** 快速筛选 facet 项(系统分类 / 标签) */
  export interface FacetItem {
    /** facet 值 */
    id: string
    /** 展示名(i18n key 或原文) */
    labelKey: string
    /** 该分类下资产数 */
    count: number
  }

  /** 快速筛选分组 */
  export interface FacetGroup {
    /** 分组 ID(system-category / tags) */
    id: string
    /** 分组标题(i18n key) */
    labelKey: string
    /** facet 列表 */
    items: FacetItem[]
  }

  /** 云空间配额 */
  export interface StorageQuota {
    /** 已用字节数 */
    usedBytes: number
    /** 总配额字节数 */
    totalBytes: number
  }

  /** 资产条目(结果网格卡) */
  export interface AssetItem {
    /** 资产 ID */
    id: string
    /** 资产名 */
    name: string
    /** 资产类型(image/video/audio/3d) */
    assetType: Exclude<AssetType, 'all'>
    /** 文件格式(JPG/MP4/WAV/GLB…) */
    format: string
    /** 文件大小(字节) */
    sizeBytes: number
    /** 生成模型名 */
    modelName: string
    /** 创建时间(ISO) */
    createdAt: string
    /** 分辨率/尺寸说明(如 2048x2048) */
    dimensions: string
  }

  /** 页面聚合响应(/api/assets/library) */
  export interface LibraryResponse {
    success: boolean
    data: {
      scopes: ScopeOption[]
      types: TypeOption[]
      densities: DensityOption[]
      timeRanges: TimeRangeOption[]
      facets: FacetGroup[]
      storage: StorageQuota
      items: AssetItem[]
    }
  }
}
