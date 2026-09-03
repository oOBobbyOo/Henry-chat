import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/reports/summary?days=30
 * 成本分析核心指标(默认统计范围: 当月)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = Number(searchParams.get('days') ?? 30)
  return NextResponse.json(tokenHubMock.costSummary(days))
}
