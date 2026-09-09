import { NextResponse } from 'next/server'

import { projectsMock } from '@/mock/projects'

/** 技能市场列表, /api/v1/skills/market */
export async function GET() {
  return NextResponse.json<Projects.SkillsResponse>({
    success: true,
    data: { items: projectsMock.skills },
  })
}
