import { NextResponse } from 'next/server'

import { studio3dMock } from '@/mock/studio3d'

/** 能力导航 + 模型 + 参数字典 */
export async function GET() {
  return NextResponse.json<Studio3d.ConfigResponse>({
    success: true,
    data: {
      capabilities: studio3dMock.capabilities,
      models: studio3dMock.models,
      textureQualities: studio3dMock.textureQualities,
      geometryQualities: studio3dMock.geometryQualities,
      topologies: studio3dMock.topologies,
    },
  })
}
