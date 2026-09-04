import { getLobeIcon } from '@/lib/libe-icon'

/**
 * 模型家族(family) → LobeHub 图标名映射,用于模型卡与供应商行展示
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

/** 根据模型家族取品牌图标 */
export function getFamilyIcon(family: string, size = 25): React.ReactNode {
  return getLobeIcon(FAMILY_ICON[family] ?? null, size)
}

/** 根据供应商名称取品牌图标 */
export function getProviderIcon(provider: string, size = 15): React.ReactNode {
  return getLobeIcon(PROVIDER_ICON[provider] ?? null, size)
}
