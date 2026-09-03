import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/me/balance/transactions?page=1&page_size=10
 * 余额明细(分页,对齐生产 1410 笔 / 每页 10 条)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = Number(searchParams.get('page_size') ?? 10)
  return NextResponse.json(tokenHubMock.balanceTransactions(page, pageSize))
}
