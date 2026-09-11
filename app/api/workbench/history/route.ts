import { NextResponse } from 'next/server'

import { workbenchMock } from '@/mock/workbench'

/** 创作历史列表(本地会话态,初始为空 = 展示空态 + 社群推荐) */
export async function GET() {
  return NextResponse.json<Workbench.HistoryResponse>({
    success: true,
    data: { items: workbenchMock.history },
  })
}
