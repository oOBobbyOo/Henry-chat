import { NextResponse } from 'next/server'

import { tokenHubMock } from '@/mock/token-hub'

/**
 * GET /api/token-hub/me/balance
 * 账户余额与配额信息
 */
export async function GET() {
  return NextResponse.json(tokenHubMock.balance)
}
