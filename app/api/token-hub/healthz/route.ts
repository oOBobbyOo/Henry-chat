import { NextResponse } from 'next/server'

/**
 * GET /api/token-hub/healthz
 * 网关健康检查 —— 返回 "ok" 表示服务可正常接收请求
 */
export async function GET() {
  return NextResponse.json('ok')
}
