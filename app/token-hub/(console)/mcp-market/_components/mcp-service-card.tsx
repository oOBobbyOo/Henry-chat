'use client'

import { useState } from 'react'

import { CheckCircle2, Lock, Puzzle, Wrench } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'

import { useSetMcpEnabledMutation } from '@/services/token-hub'

/** 展示的工具名数量上限(超出显示 +N) */
const MAX_TOOLS = 5

/** 价格徽标 */
function PriceBadge({ service }: { service: TokenHub.McpService }) {
  const { t } = useT('token-hub')
  if (service.price_type === 'free') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
        {service.price === 0 ? t('Mcp Price Free') : `¥${service.price}/${service.price_unit}`}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
      ¥{service.price}/{service.price_unit}
    </span>
  )
}

/** 凭据徽标 */
function CredentialBadge({ service }: { service: TokenHub.McpService }) {
  const { t } = useT('token-hub')
  if (service.credential_type === 'platform') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-[#edf1ff] px-2 py-0.5 text-[11px] font-medium text-[#3867ff]">
        <Lock className="h-3 w-3" />
        {t('Mcp Credential Platform')}
      </span>
    )
  }
  if (service.credential_type === 'user') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">
        <Puzzle className="h-3 w-3" />
        {t('Mcp Credential User')}
      </span>
    )
  }
  return null
}

/**
 * MCP 服务卡片 —— 名称 + 价格 + 工具数 + 描述 + 工具 chips + 启用/配置操作
 */
export function McpServiceCard({ service, onGenerateConfig }: { service: TokenHub.McpService; onGenerateConfig: () => void }) {
  const { t } = useT('token-hub')
  const setMcpEnabled = useSetMcpEnabledMutation()
  const [pending, setPending] = useState(false)

  const isEnabled = service.status === 'active'

  const toggleEnabled = async (enabled: boolean) => {
    setPending(true)
    try {
      const res = await setMcpEnabled.mutateAsync({ serviceId: service.id, enabled })
      if (res.status === 'active') {
        toast.success(t('Mcp Enabled Toast'))
      } else {
        toast.success(t('Mcp Disabled Toast'))
      }
    } catch {
      toast.error(t('Mcp Toggle Failed'))
    } finally {
      setPending(false)
    }
  }

  const shownTools = service.tools.slice(0, MAX_TOOLS)
  const moreCount = service.tools.length - shownTools.length

  return (
    <div className="group flex flex-col overflow-hidden rounded-[15px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgb(15_38_79/0.04)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgb(28_55_105/0.06)]">
      <div className="flex flex-1 flex-col p-5">
        {/* 名称 + 价格 */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 truncate text-[15px] font-semibold tracking-[-0.01em] text-[#0f1c3a]">{service.name}</h3>
          <PriceBadge service={service} />
        </div>

        {/* 工具数 + 凭据 */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8a9bc0]">
            <Wrench className="h-3 w-3" />
            {service.tools.length} {t('Mcp Tools Unit')}
          </span>
          <CredentialBadge service={service} />
        </div>

        {/* 描述 */}
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#5b6b8c]">{service.description}</p>

        {/* 工具 chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {shownTools.map((tool) => (
            <code
              key={tool}
              className="rounded-md bg-[#f2f5fc] px-2 py-1 font-mono text-[10.5px] leading-none text-[#5b6b8c]"
            >
              {tool}
            </code>
          ))}
          {moreCount > 0 && <code className="rounded-md bg-[#eef3ff] px-2 py-1 font-mono text-[10.5px] leading-none font-semibold text-[#3867ff]">+{moreCount}</code>}
        </div>
      </div>

      {/* 操作区 */}
      <div className="flex items-center justify-between gap-2 border-t border-[#dce5f6]/80 bg-[#f7f9fd]/50 px-5 py-3.5">
        {service.pinned ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <Lock className="h-3.5 w-3.5" />
            {t('Mcp Pinned')}
          </span>
        ) : isEnabled ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => void toggleEnabled(false)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t('Mcp Enabled')}
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => void toggleEnabled(true)}
            className="inline-flex cursor-pointer items-center rounded-lg bg-[#294fd4] px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_3px_8px_rgb(49_88_232/0.2)] transition-colors hover:bg-[#4269ee] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {t('Mcp Enable')}
          </button>
        )}

        <button
          type="button"
          onClick={onGenerateConfig}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#dce5f6] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#5b6b8c] transition-colors hover:border-[#4269ee]/40 hover:bg-[#eef3ff] hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
        >
          <Wrench className="h-3 w-3" />
          {t('Mcp Generate Config')}
        </button>
      </div>
    </div>
  )
}
