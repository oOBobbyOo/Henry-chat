import { useQuery } from '@tanstack/react-query'

import { request } from '@/lib/request'

/**
 * 资产库(Assets)页服务层
 * 数据走本地 API 路由(mock),契约参考 syna.art /assets
 */
export const AssetsService = {
  /** 资产库聚合:选项字典 + facets + 云空间 + 资产列表 */
  getLibrary: () =>
    request.get<Assets.LibraryResponse>('/api/assets/library', {
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }),
}

export const ASSETS_QUERY_KEYS = {
  library: ['assets-library'],
}

/** 资产库聚合查询(非阻塞) */
export function useAssetsLibraryQuery() {
  return useQuery({
    queryKey: ASSETS_QUERY_KEYS.library,
    queryFn: AssetsService.getLibrary,
    staleTime: 1 * 60 * 1000,
  })
}
