import type { RequestConfig } from '@/types/request'

/**
 * 统一请求错误对象
 * 继承原生 Error，携带完整上下文便于调试、监控与业务处理
 */
export class RequestError extends Error {
  public readonly name = 'HttpFetchError'
  public readonly status: number
  public readonly statusText: string
  public readonly data: any
  public readonly config: RequestConfig
  public readonly response: Response | null
  public readonly isTimeout: boolean
  public readonly isNetworkError: boolean
  public readonly isHttpError: boolean
  public readonly cause?: Error

  constructor(options: {
    message: string
    config: RequestConfig
    response?: Response
    status?: number
    statusText?: string
    data?: unknown
    isTimeout?: boolean
    isNetworkError?: boolean
    cause?: Error
  }) {
    super(options.message)
    this.config = options.config
    this.response = options.response || null
    this.status = options.status || 0
    this.statusText = options.statusText || ''
    this.data = options.data ?? null
    this.isTimeout = !!options.isTimeout
    this.isNetworkError = !!options.isNetworkError
    this.isHttpError = this.status >= 400
    this.cause = options.cause
    // 修复 instanceof 失效问题
    Object.setPrototypeOf(this, RequestError.prototype)
  }
}
