import type { ErrorInterceptor, RequestBody, RequestConfig, RequestInterceptor, RequestParams, ResponseInterceptor } from '@/types/request'

import { RequestError } from './error'

const DEFAULT_CONFIGS: Partial<RequestConfig> = {
  method: 'GET',
  mode: 'cors',
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json' },
}

/**
 * HTTP 客户端封装
 * 基于 Fetch API，支持拦截器、自动序列化、超时控制及错误统一处理
 */
export class ClientRequest {
  private defaultsConfig: Partial<RequestConfig>

  // 拦截器队列
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: {
    onFulfilled: ResponseInterceptor
    onRejected?: ErrorInterceptor
  }[] = []

  constructor(options: Partial<RequestConfig> = {}) {
    // 合并默认配置
    this.defaultsConfig = { ...DEFAULT_CONFIGS, ...options }
  }

  // ================= 拦截器注册 =================

  /**
   * 注册请求拦截器
   * @param fn 拦截器函数，接收 config，返回修改后的 config 或 Promise<config>
   */
  public useRequestInterceptor(fn: RequestInterceptor): void {
    this.requestInterceptors.push(fn)
  }

  /**
   * 注册响应拦截器
   * @param onFulfilled 成功回调，接收 Response 对象
   * @param onRejected 失败回调，接收 RequestError 对象
   */
  public useResponseInterceptor(onFulfilled: ResponseInterceptor, onRejected?: ErrorInterceptor): void {
    this.responseInterceptors.push({ onFulfilled, onRejected })
  }

  // ================= 核心请求流程 =================

