import type { RequestError } from '@/lib/request/error'

/** params */
export type RequestParams = Record<string, string | number | boolean | undefined | null>

export type RequestBody = BodyInit | undefined | null

/**
 * 扩展的 Fetch 请求配置类型
 * 继承原生 RequestInit，覆盖 headers/signal 以适应业务封装与生态兼容
 */
export interface RequestConfig extends Omit<RequestInit, 'headers' | 'signal'> {
  url: string
  timeout?: number // 毫秒
  headers?: Record<string, string>
  params?: RequestParams
  stream?: boolean // 标记流式请求，直接返回 Response
  signal?: AbortSignal // 兼容 TanStack Query / SWR 等库的自动取消
}

/** 请求拦截 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>

/** 响应拦截  */
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>

/** 错误拦截 */
export type ErrorInterceptor = (error: RequestError) => unknown | Promise<unknown>
