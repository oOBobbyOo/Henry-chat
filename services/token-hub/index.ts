import { queryOptions, useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { request } from '@/lib/request'

// mock API 位于本地 Next 服务,故显式指定 baseURL 为本地 Host
const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_HOST_URL

/** Token Hub 控制台 —— 业务服务层(对接本地 `/api/token-hub/*`,契约对齐生产网关) */
export const TokenHubService = {
  /** 网关健康检查 */
  getHealth: () => request.get<TokenHub.HealthResponse>('/api/token-hub/healthz', { baseURL: LOCAL_BASE_URL }),
  /** 当前登录用户信息 */
  getProfile: () => request.get<TokenHub.Profile>('/api/token-hub/me', { baseURL: LOCAL_BASE_URL }),
  /** 账户余额与配额 */
  getBalance: () => request.get<TokenHub.BalanceResponse>('/api/token-hub/me/balance', { baseURL: LOCAL_BASE_URL }),
  /** 用量汇总统计 */
  getSummary: (days = 1) =>
    request.get<TokenHub.Summary>('/api/token-hub/usage/summary', {
      baseURL: LOCAL_BASE_URL,
      params: { days, mine: true },
    }),
  /** 用量趋势 */
  getTrend: (granularity: 'hour' | 'day' = 'hour', days = 1) =>
    request.get<TokenHub.TrendResponse>('/api/token-hub/usage/trend', {
      baseURL: LOCAL_BASE_URL,
      params: { days, granularity, mine: true },
    }),
  /** 按模型统计的用量趋势 */
  getModelTrend: (granularity: 'hour' | 'day' = 'hour', days = 1) =>
    request.get<TokenHub.ModelTrendResponse>('/api/token-hub/usage/model-trend', {
      baseURL: LOCAL_BASE_URL,
      params: { days, granularity, mine: true },
    }),
  /** 按模型聚合的表现明细(用量分析) */
  getModelStats: (days = 7, filters?: { model?: string; provider?: string; client?: string }) =>
    request.get<TokenHub.ModelStatsResponse>('/api/token-hub/usage/model-stats', {
      baseURL: LOCAL_BASE_URL,
      params: { days, ...filters },
    }),
  /** 成本分析核心指标 */
  getReportSummary: (days = 30) =>
    request.get<TokenHub.CostReportSummary>('/api/token-hub/reports/summary', {
      baseURL: LOCAL_BASE_URL,
      params: { days },
    }),
  /** 成本走势 */
  getReportTrend: (granularity: 'day' | 'week' | 'month' | 'year' = 'month', days = 365) =>
    request.get<TokenHub.CostReportTrendResponse>('/api/token-hub/reports/trend', {
      baseURL: LOCAL_BASE_URL,
      params: { granularity, days },
    }),
  /** 成本构成(按模型 / 供应商 / API Key / 客户端) */
  getReportBreakdown: (by: TokenHub.CostBreakdownBy = 'model') =>
    request.get<TokenHub.CostBreakdownResponse>('/api/token-hub/reports/breakdown', {
      baseURL: LOCAL_BASE_URL,
      params: { by },
    }),
  /** 模型目录(模型广场) */
  getModels: () => request.get<TokenHub.CatalogResponse>('/api/token-hub/catalog/models', { baseURL: LOCAL_BASE_URL }),
  /** 模型近 30 分钟性能指标 */
  getModelMetrics: (minutes = 30) =>
    request.get<TokenHub.CatalogMetricsResponse>('/api/token-hub/catalog/models/metrics', {
      baseURL: LOCAL_BASE_URL,
      params: { minutes },
    }),
  /** 个人 API Key 列表 */
  getKeys: () => request.get<TokenHub.ApiKeysResponse>('/api/token-hub/keys', { baseURL: LOCAL_BASE_URL, params: { mine: true } }),
  /** 创建 API Key */
  createKey: (body: TokenHub.CreateApiKeyBody) =>
    request.post<TokenHub.CreateApiKeyResponse>('/api/token-hub/keys', {
      baseURL: LOCAL_BASE_URL,
      body,
    }),
  /** 服务账号列表 */
  getServiceAccounts: () => request.get<TokenHub.ServiceAccountsResponse>('/api/token-hub/keys/service-accounts', { baseURL: LOCAL_BASE_URL }),
}

/** 稳定查询键 */
export const TOKEN_HUB_QUERY_KEYS = {
  health: ['token-hub', 'health'],
  profile: ['token-hub', 'profile'],
  balance: ['token-hub', 'balance'],
  summary: ['token-hub', 'summary'],
  trend: ['token-hub', 'trend'],
  modelTrend: ['token-hub', 'model-trend'],
  modelStats: ['token-hub', 'model-stats'],
  reportSummary: ['token-hub', 'reports-summary'],
  reportTrend: ['token-hub', 'reports-trend'],
  reportBreakdown: ['token-hub', 'reports-breakdown'],
  models: ['token-hub', 'catalog-models'],
  modelMetrics: ['token-hub', 'catalog-metrics'],
  keys: ['token-hub', 'keys'],
  serviceAccounts: ['token-hub', 'service-accounts'],
}

/** 汇总统计查询配置(默认最近 1 天) */
export function createSummaryQueryOptions(days = 1) {
  return queryOptions({
    queryKey: [...TOKEN_HUB_QUERY_KEYS.summary, days],
    queryFn: () => TokenHubService.getSummary(days),
    staleTime: 60_000,
  })
}

/** 用量趋势查询配置(默认按小时聚合最近 1 天) */
export function createTrendQueryOptions(granularity: 'hour' | 'day' = 'hour', days = 1) {
  return queryOptions({
    queryKey: [...TOKEN_HUB_QUERY_KEYS.trend, granularity, days],
    queryFn: () => TokenHubService.getTrend(granularity, days),
    staleTime: 60_000,
  })
}

/** 按模型趋势查询配置(默认按小时聚合最近 1 天) */
export function createModelTrendQueryOptions(granularity: 'hour' | 'day' = 'hour', days = 1) {
  return queryOptions({
    queryKey: [...TOKEN_HUB_QUERY_KEYS.modelTrend, granularity, days],
    queryFn: () => TokenHubService.getModelTrend(granularity, days),
    staleTime: 60_000,
  })
}

/** 模型表现明细查询配置(默认最近 7 天) */
export function createModelStatsQueryOptions(days = 7, filters?: { model?: string; provider?: string; client?: string }) {
  return queryOptions({
    queryKey: [...TOKEN_HUB_QUERY_KEYS.modelStats, days, filters?.model ?? '', filters?.provider ?? '', filters?.client ?? ''],
    queryFn: () => TokenHubService.getModelStats(days, filters),
    staleTime: 60_000,
  })
}

/** 成本分析核心指标查询配置(默认当月) */
export function createReportSummaryQueryOptions(days = 30) {
  return queryOptions({
    queryKey: [...TOKEN_HUB_QUERY_KEYS.reportSummary, days],
    queryFn: () => TokenHubService.getReportSummary(days),
    staleTime: 60_000,
  })
}

/** 成本走势查询配置(默认按月) */
export function createReportTrendQueryOptions(granularity: 'day' | 'week' | 'month' | 'year' = 'month', days = 365) {
  return queryOptions({
    queryKey: [...TOKEN_HUB_QUERY_KEYS.reportTrend, granularity, days],
    queryFn: () => TokenHubService.getReportTrend(granularity, days),
    staleTime: 60_000,
  })
}

/** 成本构成查询配置(默认按模型) */
export function createReportBreakdownQueryOptions(by: TokenHub.CostBreakdownBy = 'model') {
  return queryOptions({
    queryKey: [...TOKEN_HUB_QUERY_KEYS.reportBreakdown, by],
    queryFn: () => TokenHubService.getReportBreakdown(by),
    staleTime: 60_000,
  })
}

/** 模型目录查询配置 */
export function createModelsQueryOptions() {
  return queryOptions({
    queryKey: TOKEN_HUB_QUERY_KEYS.models,
    queryFn: TokenHubService.getModels,
    staleTime: 5 * 60_000,
  })
}

/** 模型性能指标查询配置 */
export function createModelMetricsQueryOptions(minutes = 30) {
  return queryOptions({
    queryKey: [...TOKEN_HUB_QUERY_KEYS.modelMetrics, minutes],
    queryFn: () => TokenHubService.getModelMetrics(minutes),
    staleTime: 60_000,
  })
}

/** 汇总统计(hook) */
export function useSummaryQuery(days = 1) {
  return useSuspenseQuery(createSummaryQueryOptions(days))
}

/** 用量趋势(hook) */
export function useTrendQuery(granularity: 'hour' | 'day' = 'hour', days = 1) {
  return useSuspenseQuery(createTrendQueryOptions(granularity, days))
}

/** 按模型趋势(hook) */
export function useModelTrendQuery(granularity: 'hour' | 'day' = 'hour', days = 1) {
  return useSuspenseQuery(createModelTrendQueryOptions(granularity, days))
}

/** 模型表现明细(hook) */
export function useModelStatsQuery(days = 7, filters?: { model?: string; provider?: string; client?: string }) {
  return useSuspenseQuery(createModelStatsQueryOptions(days, filters))
}

/** 成本分析核心指标(hook) */
export function useReportSummaryQuery(days = 30) {
  return useSuspenseQuery(createReportSummaryQueryOptions(days))
}

/** 成本走势(hook) */
export function useReportTrendQuery(granularity: 'day' | 'week' | 'month' | 'year' = 'month', days = 365) {
  return useSuspenseQuery(createReportTrendQueryOptions(granularity, days))
}

/** 成本构成(hook) */
export function useReportBreakdownQuery(by: TokenHub.CostBreakdownBy = 'model') {
  return useSuspenseQuery(createReportBreakdownQueryOptions(by))
}

/** 模型目录(hook) */
export function useModelsQuery() {
  return useSuspenseQuery(createModelsQueryOptions())
}

/** 模型性能指标(hook) */
export function useModelMetricsQuery(minutes = 30) {
  return useSuspenseQuery(createModelMetricsQueryOptions(minutes))
}

/** 余额查询(hook,非阻塞) */
export function useBalanceQuery() {
  return useQuery({
    queryKey: TOKEN_HUB_QUERY_KEYS.balance,
    queryFn: TokenHubService.getBalance,
    staleTime: 60_000,
    retry: 1,
  })
}

/** 用户信息查询(hook,非阻塞) */
export function useProfileQuery() {
  return useQuery({
    queryKey: TOKEN_HUB_QUERY_KEYS.profile,
    queryFn: TokenHubService.getProfile,
    staleTime: 60_000,
    retry: 1,
  })
}

/** 网关健康检查(hook,非阻塞,静默失败不打扰用户) */
export function useHealthQuery() {
  return useQuery({
    queryKey: TOKEN_HUB_QUERY_KEYS.health,
    queryFn: TokenHubService.getHealth,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  })
}

/** 个人 API Key 列表(hook) */
export function useKeysQuery() {
  return useSuspenseQuery({
    queryKey: TOKEN_HUB_QUERY_KEYS.keys,
    queryFn: TokenHubService.getKeys,
    staleTime: 60_000,
  })
}

/** 服务账号列表(hook,非阻塞) */
export function useServiceAccountsQuery() {
  return useQuery({
    queryKey: TOKEN_HUB_QUERY_KEYS.serviceAccounts,
    queryFn: TokenHubService.getServiceAccounts,
    staleTime: 60_000,
    retry: 1,
  })
}

/** 创建 API Key(mutation,成功后失效列表缓存) */
export function useCreateKeyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: TokenHub.CreateApiKeyBody) => TokenHubService.createKey(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.keys })
    },
  })
}
