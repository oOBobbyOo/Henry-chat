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

  /** 质量档位选项 */
  export interface QualityTierOption {
    /** 档位值(standard / high / ultra) */
    value: string
    /** 显示名(i18n key) */
    labelKey: string
  }

  /** 生成背景选项 */
  export interface BackgroundOption {
    /** 背景值(auto / transparent / opaque) */
    value: string
    /** 显示名(i18n key) */
    labelKey: string
  }

  /** 输出压缩档位选项 */
  export interface CompressionOption {
    /** 档位值(high / balanced / small) */
    value: string
    /** 显示名(i18n key) */
    labelKey: string
  }

  /** 视频创作模式 */
  export type VideoCreateMode = 't2v' | 'first-last-frame' | 'omni-reference'

  /** 视频分辨率档位 */
  export interface VideoResolutionOption {
    /** 档位名(480P / 720P / 1080P) */
    value: string
  }

  /** 视频时长档位 */
  export interface VideoDurationOption {
    /** 秒数 */
    seconds: number
  }

  /** 视频生成能力配置(切到视频生成时下发) */
  export interface VideoCapabilityConfig {
    /** 模型列表 */
    models: ModelOption[]
    /** 创作模式字典 */
    createModes: Array<{ value: VideoCreateMode; labelKey: string }>
    /** 分辨率字典 */
    resolutions: VideoResolutionOption[]
    /** 画幅比例字典(自动 + 固定档) */
    aspectRatios: AspectRatioOption[]
    /** 时长字典 */
    durations: VideoDurationOption[]
  }

  /** 音效生成配置 */
  export interface SoundCapabilityConfig {
    /** 生成方式(文生音效/视频生音效/视频配音效) */
    generateModes: string[]
    /** 目标时长选项(秒) */
    durations: number[]
    /** 输出格式 */
    formats: string[]
  }

  /** 音乐生成配置 */
  export interface MusicCapabilityConfig {
    /** 音乐模型列表 */
    models: ModelOption[]
    /** 创作形态(歌词成曲/纯音乐) */
    forms: string[]
    /** 采样率 */
    sampleRates: string[]
    /** 比特率 */
    bitrates: string[]
    /** 输出格式 */
    formats: string[]
  }

  /** 配音生成配置 */
  export interface VoiceCapabilityConfig {
    /** 语音模型列表 */
    models: ModelOption[]
    /** 音色 */
    voices: string[]
    /** 输出格式 */
    formats: string[]
    /** 采样率 */
    sampleRates: string[]
    /** Opus 码率(仅 Opus 支持) */
    opusBitrates: string[]
    /** 目标语言 */
    languages: string[]
  }

  /** 图片编辑:编辑工具(badge: 新功能) */
  export interface ImageEditCapabilityConfig {
    /** 编辑工具列表 */
    tools: string[]
  }

  /** 视频超分配置 */
  export interface VideoUpscaleCapabilityConfig {
    /** 超分模型 */
    models: ModelOption[]
    /** 放大倍率 */
    scales: string[]
    /** 目标帧率 */
    frameRates: string[]
  }

  /** 视频去背景配置 */
  export interface VideoRemoveBgCapabilityConfig {
    /** 输出背景 */
    outputs: string[]
  }

  /** 视频对口型配置 */
  export interface LipsyncCapabilityConfig {
    /** 对齐模型(Sync LipSync / Kling LipSync) */
    models: string[]
    /** 对齐模式(截断/循环补齐/往返补齐/静音补齐/时长重映射) */
    alignModes: string[]
  }

  /** 数字人像生成参数 */
  export interface DigitalHumanCapabilityConfig {
    /** 分辨率(1080p≤30s / 720p≤60s) */
    resolutions: string[]
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
      /** 质量档位字典 */
      qualityTiers: QualityTierOption[]
      /** 生成背景字典 */
      backgrounds: BackgroundOption[]
      /** 输出压缩档位字典 */
      compressions: CompressionOption[]
      /** 视频生成能力配置 */
      video: VideoCapabilityConfig
      /** 音效生成配置 */
      sound: SoundCapabilityConfig
      /** 音乐生成配置 */
      music: MusicCapabilityConfig
      /** 配音生成配置 */
      voice: VoiceCapabilityConfig
      /** 图片编辑配置 */
      imageEdit: ImageEditCapabilityConfig
      /** 视频超分配置 */
      videoUpscale: VideoUpscaleCapabilityConfig
      /** 视频去背景配置 */
      videoRemoveBg: VideoRemoveBgCapabilityConfig
      /** 视频对口型配置 */
      lipsync: LipsyncCapabilityConfig
      /** 数字人像配置 */
      digitalHuman: DigitalHumanCapabilityConfig
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
