'use client'

import { useState } from 'react'

import { Check, Copy, Plug } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import type { IntegrationApp } from '../types'

/** 生产网关地址(配置生成的目标端点) */
const GATEWAY_BASE_URL = 'https://aimix.bbgameonline.com'

/**
 * 生成指定应用的接入配置文本
 * 按应用类型输出不同格式: settings.json / config.toml / opencode.json / 命令 / SDK 代码 / cURL
 */
export function buildAppConfig(app: IntegrationApp, model: TokenHub.CatalogModel, keyPrefix: string): string {
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

/**
 * 生成完整配置弹窗 —— 按所选应用输出配置文本 + 复制
 */
export function ConfigDialog({ app, model, keyName, keyPrefix, onClose }: { app: IntegrationApp; model: TokenHub.CatalogModel; keyName: string; keyPrefix: string; onClose: () => void }) {
  const { t } = useT('token-hub')
  const [copied, setCopied] = useState(false)

  const configText = buildAppConfig(app, model, keyPrefix)

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
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent className="w-full max-w-xl rounded-[22px] border border-[#dce5f6] bg-white p-6 shadow-[0_24px_80px_rgb(16_38_79/0.22)]">
        <DialogHeader className="mb-4 space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf1ff] text-[#3867ff]">
              <Plug className="h-4 w-4" />
            </span>
            <DialogTitle className="text-base font-semibold text-[#0f1c3a]">
              {app.name} · {t('Integ Config Title')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-[#8a9bc0]">
            {t('Integ Config Desc')} <span className="font-semibold text-[#0f1c3a]">{keyName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="relative rounded-xl border border-[#dce5f6] bg-[#0f1c3a] p-4">
          <button
            type="button"
            onClick={handleCopy}
            title={t('Integ Config Copy')}
            aria-label={t('Integ Config Copy')}
            className="absolute top-3 right-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
          <pre className="scrollbar-hidden max-h-80 overflow-y-auto font-mono text-xs leading-5 whitespace-pre text-[#cdd8f0]">{configText}</pre>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="h-10 bg-[#294fd4] px-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition hover:bg-[#4269ee]"
          >
            {t('Integ Config Done')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
