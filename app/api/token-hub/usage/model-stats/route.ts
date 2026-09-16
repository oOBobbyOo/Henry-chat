import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/usage/model-stats?days=7&model=DeepSeek%20V4%20Flash&provider=ZenMux&client=Claude%20Code
 * 按模型聚合的表现明细(用量分析 —— 模型表现表格)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = Number(searchParams.get('days') ?? 7)
  const model = searchParams.get('model')
  const provider = searchParams.get('provider')
  const client = searchParams.get('client')

  const { items } = tokenHubMock.modelStats(days)
  const filtered = items.filter(
    (item) =>
      (!model || item.model === model) &&
      (!provider || item.provider === provider) &&
      (!client || item.client === client),
  )

  return NextResponse.json({ days, items: filtered })
}
