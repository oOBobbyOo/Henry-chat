/** Token Hub 控制台 —— 全局类型命名空间 */
declare namespace TokenHub {
  /** 用量汇总统计(24 小时窗口) */
  export interface Summary {
    /** 统计窗口天数 */
    days: number
    /** 总消耗 Tokens(输入 + 输出 + 缓存) */
    tokens: number
    /** 累计成本(CNY) */
    cost: number
    /** 请求总次数 */
    requests: number
    /** 最近窗口内有调用的活跃人数 */
    active_users: number
    /** 平均首字延迟(ms) */
    avg_ttft_ms: number
    /** 平均总耗时(ms) */
    avg_total_ms: number
    /** 首字延迟 P50(ms) */
    p50_ttft_ms: number
    /** 首字延迟 P95(ms) */
    p95_ttft_ms: number
    /** 输出吞吐 P50(tokens/s) */
    p50_tps: number
    /** 成功率(0..1) */
    success_rate: number
    /** 缓存读取 Tokens */
    cache_read_tokens: number
    /** 缓存写入 Tokens */
    cache_write_tokens: number
    /** 缓存命中率(缓存读取占输入比例,0..1) */
    cache_hit_rate: number
    /** 输入 Tokens */
    input_tokens: number
    /** 输出 Tokens */
    output_tokens: number
    /** 缓存 Tokens(读取 + 写入) */
    cache_tokens: number
  }

  /** 趋势图单个数据点(按时间窗口聚合) */
  export interface TrendPoint {
    /** 时间点(ISO 8601) */
    date: string
    tokens: number
    input_tokens: number
    output_tokens: number
    cache_tokens: number
    /** 该窗口成本(CNY) */
    cost: number
    requests: number
    cache_read_tokens: number
    cache_write_tokens: number
    requests_per_minute: number
    success_requests_per_minute: number
    failed_requests_per_minute: number
    avg_ttft_ms: number
    output_token_latency_ms: number
    cache_hit_rate: number
    error_rate: number
  }

  /** 用量趋势响应 */
  export interface TrendResponse {
    /** 聚合粒度: hour / day */
    granularity: string
    /** 每个时间步的秒数 */
    step_seconds: number
    items: TrendPoint[]
  }

  /** 按模型趋势中单个模型在某时间点的用量 */
  export interface ModelUsagePoint {
    /** 模型名 */
    model: string
    tokens: number
    /** 成本(CNY) */
    cost: number
  }

  /** 按模型趋势的单个时间点 */
  export interface ModelTrendItem {
    date: string
    models: ModelUsagePoint[]
  }

  /** 按模型统计响应 */
  export interface ModelTrendResponse {
    granularity: string
    step_seconds: number
    /** 全部模型名(图例) */
    models: string[]
    items: ModelTrendItem[]
  }

  /** 模型表现统计(用量分析 —— 按模型聚合的明细行) */
  export interface ModelStatsItem {
    /** 模型名 */
    model: string
    /** 供应商 */
    provider: string
    /** 客户端 */
    client: string
    /** 总消耗 Tokens */
    tokens: number
    /** 请求次数 */
    requests: number
    /** 累计成本(CNY) */
    cost: number
    /** 成功率(0..1) */
    success_rate: number
    /** 平均首包延迟(ms) */
    avg_ttft_ms: number
    /** 吞吐 P50(tokens/s) */
    p50_tps: number
    /** 缓存命中率(0..1) */
    cache_hit_rate: number
  }

  /** 模型表现统计响应 */
  export interface ModelStatsResponse {
    /** 统计窗口天数 */
    days: number
    items: ModelStatsItem[]
  }

  // ================= 成本分析 (Reports) =================

  /** 成本分析 —— 核心指标 */
  export interface CostReportSummary {
    /** 统计口径(如当月) */
    period: string
    /** 我的成本(CNY) */
    my_cost: number
    /** 我的请求总数 */
    my_requests: number
    /** 主要模型名 */
    main_model: string
    /** 主要模型成本占比(0..1) */
    main_model_share: number
    /** 平均每次请求成本(CNY) */
    avg_cost_per_request: number
    /** 平均每次请求 Token 数 */
    avg_tokens_per_request: number
    /** 调用成功率(0..1) */
    success_rate: number
    /** 缓存命中率(0..1) */
    cache_hit_rate: number
    /** 缓存读取 Tokens */
    cache_read_tokens: number
    /** 缓存写入 Tokens */
    cache_write_tokens: number
  }

  /** 成本走势单个数据点 */
  export interface CostReportTrendPoint {
    /** 时间点(ISO 8601) */
    date: string
    /** 该窗口成本(CNY) */
    cost: number
  }

  /** 成本走势响应 */
  export interface CostReportTrendResponse {
    /** 聚合粒度: day / week / month / year */
    granularity: string
    items: CostReportTrendPoint[]
  }

  /** 成本构成视角 */
  export type CostBreakdownBy = 'model' | 'provider' | 'key' | 'client'

