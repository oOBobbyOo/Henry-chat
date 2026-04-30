import { useState } from 'react'

export interface UseChatModelsResult {
  /** 模型列表选项 */
  models: Chat.ModelOption[]
  /** 是否正在加载 */
  isLoading: boolean
}

/**
 * 获取可用模型列表 Hook
 */
export function useChatModels(): UseChatModelsResult {
  // 初始状态使用空数组，避免 Hydration 错误
  const [models, setModels] = useState<Chat.ModelOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  return {
    models,
    isLoading,
  }
}
