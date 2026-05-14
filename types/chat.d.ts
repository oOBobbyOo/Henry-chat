declare namespace Chat {
  /**
   * 模型配置接口
   * 包含调用 AI 模型所需的所有参数配置
   */
  export interface ModelConfig {
    /** 模型唯一标识符 */
    id: string
    /** 模型名称，用于显示 */
    modelName: string
    /** 最大生成 Token 数量 (1-32768, 默认 1024) */
    maxTokens: number
    /** 温度参数：控制输出的随机性 (0-2, 默认 1) */
    temperature: number
    /** Top-P 参数：核采样，控制候选词的概率质量 */
    topP: number
    /** 是否启用思维链（Chain of Thought） */
    enableThinking: boolean
    /** 思维预算：分配给推理思考的 Token 数量 */
    thinkingBudget: number
    /** 是否启用联网搜索（启用后会先搜索相关网页内容） */
    enableWebSearch: boolean
    /** 系统提示词：用于设定 AI 的角色 and 行为 */
    systemPrompt: string
    /** Top-k 采样参数 */
    topK: number
    /** 频率惩罚参数 (-2.0 到 2.0) */
    frequencyPenalty: number
    /** 最小概率参数 (0-1) */
    minP: number
    /** 停止序列 */
    stop: string[]
    /** 生成结果数量 */
    n: number
  }

  /** 配置更新函数类型，供 ConfigPanel 等调用方使用 */
  export type UpdateConfigFn = <K extends keyof ModelConfig>(key: K, value: ModelConfig[K]) => void

  /** 可选模型列表 */
  export interface ModelOption {
    value: string
    label: string
  }

  /** 模型 */
  export interface Model {
    /** 创建时间 */
    created: Date
    /** 模型 ID */
    id: string
  }

  /** 模型列表接口 */
  export interface ModelsResponse {
    /** 是否请求成功 */
    success: boolean
    /** 模型列表 */
    data: Model[]
  }

  /** 快捷问题接口 */
  export interface QuickQuestion {
    id: string
    text: string
  }

  /**
   * 聊天会话接口
   * 用于历史记录管理
   */
  export interface Session {
    /** 会话唯一标识符 */
    id: string
    /** 会话标题 */
    title: string
    /** 创建时间 */
    createdAt: Date
    /** 最后一条消息时间 */
    lastMessageAt: Date
    /** 消息数量 */
    messageCount: number
  }

  /** 会话列表状态接口 */
  export interface SessionState {
    sessions: Session[]
    hasMore: boolean
    page: number
  }

  /** 聊天请求参数 */
  export interface CompletionRequestBody {
    /** 模型名称  */
    model: string
    /** 消息列表 */
    messages: Array<{
      /** 消息角色：user, assistant, system */
      role: MessageRole
      /** 消息内容 */
      content: string
    }>
  }

  /** 聊天消息角色 */
  export type MessageRole = 'user' | 'assistant' | 'system'

  /** 聊天消息接口 */
  export interface Message {
    /** 消息唯一标识符 */
    id: string
    /** 消息角色 */
    role: MessageRole
    /** 消息内容 */
    content: string
    /** 推理内容（深度思考模式） */
    reasoningContent?: string
    /** 创建时间 */
    createdAt: Date
    /** 是否正在流式加载中 */
    isStreaming?: boolean
    /** 图片 URL（文生图模式） */
    imageUrl?: string
    /** 图片尺寸（文生图模式） */
    imageSize?: string
  }

  /** 聊天状态 */
  export type Status = 'idle' | 'loading' | 'streaming' | 'error'

  /** 聊天状态接口 */
  export interface State {
    /** 当前状态 */
    status: Status
    /** 消息列表 */
    messages: Message[]
    /** 错误信息 */
    error?: string
  }
}
