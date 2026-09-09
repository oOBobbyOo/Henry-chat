import { NextResponse } from 'next/server'

import { plazaMock } from '@/mock/plaza'

/** 热门标签列表, /api/v1/community/popular-tags */
export async function GET() {
  return NextResponse.json<Plaza.TagsResponse>({
    success: true,
    data: { items: plazaMock.tags },
  })
}
