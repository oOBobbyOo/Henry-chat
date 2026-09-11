import { NextResponse } from 'next/server'

import { workbenchMock } from '@/mock/workbench'

/** 空态社群灵感卡(/api/v1/community/posts) */
export async function GET() {
  return NextResponse.json<Workbench.CommunityResponse>({
    success: true,
    data: { items: workbenchMock.communityCases },
  })
}
