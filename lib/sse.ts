type StreamChunkType = 'reasoning' | 'content' | 'done' | 'meta' | 'error'

interface OpenAIStreamChunk {
  type: StreamChunkType
  /** 正式回复内容 */
  content?: string
  /** 深度思考内容 */
  reasoningContent?: string
  role?: 'system' | 'user' | 'assistant'
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter'
  raw?: any
  error?: Error
}

interface StreamState {
  fullReasoning: string
  fullContent: string
  metadata: Record<string, any>
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'content_filter'
}

interface StreamCallbacks {
  onReasoning?: (delta: string, full: string) => void | Promise<void>
  onContent?: (delta: string, full: string) => void | Promise<void>
  onMeta?: (data: any) => void | Promise<void>
  onDone?: (state: StreamState) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

/**
 * 解析单行 OpenAI SSE 流数据
 * @param line - 原始行字符串
 * @returns OpenAIStreamChunk | null
 */
export function parseOpenAIStreamLine(line: string): OpenAIStreamChunk | null {
  const lineStr = line.trim()

  // 跳过空行和注释
  if (!lineStr || lineStr.startsWith(':') || lineStr.startsWith('event:')) {
    return null
  }

  // 必须是以 'data:' 开头的 SSE 数据行
  if (!lineStr.startsWith('data:')) {
    return null
  }

  // 移除 'data:' 前缀
  const dataStr = lineStr.slice(5).trim()

  // 处理 [DONE] 结束标记
  if (dataStr === '[DONE]') {
    return { type: 'done', finishReason: 'stop' }
  }

  try {
    const parsed = JSON.parse(dataStr)

    // 提取 choice
    const choice = parsed.choices?.[0]

    if (!choice) {
      // 无 choice 字段，可能是元数据（如 usage）
      return { type: 'meta', raw: parsed }
    }

    // 提取 reasoning_content (不同字段名：reasoning_content / reasoning / thoughts)
    const reasoning = choice.delta?.reasoning_content ?? choice.delta?.reasoning ?? choice.delta?.thoughts ?? null

    // 提取 content（接口：delta；补全接口：text）
    const content = choice.delta?.content ?? choice.text ?? null

    // 提取 finish_reason
    const finishReason = choice.finish_reason ?? choice.delta?.finish_reason ?? null

    // 优先返回推理内容
    if (reasoning != null) {
      return {
        type: 'reasoning',
        reasoningContent: String(reasoning),
        finishReason,
        raw: parsed,
      }
    }

    // 正式回复内容
    if (content != null) {
      return {
        type: 'content',
        content: String(content),
        finishReason,
        raw: parsed,
      }
    }

    // 提取 tool_calls（函数调用场景）
    if (choice.delta?.tool_calls?.length > 0) {
      return {
        type: 'meta',
        finishReason,
        raw: parsed,
      }
    }

    // 仅返回 finish_reason（无内容但流结束）
    if (finishReason) {
      return {
        type: 'meta',
        finishReason,
        raw: parsed,
      }
    }

    // 其他情况返回原始数据
    return { type: 'meta', raw: parsed }
  } catch (error) {
    return {
      type: 'error',
      error: error instanceof Error ? error : new Error(`JSON parse failed: ${dataStr}`),
      raw: dataStr,
    }
  }
}

/**
 * 处理单行 SSE 数据（支持 reasoning_content 与 content 分离）
 * @param line - 原始流行
 * @param state - 累积状态（引用传递）
 * @param callbacks - 业务回调
 */
export async function processLine(line: string, state: StreamState, callbacks: StreamCallbacks) {
  const chunk = parseOpenAIStreamLine(line)
  if (!chunk) return

  switch (chunk.type) {
    case 'reasoning':
      if (chunk.reasoningContent) {
        state.fullReasoning += chunk.reasoningContent
        await callbacks.onReasoning?.(chunk.reasoningContent, state.fullReasoning)
      }
      state.finishReason = chunk.finishReason ?? state.finishReason
      break

    case 'content':
      if (chunk.content) {
        state.fullContent += chunk.content
        await callbacks.onContent?.(chunk.content, state.fullContent)
      }
      state.finishReason = chunk.finishReason ?? state.finishReason
      break

    case 'meta':
      Object.assign(state.metadata, chunk.raw)
      state.finishReason = chunk.finishReason ?? state.finishReason
      await callbacks.onMeta?.(chunk.raw)
      break

    case 'done':
      // [DONE] 仅标记结束，finish_reason 通常由上一个 chunk 携带
      break

    case 'error':
      // 解析错误不中断流，仅记录警告
      console.warn('[Stream] Parse warning:', chunk.error?.message || 'Invalid JSON')
      break
  }
}

/**
 * 流式响应处理器
 * @param response - Fetch API 的 Response 对象
 * @param streamCallbacks - 流式响应回调配置
 */
export async function parseStream(response: Response, streamCallbacks: StreamCallbacks): Promise<void> {
  if (!response.body) {
    throw new Error('Response body is null')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const state: StreamState = {
    fullReasoning: '',
    fullContent: '',
    metadata: {},
    finishReason: undefined,
  }

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      // 解码并累积到缓冲区
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 保留最后一个可能不完整的片段

      for (const line of lines) {
        processLine(line, state, streamCallbacks)
      }
    }

    // 处理末尾残留 buffer
    if (buffer.trim()) {
      await processLine(buffer, state, streamCallbacks)
    }

    // 结束回调
    await streamCallbacks.onDone?.(state)
  } catch (error) {
    console.error('[Stream] error:', error)
    await streamCallbacks.onError?.(error as Error)
    throw error
  } finally {
    reader.releaseLock()
  }
}
