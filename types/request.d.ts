import type { RequestError } from '@/lib/request/error'

/**
 * 请求参数类型（用于 URL Query 参数）
 * @example
 *   params: { page: 1, size: 20 }
 *   → ?page=1&size=20
 */
export type RequestParams = Record<string, string | number | boolean | undefined | null>

/**
 * 请求体类型（支持多种数据格式）
 *
 * 支持的类型：
 * - `Record<string, any>` / `any[]`: 普通对象或数组，会自动 JSON.stringify 序列化
 * - `FormData`: 表单上传（需注意：浏览器会自动设置 multipart/form-data）
 * - `Blob` / `File`: 文件二进制数据
 * - `URLSearchParams`: URL 编码的表单数据 (application/x-www-form-urlencoded)
 * - `string`: 原始字符串（如 GraphQL query、XML、纯文本）
 * - `ArrayBuffer` / `ReadableStream`: 底层二进制或流数据
 * - `null` / `undefined`: 无请求体
 *
 * @example
 *   // JSON 请求（推荐）
 *   { body: { username: 'admin' } }
 *
 *   // 文件上传
 *   { body: formData, headers: { 'Content-Type': 'multipart/form-data' } }
 */
export type RequestBody = BodyInit | Record<string, any> | any[] | null | undefined

/**
 * 扩展的 Fetch 请求配置类型
 * 继承原生 RequestInit，覆盖 headers/body/signal 以适应业务封装与生态兼容
 */
export interface RequestConfig extends Omit<RequestInit, 'headers' | 'body' | 'signal'> {
  /** 请求 URL（必填） */
  url: string
  /** 基础 URL（可选） */
  baseURL?: string
  /** 请求超时时间（单位：毫秒） */
  timeout?: number | null
  /** 请求头（覆盖默认值） */
  headers?: Record<string, string>
  /** URL 查询参数（自动拼接到 URL 末尾） */
  params?: RequestParams
  /** 请求体数据 */
  body?: RequestBody
  /**
   * 流式响应标记
   * - `false`（默认）: 自动解析响应体
   * - `true`: 直接返回原生 Response 对象，由调用方手动处理流
   */
  stream?: boolean // 标记流式请求，直接返回 Response
  /**
   * 外部 AbortSignal（用于手动取消请求）
   * - 兼容 TanStack Query / SWR / React Query 等库的自动取消机制
   * - 如果同时配置了 `timeout`，两者会共同作用（任一触发即取消）
   *
   * @example
   *   // 与 AbortController 配合
   *   const controller = new AbortController()
   *   request.get('/api/data', { signal: controller.signal })
   *   // 需要时取消
   *   controller.abort()
   */
  signal?: AbortSignal
}

/** 请求拦截器函数 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>

/** 响应成功拦截器函数  */
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>

/** 错误拦截器函数 */
export type ErrorInterceptor = (error: RequestError) => any | Promise<any>
