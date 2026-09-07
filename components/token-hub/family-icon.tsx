import { Terminal } from 'lucide-react'

import { getLobeIcon } from '@/lib/libe-icon'

/**
 * 模型家族(family) → LobeHub 图标名映射,用于模型卡、模型列表与供应商行展示
 * 优先使用品牌彩色变体(.Color);无彩色变体的品牌保留 Mono(随文字色)
 */
const FAMILY_ICON: Record<string, string> = {
  anthropic: 'Anthropic',
  deepseek: 'DeepSeek.Color',
  gemini: 'Google.Color',
  openai: 'OpenAI',
  qwen: 'Qwen.Color',
  xai: 'xAI',
  zhipu: 'Zhipu.Color',
  moonshot: 'Moonshot',
  hunyuan: 'Tencent.Color',
}

/** 供应商名称 → LobeHub 图标名映射(同样优先彩色变体) */
const PROVIDER_ICON: Record<string, string> = {
  ZenMux: 'ZenMux',
  'Vercel AI Gateway': 'Vercel',
  'Google Vertex AI': 'VertexAI.Color',
  '阿里云（中国）': 'AlibabaCloud.Color',
  '阿里云（新加坡）': 'AlibabaCloud.Color',
  '腾讯云（中国）': 'Tencent.Color',
  '腾讯云（新加坡）': 'Tencent.Color',
}

/** 接入应用 id → LobeHub 图标名映射(用于应用接入页的应用选择网格,优先彩色变体) */
const APP_ICON: Record<string, string> = {
  'claude-code': 'ClaudeCode.Color',
  codex: 'Codex.Color',
  opencode: 'OpenCode',
  hermes: 'HermesAgent',
  'openai-sdk': 'OpenAI',
  'anthropic-sdk': 'Anthropic',
  'cherry-studio': 'CherryStudio.Color',
  'vercel-ai': 'Vercel',
}

/** 根据模型家族取品牌图标 */
export function getFamilyIcon(family: string, size = 25): React.ReactNode {
  return getLobeIcon(FAMILY_ICON[family] ?? null, size)
}

/** 根据供应商名称取品牌图标 */
export function getProviderIcon(provider: string, size = 15): React.ReactNode {
  return getLobeIcon(PROVIDER_ICON[provider] ?? null, size)
}

/** 根据接入应用 id 取品牌图标(无品牌图标的应用回退为终端图标) */
export function getAppIcon(appId: string, size = 16): React.ReactNode {
  const icon = APP_ICON[appId]
  if (icon) return getLobeIcon(icon, size)
  return (
    <Terminal
      size={size}
      strokeWidth={2}
    />
  )
}
