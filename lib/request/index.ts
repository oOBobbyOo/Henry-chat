import type { RequestError } from './error'

import { ClientRequest } from './client'

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || ''

// 默认导出实例
export const request = new ClientRequest({
  baseURL,
  timeout: 6000,
})

// 请求拦截：注入 Token
request.useRequestInterceptor((config) => {
  // const token = localStorage.getItem('token')
  const token = process.env.NEXT_PUBLIC_API_LEY
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

// 响应拦截：统一处理 401 & 网络异常降级
request.useResponseInterceptor(
  (res: Response) => {
    return res
  },
  (error: RequestError) => {
    // 401 无感跳转登录
    if (error.status === 401) {
      localStorage.removeItem('token')
      // 保留当前路径，登录后自动跳回
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return Promise.reject(error)
    }

    // 403/404/5xx 业务错误：统一日志 + 按需提示
    if (error.isHttpError) {
      console.error(`[API ${error.status}]`, {
        url: error.config.url,
        method: error.config.method,
        response: error.data,
      })
    }

    // 网络错误（CORS/DNS/离线）
    if (error.isNetworkError) {
      console.error('🌐 网络异常:', error.message)
    }

    console.error(`[API] ${error.status}:`, error.data)
    // 默认：继续抛出，交由业务层 catch 处理
    return Promise.reject(error)
  },
)
