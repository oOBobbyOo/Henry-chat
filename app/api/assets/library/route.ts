import { NextResponse } from 'next/server'

import { assetsMock } from '@/mock/assets'

/** 资产库聚合数据(契约参考 syna.art /api/v1/assets + facets + storage/quota,登录墙内 401 → 结构对齐 mock) */
export async function GET() {
  return NextResponse.json<Assets.LibraryResponse>({
    success: true,
    data: {
      scopes: assetsMock.scopes,
      types: assetsMock.types,
      densities: assetsMock.densities,
      timeRanges: assetsMock.timeRanges,
      facets: assetsMock.facets,
      storage: assetsMock.storage,
      items: assetsMock.items,
    },
  })
}
