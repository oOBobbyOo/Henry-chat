import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/me
 * 当前登录用户信息
 */
export async function GET() {
  return NextResponse.json(tokenHubMock.profile)
}
