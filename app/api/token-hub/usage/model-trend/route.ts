import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/usage/model-trend?days=1&granularity=hour&mine=true
 * 按模型统计的用量趋势(图例 + 逐窗口各模型 tokens)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = Number(searchParams.get('days') ?? 1)
  const granularity = (searchParams.get('granularity') ?? 'hour') as 'hour' | 'day'
  return NextResponse.json(tokenHubMock.modelTrend(granularity, days))
}
