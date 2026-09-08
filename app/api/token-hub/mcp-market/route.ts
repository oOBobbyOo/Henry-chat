import { NextResponse } from 'next/server'

import { mcpMarketMock } from '@/mock/mcp-market'

/**
 * GET /api/token-hub/mcp-market?price=free&credential=platform&status=active&q=搜索词
 * MCP 市场服务列表(支持价格 / 凭据 / 状态 / 关键字筛选)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = {
    price: searchParams.get('price') ?? 'all',
    credential: searchParams.get('credential') ?? 'all',
    status: searchParams.get('status') ?? 'all',
    q: searchParams.get('q') ?? '',
  }
  return NextResponse.json(mcpMarketMock.list(filters))
}

/**
 * POST /api/token-hub/mcp-market
 * 启用 / 禁用 MCP 服务(body: { service_id, enabled })
 */
export async function POST(request: Request) {
  const body = (await request.json()) as { service_id: string; enabled: boolean }
  const result = mcpMarketMock.enable(body.service_id, body.enabled)
  return NextResponse.json(result)
}
