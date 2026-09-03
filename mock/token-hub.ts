import dayjs from 'dayjs'

/**
 * Token Hub 控制台 —— 本地 Mock 数据源
 * 字段契约对齐生产网关 `/api/proxy/*` 接口,便于后续无缝切换到真实后端
 */

/** 参考生产实测的用户信息 */
const MOCK_PROFILE: TokenHub.Profile = {
  user_id: 'c6605e22d81c45b5bcaa427e0cfb7b93',
  name: 'Henry',
  email: 'henry@example.com',
  avatar_url: 'https://static-legacy.dingtalk.com/media/lQDPDhtH9CMuMRtkZLDr0tZA3ovMMwJGj-RBwOAA_100_100.jpg',
  mobile: '86134xxxxxxx',
  mobile_country_code: '86',
  mobile_e164: '+86134xxxxxxx',
  department_name: '技术部',
  department_ids: ['151cf37a4b3a48e2b06813eae1b5eba8'],
  departments: [{ id: '151cf37a4b3a48e2b06813eae1b5eba8', name: '技术部', is_primary: true }],
  created_at: '2026-08-16T00:47:05.161107',
  status: 'active',
  employment_status: 'active',
  role: 'developer',
  is_admin: false,
  is_platform_admin: false,
  is_department_admin: false,
  can_manage_department: false,
  dept_id: '151cf37a4b3a48e2b06813eae1b5eba8',
}

/** 参考生产实测的余额信息 */
const MOCK_BALANCE: TokenHub.BalanceResponse = {
  account_balance: {
    enabled: true,
    amount_micro: 598958493,
    amount_cny: '598.958493',
    currency: 'CNY',
  },
  quota: {
    configured: true,
    unlimited: true,
    remaining_tokens: null,
    limit_tokens: null,
    used_tokens: null,
    period: 'unlimited',
    active_key_count: 4,
  },
  configured: true,
  unlimited: true,
  remaining_tokens: null,
  limit_tokens: null,
  used_tokens: null,
  period: 'unlimited',
  active_key_count: 4,
}

/** 参考生产实测的概要统计 */
function buildSummary(_days = 1): TokenHub.Summary {
  return {
    days: 1,
    tokens: 1179873,
    cost: 1.0415,
    requests: 36,
    active_users: 1,
    avg_ttft_ms: 1927.8,
    avg_total_ms: 8779.7,
    p50_ttft_ms: 1452.0,
    p95_ttft_ms: 4348.0,
    p50_tps: 72.8,
    success_rate: 1.0,
    cache_read_tokens: 1048018,
    cache_write_tokens: 46746,
    cache_hit_rate: 0.9018,
    input_tokens: 1162082,
    output_tokens: 17791,
    cache_tokens: 1094764,
  }
}

/** 按小时生成 24 个时间窗口;仅最后一小时有流量(对齐生产"最近 1 小时涌入"的形态) */
function buildTrend(granularity: 'hour' | 'day' = 'hour', days = 1): TokenHub.TrendResponse {
  const step = granularity === 'hour' ? 3600 : 86400
  const count = granularity === 'hour' ? 24 * days : days
  const now = dayjs().startOf(granularity)

  // 单小时流量分布(生产实测最后一小时: DeepSeek V4 Flash / GPT-5.6 Terra / GPT-5.6 Luna)
  // 日粒度下把流量分散到最近几天,让多天窗口有可读的趋势;小时粒度仅最后一小时有流量
  const dailyActiveCount = granularity === 'day' ? Math.min(days, 5) : 1
  const items: TokenHub.TrendPoint[] = Array.from({ length: count }, (_, i) => {
    const active = i >= count - dailyActiveCount
    // 衰减系数: 越靠近现在流量越大,总量与单小时基准一致
    const weight = active ? (i - (count - dailyActiveCount) + 1) / dailyActiveCount : 0
    return {
      date: now.subtract(count - 1 - i, granularity).toISOString(),
      tokens: active ? Math.round(1179873 * weight) : 0,
      input_tokens: active ? Math.round(1162082 * weight) : 0,
      output_tokens: active ? Math.round(17791 * weight) : 0,
      cache_tokens: active ? Math.round(1094764 * weight) : 0,
      cost: active ? Number((1.0415 * weight).toFixed(4)) : 0,
      requests: active ? Math.round(36 * weight) : 0,
      cache_read_tokens: active ? Math.round(1048018 * weight) : 0,
      cache_write_tokens: active ? Math.round(46746 * weight) : 0,
      requests_per_minute: active ? (36 * weight) / 60 : 0,
      success_requests_per_minute: active ? (36 * weight) / 60 : 0,
      failed_requests_per_minute: 0,
      avg_ttft_ms: active ? 1927.8 : 0,
      output_token_latency_ms: active ? 24.5 : 0,
      cache_hit_rate: active ? 0.9018 : 0,
      error_rate: 0,
    }
  })

  return { granularity, step_seconds: step, items }
}

