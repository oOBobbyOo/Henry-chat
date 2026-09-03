import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/reports/trend?granularity=month&days=365
 * 成本走势(支持 day / week / month / year 粒度,默认按月)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const granularity = (searchParams.get('granularity') ?? 'month') as 'day' | 'week' | 'month' | 'year'
  const days = Number(searchParams.get('days') ?? 365)
  return NextResponse.json(tokenHubMock.costTrend(granularity, days))
}
