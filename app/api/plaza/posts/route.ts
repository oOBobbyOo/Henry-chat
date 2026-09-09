import { NextResponse } from 'next/server'

import { plazaMock } from '@/mock/plaza'

/** 社区作品列表(瀑布流), /api/v1/community/posts */
export async function GET() {
  return NextResponse.json<Plaza.PostsResponse>({
    success: true,
    data: { items: plazaMock.posts },
  })
}
