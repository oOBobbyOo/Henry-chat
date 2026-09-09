import { NextResponse } from 'next/server'

import { plazaMock } from '@/mock/plaza'

/** Agent 技能列表, /api/v1/skills/market */
export async function GET() {
  return NextResponse.json<Plaza.SkillsResponse>({
    success: true,
    data: { items: plazaMock.skills },
  })
}
