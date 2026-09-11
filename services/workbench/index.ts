import { useQuery } from '@tanstack/react-query'

import { request } from '@/lib/request'

/**
 * 创作工坊(Workbench)页服务层
 * 数据走本地 API 路由(mock)
 */
export const WorkbenchService = {
  /** 能力导航 + 模型 + 参数字典 */
  getConfig: () => request.get<Workbench.ConfigResponse>('/api/workbench/config', { baseURL: process.env.NEXT_PUBLIC_HOST_URL }),
  /** 创作历史 */
  getHistory: () => request.get<Workbench.HistoryResponse>('/api/workbench/history', { baseURL: process.env.NEXT_PUBLIC_HOST_URL }),
  /** 空态社群灵感卡 */
  getCommunity: () => request.get<Workbench.CommunityResponse>('/api/workbench/community', { baseURL: process.env.NEXT_PUBLIC_HOST_URL }),
}

export const WORKBENCH_QUERY_KEYS = {
  config: ['workbench-config'],
  history: ['workbench-history'],
  community: ['workbench-community'],
}

/** 能力/模型/参数配置查询(非阻塞) */
export function useWorkbenchConfigQuery() {
  return useQuery({
    queryKey: WORKBENCH_QUERY_KEYS.config,
    queryFn: WorkbenchService.getConfig,
    staleTime: 10 * 60 * 1000,
  })
}

/** 创作历史查询(非阻塞) */
export function useWorkbenchHistoryQuery() {
  return useQuery({
    queryKey: WORKBENCH_QUERY_KEYS.history,
    queryFn: WorkbenchService.getHistory,
    staleTime: 1 * 60 * 1000,
  })
}

/** 社群灵感卡查询(非阻塞) */
export function useWorkbenchCommunityQuery() {
  return useQuery({
    queryKey: WORKBENCH_QUERY_KEYS.community,
    queryFn: WorkbenchService.getCommunity,
    staleTime: 10 * 60 * 1000,
  })
}
