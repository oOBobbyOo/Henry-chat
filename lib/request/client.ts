import type { ErrorInterceptor, RequestBody, RequestConfig, RequestInterceptor, RequestParams, ResponseInterceptor } from '@/types/request'

import { RequestError } from './error'

export class ClientRequest {
  private baseURL: string

  private defaultsConfig: Partial<RequestConfig> = {
    method: 'GET',
    mode: 'cors',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
  }

  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: {
    onFulfilled: ResponseInterceptor
    onRejected?: ErrorInterceptor
  }[] = []

  constructor(baseURL: string, options: Partial<RequestConfig>) {
    this.baseURL = baseURL
    if (options) this.defaultsConfig = { ...this.defaultsConfig, ...options }
  }

  public useRequestInterceptor(fn: RequestInterceptor): void {
    this.requestInterceptors.push(fn)
  }

  public useResponseInterceptor(onFulfilled: ResponseInterceptor, onRejected?: ErrorInterceptor): void {
    this.responseInterceptors.push({ onFulfilled, onRejected })
  }

  private async errorInterceptors<T>(error: RequestError): Promise<T | never> {
    for (const { onRejected } of this.responseInterceptors) {
      if (onRejected) {
        try {
          const handled = await onRejected(error)
          return handled as T // 拦截器返回值视为成功降级
        } catch (nextErr) {
          error =
            nextErr instanceof RequestError
              ? nextErr
              : new RequestError({
                  message: `Error Interceptor Failed: ${(nextErr as Error).message}`,
                  config: error.config,
                  cause: nextErr as Error,
                })
        }
      }
    }
    throw error
  }

  private buildRequestParams(url: string, params?: RequestParams): string {
    const u = new URL(url, this.baseURL)
    if (params) {
      Object.entries(params).forEach(([k, v]) => v != null && u.searchParams.append(k, String(v)))
    }
    return u.href
  }

  private buildRequestBody(currentConfig: RequestConfig): RequestBody {
    let body = currentConfig?.body
    const ct = currentConfig?.headers?.['Content-Type'] || ''
    const isJson = ct.includes('application/json')
    const isNativeBody = body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob || body instanceof ArrayBuffer
    if (body && typeof body === 'object' && !isNativeBody && isJson) {
      body = JSON.stringify(body)
    }
    return body
  }

  public async request<T = any>(config: RequestConfig): Promise<T> {
    let currentConfig: RequestConfig = { ...this.defaultsConfig, ...config }

    // 1️⃣ 执行请求拦截器链
    for (const interceptor of this.requestInterceptors) {
      try {
        currentConfig = await interceptor(currentConfig)
      } catch (err) {
        throw new RequestError({
          message: `Request Interceptor Error: ${(err as Error).message}`,
          config: currentConfig,
          cause: err as Error,
        })
      }
    }

    // 2️⃣ 拼接 URL & Query Params
    let finalUrl = currentConfig.url
    finalUrl = this.buildRequestParams(finalUrl, currentConfig?.params)

    // 3️⃣ 智能序列化 Body
    const body = this.buildRequestBody(currentConfig)

    // 4️⃣ 信号与超时融合（兼容 TanStack Query）
    const externalSignal = currentConfig.signal
    const controller = externalSignal ? null : new AbortController()
    const signal = externalSignal || controller!.signal
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (currentConfig.timeout && !externalSignal) {
      timeoutId = setTimeout(() => controller!.abort(new Error(`Request timeout: ${currentConfig.timeout}ms`)), currentConfig.timeout)
    }

    // 提取原生 fetch 支持的字段，隔离自定义配置
    const { url: _url, params: _params, timeout: _timeout, stream: _stream, signal: _signal, headers, ...restInit } = currentConfig
    const fetchInit: RequestInit = {
      ...restInit,
      body,
      signal,
      headers,
    }

    try {
      // 5️⃣ 发起请求
      const response = await fetch(finalUrl, fetchInit)

      // 6️⃣ HTTP 状态码错误处理
      if (!response.ok) {
        let errorData: any = null
        try {
          const resCt = response.headers.get('content-type') || ''
          errorData = resCt.includes('application/json') ? await response.json() : await response.text()
        } catch {
          /* 忽略解析失败 */
        }

        const httpError = new RequestError({
          message: `HTTP ${response.status} ${response.statusText}`,
          config: currentConfig,
          response,
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        })
        return this.errorInterceptors<T>(httpError)
      }

      // 7️⃣ 执行响应成功拦截器
      let processedRes = response
      for (const { onFulfilled } of this.responseInterceptors) {
        processedRes = await onFulfilled(processedRes)
      }

      // 8️⃣ 流式请求直接返回原生 Response
      if (currentConfig?.stream) return processedRes as unknown as T

      // 9️⃣ 自动解析响应体
      const resCt = processedRes.headers.get('content-type') || ''
      return resCt.includes('application/json') ? ((await processedRes.json()) as T) : ((await processedRes.text()) as unknown as T)
    } catch (err: any) {
      // 🔟 网络/超时/未知异常统一包装
      let fetchError: RequestError
      if (err.name === 'AbortError' || (err.message && err.message.includes('timeout'))) {
        fetchError = new RequestError({ message: 'Request Timeout', config: currentConfig, isTimeout: true, cause: err })
      } else if (err instanceof TypeError) {
        fetchError = new RequestError({ message: 'Network Error', config: currentConfig, isNetworkError: true, cause: err })
      } else if (err instanceof RequestError) {
        fetchError = err
      } else {
        fetchError = new RequestError({ message: err.message || 'Unknown Error', config: currentConfig, cause: err })
      }
      return this.errorInterceptors<T>(fetchError)
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }

  // ================= 快捷方法 =================
  public get<T>(url: string, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'GET' })
  }

  public post<T>(url: string, data?: any, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'POST', body: data })
  }

  public put<T>(url: string, data?: any, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'PUT', body: data })
  }

  public patch<T>(url: string, data?: any, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'PATCH' })
  }

  public delete<T>(url: string, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'DELETE' })
  }
}