  /** 成本构成单项 */
  export interface CostBreakdownItem {
    name: string
    /** 成本(CNY) */
    cost: number
    /** 成本占比(0..1) */
    share: number
    /** 请求次数 */
    requests: number
  }

  /** 成本构成响应 */
  export interface CostBreakdownResponse {
    by: CostBreakdownBy
    items: CostBreakdownItem[]
  }

  // ================= MCP 市场 =================

  /** MCP 服务状态 */
  export type McpServiceStatus = 'active' | 'disabled'

  /** MCP 服务凭据类型 */
  export type McpCredentialType = 'platform' | 'user' | 'none'

  /** MCP 服务价格类型 */
  export type McpPriceType = 'free' | 'paid'

  /** MCP 服务(市场中可启用的托管 MCP Server) */
  export interface McpService {
    /** 服务 ID(如 exa-search) */
    id: string
    /** 展示名称(如 Exa 联网搜索) */
    name: string
    /** 服务描述 */
    description: string
    /** 价格类型: free / paid */
    price_type: McpPriceType
    /** 单价(元/次;免费为 0) */
    price: number
    /** 价格单位(如 次) */
    price_unit: string
    /** 工具名列表(展示前 5 个,超出显示 +N) */
    tools: string[]
    /** 凭据类型: platform 平台托管 / user 用户自备 / none 无需凭据 */
    credential_type: McpCredentialType
    /** 服务状态 */
    status: McpServiceStatus
    /** 是否固定启用(如平台核心服务,不可禁用) */
    pinned: boolean
    /** 分类标签(如 搜索 / 办公 / 开发) */
    category: string
  }

  /** MCP 市场服务列表响应 */
  export interface McpMarketResponse {
    items: McpService[]
  }

  /** 启用 MCP 服务请求体 */
  export interface McpEnableBody {
    /** 服务 ID */
    service_id: string
  }

  /** 启用 MCP 服务响应 */
  export interface McpEnableResponse {
    service_id: string
    status: McpServiceStatus
  }

  // ================= Agent Chat =================

  /** 方向建议(空状态起始点) */
  export interface ChatDirection {
    id: string
    title: string
    desc: string
  }

