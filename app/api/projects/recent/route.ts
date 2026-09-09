import { NextResponse } from 'next/server'

import { projectsMock } from '@/mock/projects'

/** 最近项目列表(本地会话态,未登录为空), /api/v1/app/projects */
export async function GET() {
  return NextResponse.json<Projects.RecentResponse>({
    success: true,
    data: { items: projectsMock.recentProjects },
  })
}
