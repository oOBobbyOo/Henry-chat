import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * TODO: 判断 Token 不存在或过期
 */
function isTokenExpired() {
  // Token 不存在返回 true

  // Token 已过期返回 true

  return false
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('[ pathname ] >>:', pathname)
  console.log('[ request ] >>:', request)

  // 跳转登录页携带重定向地址
  if (isTokenExpired()) {
    const authUrl = new URL('/login', request.url)
    authUrl.searchParams.set('redirect', request.url)
    return NextResponse.redirect(authUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chat-ai/:path*'],
}
