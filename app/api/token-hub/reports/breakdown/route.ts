import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/reports/breakdown?by=model
 * 成本构成(按模型 / 供应商 / API Key / 客户端)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const by = (searchParams.get('by') ?? 'model') as TokenHub.CostBreakdownBy
  return NextResponse.json(tokenHubMock.costBreakdown(by))
}
