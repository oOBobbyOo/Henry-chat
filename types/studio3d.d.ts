/**
 * 3D 建模(Studio 3D)页领域类型 —— 全局命名空间
 *   - 左侧能力导航 7 项(纹理生成及之后为禁用态)+ DCC Bridge 入口
 *   - 中部控制面板:模型选择下拉 / 文生·图生·多视图三 tab / 纹理·几何参数 / 高级参数折叠区
 *   - 右侧资产面板:我的资产 / 公共资源 tabs + 上传卡(登录墙内 API 401,数据为结构对齐 mock)
 */
declare namespace Studio3d {
  /** 生成输入方式 tab */
  export type InputMode = 'text' | 'image' | 'multiview'

  /** 左侧能力项(只有「模型生成」可用,其余按参考站为禁用占位) */
  export interface Capability {
    /** 能力 ID */
    id: string
    /** 展示名(i18n key) */
    nameKey: string
    /** 悬停说明(i18n key,含端点语义) */
    titleKey: string
    /** 是否可用 */
    enabled: boolean
  }

  /** 3D 生成模型选项(下拉) */
  export interface ModelOption {
    /** 模型 ID */
    id: string
    /** 供应方显示名 */
    provider: string
    /** 模型显示名 */
    displayName: string
    /** 徽标:New / 无 */
    badge: 'new' | null
    /** 是否推荐 */
    recommended: boolean
    /** 单次生成积分 */
    credits: number
  }

  /** 纹理质量选项 */
  export interface TextureQualityOption {
    /** 选项值(2K/4K/8K) */
    value: string
    /** 悬停说明 */
    hint: string
  }

  /** 几何质量选项 */
  export interface GeometryQualityOption {
    /** 选项值(标准/超清) */
    value: string
    /** 是否额外计费 */
    extraCost: boolean
  }

  /** 拓扑选项 */
  export interface TopologyOption {
    /** 选项值(quad / triangle) */
    value: 'quad' | 'triangle'
    /** 展示名(i18n key) */
    labelKey: string
  }

  /** 高级参数中的纹理对齐 */
  export type TextureAlignment = 'original_image' | 'geometry'

  /** 高级参数中的模型朝向 */
  export type ModelOrientation = 'default' | 'align_image'

  /** 资产面板 tab */
  export type AssetScope = 'mine' | 'public'

  /** 资产条目(右侧面板网格卡) */
  export interface AssetItem {
    /** 资产 ID */
    id: string
    /** 资产名 */
    name: string
    /** 格式(GLB/FBX/OBJ/STL) */
    format: string
    /** 面数(千面) */
    faceCountK: number
    /** 是否公共资源 */
    isPublic: boolean
  }

  /** config 接口响应 */
  export interface ConfigResponse {
    success: boolean
    data: {
      capabilities: Capability[]
      models: ModelOption[]
      textureQualities: TextureQualityOption[]
      geometryQualities: GeometryQualityOption[]
      topologies: TopologyOption[]
    }
  }

  /** assets 接口响应 */
  export interface AssetsResponse {
    success: boolean
    data: {
      items: AssetItem[]
    }
  }
}
