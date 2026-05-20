import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { createProxy } from 'next-i18next/proxy'

/**
 * TODO: 判断 Token 不存在或过期
 */
function isTokenExpired() {
  // Token 不存在返回 true

  // Token 已过期返回 true

  return false
}

import { auth } from '@/lib/auth'

import i18nConfig from './i18n.config'

// 创建 i18n proxy
const i18nProxy = createProxy(i18nConfig)

// 定义公共路由
const publicRoutes = ['/login', '/signup', 'forgot-password', '/api/auth']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 公共路由：跳过认证，直接执行 i18n
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return i18nProxy(request)
  }

  // 自定义验证Token, 跳转登录页携带重定向地址
  if (isTokenExpired()) {
    const authUrl = new URL('/login', request.url)
    authUrl.searchParams.set('redirect', request.url)
    return NextResponse.redirect(authUrl)
  }

  // Better Auth Protection
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 执行 i18n proxy
  return i18nProxy(request)
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat-ai/:path*'],
}
