/** 应用接入 —— 页面共享类型与常量 */

/** 协议筛选类型(用于按应用过滤模型广场) */
export type ProtocolFilter = 'anthropic' | 'openai_responses' | 'openai_chat' | 'openai_compatible'

/** 接入方式(9 种,对齐生产) */
export interface IntegrationApp {
  id: string
  /** 展示名称 */
  name: string
  /** 描述 */
  desc: string
  /** 协议筛选 */
  protocol: ProtocolFilter
  /** 协议展示标签 */
  protocolLabel: string
}

/** 9 种接入方式 */
export const INTEGRATION_APPS: IntegrationApp[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    desc: '环境变量方式接入，支持 ~/.claude/settings.json 持久化',
    protocol: 'anthropic',
    protocolLabel: 'Anthropic Messages',
  },
  {
    id: 'codex',
    name: 'Codex CLI',
    desc: '写入 ~/.codex/config.toml',
    protocol: 'openai_responses',
    protocolLabel: 'OpenAI Responses',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    desc: '写入项目或全局 opencode.json',
    protocol: 'openai_chat',
    protocolLabel: 'OpenAI Chat Completions',
  },
  {
    id: 'hermes',
    name: 'Hermes Agent',
    desc: 'hermes config 命令设置',
    protocol: 'openai_chat',
    protocolLabel: 'OpenAI Chat Completions',
  },
  {
    id: 'openai-sdk',
    name: 'OpenAI SDK',
    desc: '用于 Python、Node.js 或任意 OpenAI 兼容应用',
    protocol: 'openai_chat',
    protocolLabel: 'OpenAI Chat / Responses',
  },
  {
    id: 'anthropic-sdk',
    name: 'Anthropic SDK',
    desc: '提供 Python 与 Node.js SDK 示例',
    protocol: 'anthropic',
    protocolLabel: 'Anthropic Messages',
  },
  {
    id: 'cherry-studio',
    name: 'Cherry Studio',
    desc: '支持 Deep Link 一键导入 OpenAI 服务商',
    protocol: 'openai_compatible',
    protocolLabel: 'OpenAI 兼容',
  },
  {
    id: 'vercel-ai',
    name: 'Vercel AI SDK',
    desc: '提供 TypeScript 的 OpenAI 兼容 Provider 示例',
    protocol: 'openai_compatible',
    protocolLabel: 'OpenAI 兼容',
  },
  {
    id: 'generic',
    name: '通用 API',
    desc: '生成 cURL 与 Python requests 调用示例',
    protocol: 'openai_compatible',
    protocolLabel: 'OpenAI 兼容',
  },
]

/** 按协议筛选模型(模型只来自模型广场,按当前应用协议自动筛选) */
export function filterModelsByProtocol(
  models: TokenHub.CatalogModel[],
  protocol: ProtocolFilter,
): TokenHub.CatalogModel[] {
  return models.filter((m) => {
    const protos = m.supported_protocols ?? []
    switch (protocol) {
      case 'anthropic':
        return protos.includes('anthropic')
      case 'openai_responses':
        return protos.includes('openai_responses')
      case 'openai_chat':
        return protos.includes('openai_chat')
      case 'openai_compatible':
        return protos.includes('openai_chat') || protos.includes('openai_responses')
      default:
        return true
    }
  })
}
