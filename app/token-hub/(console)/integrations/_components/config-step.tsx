'use client'

import { useMemo, useState } from 'react'

import { Check, Copy, Info, KeyRound, TriangleAlert } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'

import { getAppIcon, getFamilyIcon } from '@/components/token-hub/family-icon'

import type { IntegrationApp } from '../types'

/** 生产网关地址(配置生成的目标端点) */
const GATEWAY_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL ?? ''

/**
 * 生成指定应用的接入配置文本
 * 按应用类型输出不同格式: settings.json / config.toml / opencode.json / 命令 / SDK 代码 / cURL
 */
export function buildAppConfig(
  app: IntegrationApp,
  model: TokenHub.CatalogModel,
  keyPrefix: string,
): string {
  const base = GATEWAY_BASE_URL
  const key = `${keyPrefix}…`
  const modelId = model.alias

  switch (app.id) {
    case 'claude-code':
      return `// ~/.claude/settings.json
{
  "env": {
    "ANTHROPIC_BASE_URL": "${base}/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "${key}",
    "ANTHROPIC_MODEL": "${modelId}",
    "ANTHROPIC_SMALL_FAST_MODEL": "${modelId}"
  }
}`
    case 'codex':
      return `# ~/.codex/config.toml
model = "${modelId}"
model_provider = "tokenhub"

[model_providers.tokenhub]
name = "Token Hub"
base_url = "${base}/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"`

    case 'opencode':
      return `// opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "tokenhub": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Token Hub",
      "options": {
        "baseURL": "${base}/v1",
        "apiKey": "${key}"
      },
      "models": {
        "${modelId}": {
          "name": "${model.display_name}"
        }
      }
    }
  },
  "model": "tokenhub/${modelId}"
}`
    case 'hermes':
      return `# Hermes Agent 配置
hermes config set models.default "${modelId}"
hermes config set provider.baseUrl "${base}/v1"
hermes config set provider.apiKey "${key}"`
    case 'openai-sdk':
      return `# Python · OpenAI SDK
from openai import OpenAI

client = OpenAI(
    base_url="${base}/v1",
    api_key="${key}",
)

resp = client.chat.completions.create(
    model="${modelId}",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)`
    case 'anthropic-sdk':
      return `# Python · Anthropic SDK
from anthropic import Anthropic

client = Anthropic(
    base_url="${base}/anthropic",
    api_key="${key}",
)

resp = client.messages.create(
    model="${modelId}",
    max_tokens=1024,
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.content[0].text)`
    case 'cherry-studio':
      return `# Cherry Studio · 一键导入(Deep Link)
cherrystudio://add-provider?name=Token%20Hub&baseUrl=${encodeURIComponent(`${base}/v1`)}&apiKey=${encodeURIComponent(key)}&model=${modelId}`
    case 'vercel-ai':
      return `// TypeScript · Vercel AI SDK
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

const tokenhub = createOpenAICompatible({
  name: 'tokenhub',
  baseURL: '${base}/v1',
  apiKey: '${key}',
})

const model = tokenhub('${modelId}')
const result = await generateText({
  model,
  prompt: '你好',
})`
    case 'generic':
    default:
      return `# 通用 API · cURL
curl ${base}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${key}" \\
  -d '{
    "model": "${modelId}",
    "messages": [{"role": "user", "content": "你好"}]
  }'`
  }
}

/** 绑定信息标签(应用 / 模型 / API Key) */
function BoundChip({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2 rounded-xl border border-(--tc-border) bg-(--tc-surface-raised) px-3 py-2">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-(--tc-border)/80 bg-(--tc-blue-soft)/65 text-(--tc-strong)">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[12px] font-semibold text-(--tc-strong)">{title}</span>
        {subtitle && (
          <code className="block truncate font-mono text-[10px] text-(--tc-muted)">{subtitle}</code>
        )}
      </span>
    </span>
  )
}

/**
 * 第二步 —— 生成完整配置(页内展开, 不用弹窗)
 * 随第一步选择的应用 / 模型 / Key 实时更新
 */
export function ConfigStep({
  app,
  model,
  keyName,
  keyPrefix,
}: {
  app: IntegrationApp
  model: TokenHub.CatalogModel
  keyName: string
  keyPrefix: string
}) {
  const { t } = useT('token-hub')
  const [copied, setCopied] = useState(false)

  const configText = useMemo(() => buildAppConfig(app, model, keyPrefix), [app, model, keyPrefix])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(configText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error(t('Integ Config Copy Failed'))
    }
  }

  return (
    <section className="overflow-hidden scroll-mt-6 rounded-[18px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      {/* 步骤头 */}
      <div className="flex items-center gap-4 border-b border-(--tc-border) px-5 py-4 sm:px-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-(--tc-blue-soft) text-[15px] font-bold text-(--tc-blue-bright)">
          02
        </span>
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-(--tc-strong)">
            {t('Integ Step2 Title')}
          </h2>
          <p className="mt-1 text-xs leading-5 text-(--tc-muted)">{t('Integ Step2 Desc')}</p>
        </div>
      </div>

      {/* 主体: 安全提示 + 绑定信息 + 配置代码块 */}
      <div className="space-y-4 px-5 py-5 sm:px-6 sm:pb-6">
        {/* 安全提示: 配置含 API Key */}
        <p className="flex items-start gap-2 rounded-xl border border-amber-200/70 bg-amber-50/80 px-3.5 py-2.5 text-xs leading-5 text-amber-700">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t('Integ Config Key Warning')}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <BoundChip
            icon={getAppIcon(app.id, 16)}
            title={app.name}
            subtitle={app.protocolLabel}
          />
          <BoundChip
            icon={getFamilyIcon(model.family, 16)}
            title={model.display_name}
            subtitle={model.alias}
          />
          <BoundChip
            icon={<KeyRound className="h-3.5 w-3.5" />}
            title={keyName}
            subtitle={`${keyPrefix}…`}
          />
        </div>

        <div className="relative rounded-xl border border-(--tc-border) bg-(--tc-code-bg) p-4">
          <button
            type="button"
            onClick={handleCopy}
            title={t('Integ Config Copy')}
            aria-label={t('Integ Config Copy')}
            className="absolute top-3 right-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
          <pre className="scrollbar-slim-dark max-h-80 overflow-auto font-mono text-xs leading-5 whitespace-pre text-[#cdd8f0]">
            {configText}
          </pre>
        </div>

        {/* 后续步骤提示 */}
        <p className="flex items-start gap-2 rounded-xl border border-(--tc-border) bg-(--tc-surface-raised)/70 px-3.5 py-2.5 text-xs leading-5 text-(--tc-body)">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--tc-blue-bright)" />
          {t('Integ Config Next Tip')}
        </p>
      </div>
    </section>
  )
}
