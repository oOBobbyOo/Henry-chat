import { NextResponse } from 'next/server'

import { keysMock } from '@/mock/token-hub-keys'

/**
 * GET /api/token-hub/keys?mine=true
 * 个人 API Key 列表
 */
export async function GET() {
  return NextResponse.json<TokenHub.ApiKeysResponse>({ items: keysMock.keys })
}

/**
 * POST /api/token-hub/keys
 * 创建 API Key —— 本地 mock: 生成前缀并插入列表头部
 */
export async function POST(request: Request) {
  const body = (await request.json()) as TokenHub.CreateApiKeyBody
  const name = body.name?.trim() || '未命名 Key'
  const now = new Date()
  const prefix = `sk-${Math.random().toString(36).slice(2, 10)}`

  const item: TokenHub.ApiKey = {
    id: crypto.randomUUID(),
    name,
    key_prefix: prefix,
    can_generate_config: true,
    status: 'active',
    ip_whitelist: body.ip_whitelist?.trim() ? body.ip_whitelist.trim().split('\n').join(',') : null,
    allowed_models: null,
    quota_policy_id: null,
    expires_at: null,
    last_used_at: null,
    created_at: now.toISOString(),
  }
  keysMock.keys.unshift(item)

  // 完整明文 = 前缀 + 随机尾段(仅创建时返回一次)
  const secret = `${prefix}${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`

  return NextResponse.json<TokenHub.CreateApiKeyResponse>({
    key: secret,
    key_prefix: prefix,
    name,
    id: item.id,
    created_at: item.created_at,
  })
}
