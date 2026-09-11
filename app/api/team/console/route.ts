import { NextResponse } from 'next/server'

import { teamMock } from '@/mock/team'

/** 团队控制台聚合数据(/api/v1/workspaces,登录墙内 401 → 结构对齐 mock) */
export async function GET() {
  return NextResponse.json<Team.ConsoleResponse>({
    success: true,
    data: {
      workspace: null,
      features: teamMock.features,
      template: teamMock.template,
    },
  })
}
