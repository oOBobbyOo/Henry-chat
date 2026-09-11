import { NextResponse } from 'next/server'

import { studio3dMock } from '@/mock/studio3d'

/** 资产列表(我的资产 + 公共资源,契约参考 syna.art /api/v1/assets?asset_type=3d) */
export async function GET() {
  return NextResponse.json<Studio3d.AssetsResponse>({
    success: true,
    data: {
      items: studio3dMock.assets,
    },
  })
}
