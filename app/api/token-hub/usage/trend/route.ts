import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/usage/trend?days=1&granularity=hour&mine=true
 * 用量趋势(默认按小时聚合最近 24 小时)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = Number(searchParams.get('days') ?? 1)
  const granularity = (searchParams.get('granularity') ?? 'hour') as 'hour' | 'day'
  return NextResponse.json(tokenHubMock.trend(granularity, days))
}
