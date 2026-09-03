import { NextResponse } from 'next/server'

import { keysMock } from '@/mock/token-hub-keys'

/**
 * GET /api/token-hub/keys/service-accounts
 * 服务账号列表(用于游戏、网站等线上应用)
 */
export async function GET() {
  return NextResponse.json<TokenHub.ServiceAccountsResponse>({ items: keysMock.serviceAccounts })
}