/** 按模型统计(生产实测最近一小时三条模型的用量) */
function buildModelTrend(granularity: 'hour' | 'day' = 'hour', days = 1): TokenHub.ModelTrendResponse {
  const step = granularity === 'hour' ? 3600 : 86400
  const count = granularity === 'hour' ? 24 * days : days
  const now = dayjs().startOf(granularity)

  const models = ['DeepSeek V4 Flash', 'GPT-5.6 Terra', 'GPT-5.6 Luna']
  // 每条模型最近一小时的 tokens / cost
  const traffic = [
    { model: 'DeepSeek V4 Flash', tokens: 1028383, cost: 0.2201 },
    { model: 'GPT-5.6 Terra', tokens: 145059, cost: 0.8104 },
    { model: 'GPT-5.6 Luna', tokens: 6431, cost: 0.011 },
  ]

  const dailyActiveCount = granularity === 'day' ? Math.min(days, 5) : 1
  const items: TokenHub.ModelTrendItem[] = Array.from({ length: count }, (_, i) => {
    const active = i >= count - dailyActiveCount
    const weight = active ? (i - (count - dailyActiveCount) + 1) / dailyActiveCount : 0
    return {
      date: now.subtract(count - 1 - i, granularity).toISOString(),
      models: active
        ? traffic.map((m) => ({
            model: m.model,
            tokens: Math.round(m.tokens * weight),
            cost: Number((m.cost * weight).toFixed(4)),
          }))
        : [],
    }
  })

  return { granularity, step_seconds: step, models, items }
}

/** 按模型聚合的表现明细(用量分析 —— 模型表现表格;对齐生产最近一小时三条模型的用量) */
function buildModelStats(_days = 7): TokenHub.ModelStatsResponse {
  const items: TokenHub.ModelStatsItem[] = [
    {
      model: 'DeepSeek V4 Flash',
      provider: 'ZenMux',
      client: 'Claude Code',
      tokens: 1028383,
      requests: 18,
      cost: 0.2201,
      success_rate: 1.0,
      avg_ttft_ms: 1604.2,
      p50_tps: 84.6,
      cache_hit_rate: 0.9172,
    },
    {
      model: 'GPT-5.6 Terra',
      provider: 'Vercel AI Gateway',
      client: 'Codex CLI',
      tokens: 145059,
      requests: 14,
      cost: 0.8104,
      success_rate: 1.0,
      avg_ttft_ms: 2451.7,
      p50_tps: 57.3,
      cache_hit_rate: 0.8635,
    },
    {
      model: 'GPT-5.6 Luna',
      provider: '阿里云(中国)',
      client: '内部应用',
      tokens: 6431,
      requests: 4,
      cost: 0.011,
      success_rate: 0.75,
      avg_ttft_ms: 3120.5,
      p50_tps: 41.2,
      cache_hit_rate: 0.7021,
    },
  ]

  return { days: _days, items }
}

export const tokenHubMock = {
  profile: MOCK_PROFILE,
  balance: MOCK_BALANCE,
  summary: buildSummary,
  trend: buildTrend,
  modelTrend: buildModelTrend,
  modelStats: buildModelStats,
}
