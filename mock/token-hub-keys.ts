/**
 * API Keys —— 本地 Mock 数据源
 * 字段契约对齐生产网关 `/api/proxy/keys` 接口(2026-09 实测快照)
 */

/** 个人 Key 列表(生产实测 4 条) */
const API_KEYS: TokenHub.ApiKey[] = [
  {
    id: '9f96bb4af58b40eb9655b765ee3f50f1',
    name: 'Codex',
    key_prefix: 'sk-th-M2GhI2',
    can_generate_config: true,
    status: 'active',
    ip_whitelist: null,
    allowed_models: null,
    quota_policy_id: null,
    expires_at: null,
    last_used_at: '2026-09-03T10:10:56.493618',
    created_at: '2026-08-19T12:29:03.199092',
  },
  {
    id: '8e6a78908af7479da9788cc6e167ab52',
    name: 'Claude',
    key_prefix: 'sk-szw1C7IOr',
    can_generate_config: true,
    status: 'active',
    ip_whitelist: null,
    allowed_models: null,
    quota_policy_id: null,
    expires_at: null,
    last_used_at: '2026-09-03T12:19:51.343545',
    created_at: '2026-06-23T07:37:03',
  },
  {
    id: 'b1ef2948f9bc4205936a5f14622c0b88',
    name: 'Deepseek',
    key_prefix: 'sk-jFfOUENjJ',
    can_generate_config: true,
    status: 'active',
    ip_whitelist: null,
    allowed_models: null,
    quota_policy_id: null,
    expires_at: null,
    last_used_at: '2026-08-31T14:52:55.076505',
    created_at: '2026-05-11T03:34:06',
  },
  {
    id: '32e42707ad4e4507b50904a478175781',
    name: 'Other',
    key_prefix: 'sk-PyS8J4ct1',
    can_generate_config: true,
    status: 'active',
    ip_whitelist: null,
    allowed_models: null,
    quota_policy_id: null,
    expires_at: null,
    last_used_at: '2026-05-15T10:54:23',
    created_at: '2025-11-13T04:19:21',
  },
]

/** 服务账号(生产实测为空列表) */
const SERVICE_ACCOUNTS: TokenHub.ServiceAccount[] = []

export const keysMock = {
  keys: API_KEYS,
  serviceAccounts: SERVICE_ACCOUNTS,
}
