'use client'

import { useState } from 'react'

import { Check, Copy, Wrench } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

/**
 * 生成 MCP 接入配置弹窗 —— 展示该服务的 MCP Server 配置 JSON + 复制
 */
export function McpConfigDialog({ service, onClose }: { service: TokenHub.McpService; onClose: () => void }) {
  const { t } = useT('token-hub')
  const [copied, setCopied] = useState(false)

  /** 构造客户端可直接粘贴的 MCP Server 配置 */
  const config = {
    mcpServers: {
      [service.id]: {
        type: 'remote',
        url: `https://api.aimix.bbgameonline.com/mcp/${service.id}`,
        headers: {
          Authorization: 'Bearer sk-********',
        },
      },
    },
  }
  const configText = JSON.stringify(config, null, 2)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(configText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error(t('Mcp Copy Failed'))
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent className="w-full max-w-lg rounded-[22px] border border-[#dce5f6] bg-white p-6 shadow-[0_24px_80px_rgb(16_38_79/0.22)]">
        <DialogHeader className="mb-4 space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf1ff] text-[#3867ff]">
              <Wrench className="h-4 w-4" />
            </span>
            <DialogTitle className="text-base font-semibold text-[#0f1c3a]">
              {service.name} · {t('Mcp Config Title')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-[#8a9bc0]">{t('Mcp Config Desc')}</DialogDescription>
        </DialogHeader>

        <div className="relative rounded-xl border border-[#dce5f6] bg-[#0f1c3a] p-4">
          <button
            type="button"
            onClick={handleCopy}
            title={t('Mcp Copy')}
            aria-label={t('Mcp Copy')}
            className="absolute top-3 right-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
          <pre className="scrollbar-hidden overflow-x-auto font-mono text-xs leading-5 whitespace-pre text-[#cdd8f0]">{configText}</pre>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="h-10 bg-[#294fd4] px-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition hover:bg-[#4269ee]"
          >
            {t('Mcp Config Done')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
