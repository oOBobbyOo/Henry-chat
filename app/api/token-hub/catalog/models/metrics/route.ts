import { NextResponse } from 'next/server'

import { catalogMock } from '@/mock/token-hub-catalog'

/**
 * GET /api/token-hub/catalog/models/metrics?minutes=30
 * 模型近 30 分钟性能指标(请求数 / 延迟 / 吞吐 / 可用率)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const minutes = Number(searchParams.get('minutes') ?? 30)
  return NextResponse.json<TokenHub.CatalogMetricsResponse>(catalogMock.metrics(minutes))
}
