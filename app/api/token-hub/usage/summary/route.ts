import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/usage/summary?days=1&mine=true
 * 用量汇总统计(默认最近 24 小时)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = Number(searchParams.get('days') ?? 1)
  return NextResponse.json(tokenHubMock.summary(days))
}
