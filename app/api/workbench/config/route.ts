import { NextResponse } from 'next/server'

import { workbenchMock } from '@/mock/workbench'

/** 能力导航 + 模型 + 参数字典 */
export async function GET() {
  return NextResponse.json<Workbench.ConfigResponse>({
    success: true,
    data: {
      capabilities: workbenchMock.capabilities,
      models: workbenchMock.models,
      aspectRatios: workbenchMock.aspectRatios,
      resolutions: workbenchMock.resolutions,
      formats: workbenchMock.formats,
    },
  })
}
