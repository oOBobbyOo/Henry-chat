import { useQuery } from '@tanstack/react-query'

import { request } from '@/lib/request'

/**
 * 3D 建模(Studio 3D)页服务层
 * 数据走本地 API 路由(mock)
 */
export const Studio3dService = {
  /** 能力导航 + 模型 + 参数字典 */
  getConfig: () =>
    request.get<Studio3d.ConfigResponse>('/api/studio3d/config', {
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }),
  /** 资产列表(我的资产 + 公共资源) */
  getAssets: () =>
    request.get<Studio3d.AssetsResponse>('/api/studio3d/assets', {
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }),
}

export const STUDIO_3D_QUERY_KEYS = {
  config: ['studio3d-config'],
  assets: ['studio3d-assets'],
}

/** 能力/模型/参数配置查询(非阻塞) */
export function useStudio3dConfigQuery() {
  return useQuery({
    queryKey: STUDIO_3D_QUERY_KEYS.config,
    queryFn: Studio3dService.getConfig,
    staleTime: 10 * 60 * 1000,
  })
}

/** 资产列表查询(非阻塞) */
export function useStudio3dAssetsQuery() {
  return useQuery({
    queryKey: STUDIO_3D_QUERY_KEYS.assets,
    queryFn: Studio3dService.getAssets,
    staleTime: 1 * 60 * 1000,
  })
}