  /** 聊天消息 */
  export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    /** 推理内容(思考模式) */
    reasoning_content?: string
    created_at: string
  }

  /** 最近对话 */
  export interface ChatConversation {
    id: string
    title: string
    /** 使用的模型名 */
    model: string
    /** 所属工作区 */
    workspace: string
    last_message_at: string
    messages: ChatMessage[]
  }

  /** 会话列表响应 */
  export interface ChatConversationsResponse {
    items: ChatConversation[]
  }

  // ================= 个人中心 (Profile) =================

  /** 余额变动类型 */
  export type BalanceTransactionType = 'charge' | 'deduct'

  /** 余额明细单项 */
  export interface BalanceTransaction {
    id: string
    /** 变动类型: charge 充值 / deduct 扣费 */
    type: BalanceTransactionType
    /** 明细标题(如 模型调用扣费) */
    title: string
    /** 明细副标题(如 模型调用扣费) */
    subtitle: string
    /** 发生时间(ISO) */
    created_at: string
    /** 变动后余额(CNY) */
    balance_after: number
    /** 变动金额(正=增加,负=扣减) */
    amount_delta: number
  }

  /** 余额明细响应(分页) */
  export interface BalanceTransactionsResponse {
    /** 总笔数 */
    total: number
    page: number
    page_size: number
    items: BalanceTransaction[]
  }

  /** 账户余额信息 */
  export interface BalanceInfo {
    enabled: boolean
    /** 余额微单位(1 元 = 1_000_000) */
    amount_micro: number
    /** 余额(CNY 字符串, 保留 6 位小数) */
    amount_cny: string
    currency: string
  }

  /** 配额信息 */
  export interface QuotaInfo {
    configured: boolean
    unlimited: boolean
    remaining_tokens: number | null
    limit_tokens: number | null
    used_tokens: number | null
    period: string
    /** 激活的 API Key 数量 */
    active_key_count: number
  }

  /** 余额查询响应 */
  export interface BalanceResponse {
    account_balance: BalanceInfo
    quota: QuotaInfo
    configured: boolean
    unlimited: boolean
    remaining_tokens: number | null
    limit_tokens: number | null
    used_tokens: number | null
    period: string
    active_key_count: number
  }

  /** 部门信息 */
  export interface Department {
    id: string
    name: string
    is_primary: boolean
  }

  /** 当前登录用户信息 */
  export interface Profile {
    user_id: string
    name: string
    email: string
    avatar_url: string | null
    mobile: string | null
    mobile_country_code: string | null
    mobile_e164: string | null
    department_name: string | null
    department_ids: string[]
    departments: Department[]
    created_at: string
    status: string
    employment_status: string
    role: string
    is_admin: boolean
    is_platform_admin: boolean
    is_department_admin: boolean
    can_manage_department: boolean
    dept_id: string | null
  }

  /** 网关健康检查响应 */
  export type HealthResponse = string

  // ================= 模型广场 (Catalog) =================

  /** 价格展示配置 */
  export interface CatalogPricing {
    /** 默认展示币种: CNY / USD */
    display_currency: string
    /** 美元兑人民币汇率(用于换算展示) */
    usd_to_cny_rate: number
  }

  /** 供应商映射(模型在某个供应商端点的接入信息) */
  export interface CatalogMapping {
    /** 供应商名称(如 ZenMux / Vercel AI Gateway / 阿里云(中国)) */
    provider_name: string
    /** 端点名称(如 默认端点 / Messages) */
    endpoint_name: string
    /** 协议: openai_chat / anthropic / ... */
    protocol: string
    /** 输入价格(每百万 token,原币种) */
    input_price: number
    /** 输出价格(每百万 token,原币种) */
    output_price: number
    /** 缓存读价格(每百万 token,原币种) */
    cache_read_price: number
    /** 缓存写价格(每百万 token,原币种) */
    cache_write_price: number
    /** 折扣率(0..1, 1 表示无折扣) */
    discount_rate: number
    /** 原币种 */
    currency: string
    /** 输入价格(每百万 token,CNY) */
    input_price_cny: number
    /** 输出价格(每百万 token,CNY) */
    output_price_cny: number
    /** 缓存读价格(每百万 token,CNY) */
    cache_read_price_cny: number
    /** 缓存写价格(每百万 token,CNY) */
    cache_write_price_cny: number
    /** 上游模型名 */
    upstream_model: string
    /** 供应商/端点状态: active / ... */
    status: string
    /** 路由优先级(数值越大越优先) */
    priority: number
  }

  /** 目录模型(模型广场中的可调用模型) */
  export interface CatalogModel {
    /** 模型别名(调用时使用的 ID,如 gemini-3.8-flash) */
    alias: string
    /** 展示名称(如 Gemini 3.8 Flash) */
    display_name: string
    /** 家族/供应商分类(如 gemini / openai / deepseek / qwen) */
    family: string
    /** 模型描述 */
    description: string
    /** 上下文窗口大小(tokens) */
    context_window: number
    /** 输入模态(text / image / video / audio / file) */
    input_modalities: string[]
    /** 输出模态(text / image) */
    output_modalities: string[]
    /** 支持的协议列表 */
    supported_protocols: string[]
    /** 创建时间(上架时间) */
    created_at: string
    /** 各供应商接入映射 */
    mappings: CatalogMapping[]
  }

  /** 目录模型列表响应 */
  export interface CatalogResponse {
    pricing: CatalogPricing
    items: CatalogModel[]
  }

  /** 单个模型的近 30 分钟性能指标 */
  export interface CatalogModelMetrics {
    /** 模型别名 */
    alias: string
    /** 请求次数 */
    requests: number
    /** 首 Token 延迟 P50(ms) */
    p50_ttft_ms: number | null
    /** 流式吞吐 P50(tokens/s) */
    p50_tps: number | null
    /** 非流式吞吐 P50(tokens/s) */
    p50_non_stream_tps: number | null
    /** 可用率(0..1) */
    availability: number
  }

  /** 近 30 分钟性能指标响应 */
  export interface CatalogMetricsResponse {
    /** 统计窗口(分钟) */
    minutes: number
    items: CatalogModelMetrics[]
  }

  // ================= API Keys =================

  /** API Key 状态 */
  export type ApiKeyStatus = 'active' | 'disabled'

  /** API Key(列表项,不包含明文) */
  export interface ApiKey {
    /** Key ID */
    id: string
    /** 名称(如 BBGame_Codex) */
    name: string
    /** Key 前缀(展示用,如 sk-th-M2GhI2) */
    key_prefix: string
    /** 是否可生成接入配置 */
    can_generate_config: boolean
    /** 状态: active / disabled */
    status: ApiKeyStatus
    /** IP 白名单(逗号分隔; null 表示不限) */
    ip_whitelist: string | null
    /** 允许的模型列表(null 表示不限) */
    allowed_models: string[] | null
    /** 配额策略 ID */
    quota_policy_id: string | null
    /** 过期时间(ISO; null 表示永不过期) */
    expires_at: string | null
    /** 最后使用时间(ISO) */
    last_used_at: string | null
    /** 创建时间(ISO) */
    created_at: string
  }

  /** API Key 列表响应 */
  export interface ApiKeysResponse {
    items: ApiKey[]
  }

  /** 创建 API Key 请求体 */
  export interface CreateApiKeyBody {
    /** Key 名称 */
    name: string
    /** IP 白名单(每行一个; 空表示不限) */
    ip_whitelist?: string
  }

  /** 创建 API Key 响应(仅创建时返回一次明文) */
  export interface CreateApiKeyResponse {
    /** 完整 Key 明文(仅此一次) */
    key: string
    key_prefix: string
    name: string
    id: string
    created_at: string
  }

  /** 服务账号列表响应 */
  export interface ServiceAccountsResponse {
    items: TokenHub.ServiceAccount[]
  }

  /** 服务账号(用于游戏、网站等线上应用) */
  export interface ServiceAccount {
    id: string
    name: string
    status: ApiKeyStatus
    created_at: string
    last_used_at: string | null
  }
}
