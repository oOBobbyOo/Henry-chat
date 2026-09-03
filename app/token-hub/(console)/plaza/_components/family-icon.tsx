import { getLobeIcon } from '@/lib/libe-icon'

/** 模型家族(family) → LobeHub 图标名映射,用于模型卡与供应商行展示 */
const FAMILY_ICON: Record<string, string> = {
  anthropic: 'Anthropic',
  deepseek: 'DeepSeek',
  gemini: 'Google',
  openai: 'OpenAI',
  qwen: 'Qwen',
  xai: 'xAI',
  zhipu: 'Zhipu',
  moonshot: 'Moonshot',
  hunyuan: 'Tencent',
}

/** 供应商名称 → LobeHub 图标名映射 */
const PROVIDER_ICON: Record<string, string> = {
  ZenMux: 'ZenMux',
  'Vercel AI Gateway': 'Vercel',
  'Google Vertex AI': 'VertexAI',
  '阿里云（中国）': 'AlibabaCloud',
  '阿里云（新加坡）': 'AlibabaCloud',
  '腾讯云（中国）': 'Tencent',
  '腾讯云（新加坡）': 'Tencent',
}

/** 根据模型家族取品牌图标 */
export function getFamilyIcon(family: string, size = 25): React.ReactNode {
  return getLobeIcon(FAMILY_ICON[family] ?? null, size)
}

/** 根据供应商名称取品牌图标 */
export function getProviderIcon(provider: string, size = 15): React.ReactNode {
  return getLobeIcon(PROVIDER_ICON[provider] ?? null, size)
}
