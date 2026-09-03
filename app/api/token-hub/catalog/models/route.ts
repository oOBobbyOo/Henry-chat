import { NextResponse } from 'next/server'

import { catalogMock } from '@/mock/token-hub-catalog'

/**
 * GET /api/token-hub/catalog/models
 * 模型目录(模型广场) —— 返回全部可调用模型与价格配置
 */
export async function GET() {
  return NextResponse.json<TokenHub.CatalogResponse>({
    pricing: catalogMock.pricing,
    items: catalogMock.models,
  })
}
