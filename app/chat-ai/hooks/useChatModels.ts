import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { isValidArray } from '@/lib/is'
import { ChatService } from '@/services/chat'

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

  const { data, isLoading } = useQuery({ queryKey: ['models'], queryFn: ChatService.getModels })

  useEffect(() => {
    if (data?.success && isValidArray(data?.data)) {
      const modelsData = data.data.map((model) => ({
        label: model.id,
        value: model.id,
      }))

      setModels(modelsData)
    }
  }, [data])

  return {
    models,
    isLoading,
  }
}
