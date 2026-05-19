// import { headers } from 'next/headers'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// import { auth } from '@/lib/auth'

// /**
//  * TODO: 判断 Token 不存在或过期
//  */
// function isTokenExpired() {
//   // Token 不存在返回 true

//   // Token 已过期返回 true

//   return false
// }

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   console.log('[ pathname ] >>:', pathname)
//   console.log('[ request ] >>:', request)

//   // 自定义验证Token, 跳转登录页携带重定向地址
//   if (isTokenExpired()) {
//     const authUrl = new URL('/login', request.url)
//     authUrl.searchParams.set('redirect', request.url)
//     return NextResponse.redirect(authUrl)
//   }

//   // Better Auth Protection
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })

//   if (!session) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/chat-ai/:path*'],
// }

import { createProxy } from 'next-i18next/proxy'

import i18nConfig from './i18n.config'

export const proxy = createProxy(i18nConfig)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)'],
}