  /**
   * 发起 HTTP 请求
   * @param config 请求配置
   * @returns 解析后的数据 (T)
   */
  public async request<T = any>(config: RequestConfig): Promise<T> {
    // 1. 合并配置
    let currentConfig: RequestConfig = {
      ...this.defaultsConfig,
      ...config,
      // 确保 headers 是独立对象，避免引用污染
      headers: {
        ...this.defaultsConfig.headers,
        ...config.headers,
      },
    }

    // 2. 执行请求拦截器链
    try {
      currentConfig = await this.executeRequestInterceptors(currentConfig)
    } catch (err) {
      // 请求拦截器中的错误直接抛出，不进入响应拦截器
      throw this.normalizeError(err as Error, currentConfig, 'Request Interceptor Error')
    }

    // 3. 准备 Fetch 参数 (URL, Body, Signal)
    const { finalUrl, fetchInit, timeoutId } = this.prepareFetchParams(currentConfig)

    try {
      // 4. 发起网络请求
      const response = await fetch(finalUrl, fetchInit)

      // 5. 处理 HTTP 状态码错误 (4xx, 5xx)
      if (!response.ok) {
        const httpError = await this.createHttpError(response, currentConfig)
        // 进入错误拦截器链
        return this.executeErrorInterceptors<T>(httpError)
      }

      // 6. 执行响应成功拦截器链
      let processedResponse: Response = response
      for (const { onFulfilled } of this.responseInterceptors) {
        // 拦截器可以修改 Response 对象，或者提前返回数据（如直接解析 JSON）
        processedResponse = await onFulfilled(processedResponse)

        // 如果拦截器已经返回了非 Response 类型的数据（例如直接返回了 JSON），则跳过后续解析
        if (!(processedResponse instanceof Response)) {
          return processedResponse as T
        }
      }

      // 7. 解析响应体
      return this.parseResponse<T>(processedResponse as Response, currentConfig)
    } catch (err: any) {
      // 8. 处理网络异常、超时或解析错误
      const requestError = this.normalizeError(err, currentConfig, 'Request Error')
      return this.executeErrorInterceptors<T>(requestError)
    } finally {
      // 9. 清理资源 (超时定时器)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }

  // ================= 私有辅助方法 =================

  /**
   * 执行请求拦截器链
   */
  private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let requestConfig = config
    for (const interceptor of this.requestInterceptors) {
      requestConfig = await interceptor(requestConfig)
    }
    return requestConfig
  }

  /**
   * 执行错误拦截器链
   * 如果某个拦截器成功处理了错误（没有抛出新的错误），则返回其结果
   * 否则继续传递错误，直到最后抛出
   */
  private async executeErrorInterceptors<T>(error: RequestError): Promise<T> {
    let requestError = error

    for (const { onRejected } of this.responseInterceptors) {
      if (!onRejected) continue

      try {
        // 尝试处理错误
        const result = await onRejected(requestError)
        // 如果拦截器返回了值，视为错误已被恢复/降级处理
        return result as T
      } catch (nextErr) {
        // 如果拦截器内部抛出错误，更新当前错误对象，继续传递给下一个拦截器
        requestError =
          nextErr instanceof RequestError
            ? nextErr
            : new RequestError({
                message: `Error Interceptor Failed: ${(nextErr as Error).message}`,
                config: requestError.config,
                cause: nextErr as Error,
              })
      }
    }

    // 所有拦截器都未能处理，最终抛出
    throw requestError
  }

  /**
   * 准备 Fetch 所需的参数
   * 包括 URL 拼接、Body 序列化、Signal、超时控制
   */
  private prepareFetchParams(config: RequestConfig): {
    finalUrl: string
    fetchInit: RequestInit
    controller: AbortController | null
    timeoutId: ReturnType<typeof setTimeout> | undefined
  } {
    // 1. 构建 URL
    const finalUrl = this.buildUrl(config.url, config.baseURL, config.params)

    // 2. 序列化 Body
    const body = this.serializeBody(config.body, config.headers)

    // 3. 处理信号与超时
    const externalSignal = config.signal
    const controller = externalSignal ? null : new AbortController()
    const signal = externalSignal || controller!.signal

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (config.timeout && !externalSignal) {
      timeoutId = setTimeout(() => {
        controller!.abort(new Error(`Request timeout after ${config.timeout}ms`))
      }, config.timeout)
    }

    // 4. 构造 Fetch Init 对象
    // 剔除自定义字段，只保留 Fetch 标准支持的字段
    const { url: _url, baseURL: _baseURL, params: _params, timeout: _timeout, stream: _stream, signal: _signal, headers, ...restInit } = config

    const fetchInit: RequestInit = {
      ...restInit,
      body,
      signal,
      headers,
    }

    return { finalUrl, fetchInit, controller, timeoutId }
  }

  /**
   * 拼接完整 URL（支持 baseURL 覆盖）
   */
  private buildUrl(url: string, baseURL?: string, params?: RequestParams): string {
    const base = baseURL || this.defaultsConfig.baseURL
    const u = new URL(url, base)
    if (params) {
      Object.entries(params).forEach(([k, v]) => v != null && u.searchParams.append(k, String(v)))
    }
    return u.href
  }

  /**
   * 智能序列化请求体
   */
  private serializeBody(body: RequestBody, headers?: Record<string, string>): BodyInit | null | undefined {
    if (body === undefined || body === null) return body

    // 原生类型直接返回，Fetch 会自动处理
    if (body instanceof FormData || body instanceof Blob || body instanceof URLSearchParams || body instanceof ArrayBuffer || body instanceof ReadableStream || typeof body === 'string') {
      return body
    }

    // 对象/数组类型：统一序列化为 JSON 字符串
    if (typeof body === 'object') {
      // 自动注入 Content-Type（避免调用方遗漏）
      if (headers && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json'
      }
      return JSON.stringify(body)
    }

    // 其他情况（理论上不会执行到这里）
    return body as BodyInit | null | undefined
  }

  /**
   * 创建 HTTP 错误对象
   */
  private async createHttpError(response: Response, config: RequestConfig): Promise<RequestError> {
    let errorData: any = null
    try {
      const resCt = response.headers.get('content-type') || ''
      // 尝试解析错误响应体
      if (resCt.includes('application/json')) {
        errorData = await response.json()
      } else {
        errorData = await response.text()
      }
    } catch {
      // 忽略解析失败
    }

    return new RequestError({
      message: `HTTP Error: ${response.status} ${response.statusText}`,
      config,
      response,
      status: response.status,
      statusText: response.statusText,
      data: errorData,
    })
  }

  /**
   * 解析响应体
   */
  private async parseResponse<T>(response: Response, config: RequestConfig): Promise<T> {
    // 如果配置了 stream，直接返回原生 Response，由调用者处理流
    if (config.stream) {
      return response as unknown as T
    }

    const resCt = response.headers.get('content-type') || ''

    // 根据 Content-Type 自动解析
    if (resCt.includes('application/json')) {
      return (await response.json()) as T
    }

    return (await response.text()) as unknown as T
  }

  /**
   * 标准化错误对象
   */
  private normalizeError(err: any, config: RequestConfig, defaultMsg: string = 'Unknown Error'): RequestError {
    if (err instanceof RequestError) {
      return err
    }

    // 区分超时和网络错误
    if (err.name === 'AbortError' || err.message?.includes('timeout')) {
      return new RequestError({
        message: 'Request Timeout',
        config,
        isTimeout: true,
        cause: err,
      })
    }

    // TypeError 通常意味着网络断开或 CORS 问题
    if (err instanceof TypeError) {
      return new RequestError({
        message: 'Network Error',
        config,
        isNetworkError: true,
        cause: err,
      })
    }

    return new RequestError({
      message: err.message || defaultMsg,
      config,
      cause: err,
    })
  }

  // ================= 快捷方法 =================
  public get<T>(url: string, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'GET' })
  }

  public post<T>(url: string, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'POST' })
  }

  public put<T>(url: string, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'PUT' })
  }

  public patch<T>(url: string, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'PATCH' })
  }

  public delete<T>(url: string, config?: Partial<RequestConfig>) {
    return this.request<T>({ ...config, url, method: 'DELETE' })
  }
}
