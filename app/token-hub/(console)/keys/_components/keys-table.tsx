'use client'

import { useState } from 'react'

import { Check, Copy, Pencil, PlugZap, Trash2 } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

/** 时间格式化: ISO → YYYY/MM/DD HH:mm:ss */
function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/**
 * API Keys 表格 —— 名称 / KEY 前缀 / IP 白名单 / 状态 / 创建时间 / 最后使用 / 操作
 */
export function KeysTable({ keys }: { keys: TokenHub.ApiKey[] }) {
  const { t } = useT('token-hub')

  return (
    <div className="overflow-hidden rounded-[15px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      <div className="w-full overflow-auto">
        <table className="w-full min-w-max text-sm">
          <thead className="border-y border-(--tc-border) bg-(--tc-blue-soft)">
            <tr>
              {[t('Keys Col Name'), t('Keys Col Prefix'), t('Keys Col IP'), t('Keys Col Status'), t('Keys Col Created'), t('Keys Col LastUsed'), t('Keys Col Actions')].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'h-10 px-4 text-[11px] font-semibold tracking-[0.07em] whitespace-nowrap text-(--tc-muted) uppercase align-middle',
                    i === 0 && 'text-left',
                    i === 6 && 'w-85 text-right',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {keys.map((key) => (
              <KeyRow
                key={key.id}
                item={key}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** 表格行 —— 含复制前缀、状态徽章、操作按钮 */
function KeyRow({ item }: { item: TokenHub.ApiKey }) {
  const { t } = useT('token-hub')
  const [copied, setCopied] = useState(false)

  /** 复制 Key 前缀(生产复制完整 Key,此处 mock 仅前缀) */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.key_prefix)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error(t('Keys Copy Failed'))
    }
  }

  return (
    <tr className="border-b border-(--tc-border)/80 transition-colors hover:bg-(--tc-blue-soft)">
      <td className="px-4 py-3.5 text-left align-middle text-[13px] font-medium whitespace-nowrap text-(--tc-strong)">{item.name}</td>
      <td className="px-4 py-3.5 align-middle text-[13px] whitespace-nowrap text-(--tc-body)">
        <span className="inline-flex items-center gap-1.5">
          <code className="text-xs text-(--tc-muted)">{item.key_prefix}…</code>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`${t('Keys Copy')} ${item.name}`}
            title={t('Keys Copy Full')}
            className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-xl text-(--tc-muted) transition-all duration-200 hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </span>
      </td>
      <td className="px-4 py-3.5 align-middle text-[13px] whitespace-nowrap text-(--tc-body)">
        <span className="text-xs text-(--tc-muted)">{item.ip_whitelist ? item.ip_whitelist.split(',').join(', ') : t('Keys IP Unlimited')}</span>
      </td>
      <td className="px-4 py-3.5 align-middle text-[13px] whitespace-nowrap text-(--tc-body)">
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tracking-[0.01em]',
            item.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-(--tc-surface-raised) text-(--tc-muted)',
          )}
        >
          {item.status === 'active' ? t('Keys Status Active') : t('Keys Status Disabled')}
        </span>
      </td>
      <td className="px-4 py-3.5 align-middle text-[13px] whitespace-nowrap text-(--tc-body) tabular-nums">{formatDateTime(item.created_at)}</td>
      <td className="px-4 py-3.5 align-middle text-[13px] whitespace-nowrap text-(--tc-body) tabular-nums">{formatDateTime(item.last_used_at)}</td>
      <td className="px-4 py-3.5 align-middle text-[13px] whitespace-nowrap text-(--tc-body)">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold whitespace-nowrap text-(--tc-body) transition-all duration-200 hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none"
          >
            <Pencil className="h-3 w-3" />
            {t('Keys Edit')}
          </button>
          <button
            type="button"
            title={t('Keys Unbind Title')}
            className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-xl border border-(--tc-border) bg-(--tc-surface) px-3 text-xs font-semibold whitespace-nowrap text-(--tc-body) shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition-all duration-200 hover:border-(--tc-primary-hover)/40 hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none"
          >
            <PlugZap className="h-3 w-3" />
            {t('Keys Unbind')}
          </button>
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-xl border border-(--tc-border) bg-(--tc-surface) px-3 text-xs font-semibold whitespace-nowrap text-(--tc-body) shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition-all duration-200 hover:border-(--tc-primary-hover)/40 hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none"
          >
            {t('Keys Disable')}
          </button>
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-50 px-3 text-xs font-semibold whitespace-nowrap text-red-500 transition-all duration-200 hover:bg-(--tc-danger-soft) focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none"
          >
            <Trash2 className="h-3 w-3" />
            {t('Keys Delete')}
          </button>
        </div>
      </td>
    </tr>
  )
}
