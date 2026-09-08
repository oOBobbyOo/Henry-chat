'use client'

import { useState } from 'react'

import { Check, Copy, Plus } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCreateKeyMutation } from '@/services/token-hub'

/** 创建成功后的一次性明文展示步骤 */
type CreateStep = 'form' | 'revealed'

/**
 * 创建 API Key 弹窗 —— 名称 + IP 白名单(选填)
 */
export function CreateKeyDialog() {
  const { t } = useT('token-hub')
  const createMutation = useCreateKeyMutation()

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<CreateStep>('form')
  const [name, setName] = useState('')
  const [ipWhitelist, setIpWhitelist] = useState('')
  const [createdKey, setCreatedKey] = useState<TokenHub.CreateApiKeyResponse | null>(null)
  const [copied, setCopied] = useState(false)

  /** 提交创建 */
  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error(t('Keys Create Name Required'))
      return
    }
    try {
      const result = await createMutation.mutateAsync({
        name: name.trim(),
        ip_whitelist: ipWhitelist.trim() || undefined,
      })
      setCreatedKey(result)
      setStep('revealed')
    } catch {
      toast.error(t('Keys Create Failed'))
    }
  }

  /** 复制明文 Key */
  const handleCopy = async () => {
    if (!createdKey) return
    try {
      await navigator.clipboard.writeText(createdKey.key)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error(t('Keys Copy Failed'))
    }
  }

  /** 关闭并复位弹窗 */
  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // 延迟复位,避免动画期间闪表单
      setTimeout(() => {
        setStep('form')
        setName('')
        setIpWhitelist('')
        setCreatedKey(null)
        setCopied(false)
      }, 200)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogTrigger asChild>
        <Button className="h-10 gap-2 bg-(--tc-primary) px-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition hover:bg-(--tc-primary-hover) hover:shadow-[0_8px_20px_rgb(49_88_232/0.28)]">
          <Plus className="h-4 w-4" />
          {t('Keys Create')}
        </Button>
      </DialogTrigger>
      {/* sm:max-w-md 覆盖 shadcn 默认的 sm:max-w-sm, 否则桌面端弹窗被压到 384px */}
      <DialogContent className="w-full max-w-md sm:max-w-md rounded-[22px] border border-(--tc-border) bg-(--tc-surface) p-6 shadow-[0_24px_80px_rgb(16_38_79/0.22)]">
        {step === 'form' ? (
          <>
            <DialogHeader className="mb-4 space-y-1 text-left">
              <DialogTitle className="text-base font-semibold text-(--tc-strong)">{t('Keys Create Title')}</DialogTitle>
              <DialogDescription className="text-sm text-(--tc-muted)">{t('Keys Create Desc')}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="key-name"
                  className="text-sm text-(--tc-body)"
                >
                  {t('Keys Create Name')}
                </label>
                <input
                  id="key-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('Keys Create Name Placeholder')}
                  className="flex h-10 w-full rounded-xl border border-(--tc-border) bg-(--tc-surface) px-3.5 text-sm text-(--tc-strong) shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition-colors placeholder:text-(--tc-muted) focus-visible:border-(--tc-primary-hover) focus-visible:ring-4 focus-visible:ring-(--tc-primary-hover)/15 focus-visible:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="ip-whitelist"
                  className="text-sm text-(--tc-body)"
                >
                  {t('Keys Create IP')} <span className="text-xs text-(--tc-muted)">（{t('Keys Create Optional')}）</span>
                </label>
                <textarea
                  id="ip-whitelist"
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  placeholder={`${t('Keys Create IP Placeholder')}\n203.0.113.8\n10.0.0.0/24`}
                  aria-describedby="ip-whitelist-help"
                  className="min-h-24 w-full resize-y rounded-xl border border-(--tc-border) bg-(--tc-surface) px-3.5 py-2.5 text-sm leading-6 text-(--tc-strong) shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition-colors outline-none placeholder:text-(--tc-muted) focus:border-(--tc-primary-hover) focus:ring-4 focus:ring-(--tc-primary-hover)/15"
                />
                <p
                  id="ip-whitelist-help"
                  className="text-xs leading-5 text-(--tc-muted)"
                >
                  {t('Keys Create IP Help')}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                className="h-10 border border-(--tc-border) bg-(--tc-surface) px-4 text-sm font-semibold text-(--tc-body) shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition hover:border-(--tc-primary-hover)/40 hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text)"
              >
                {t('Keys Create Cancel')}
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="h-10 bg-(--tc-primary) px-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition hover:bg-(--tc-primary-hover) hover:shadow-[0_8px_20px_rgb(49_88_232/0.28)] disabled:opacity-50"
              >
                {createMutation.isPending ? t('Keys Creating') : t('Keys Create Submit')}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-base font-semibold text-(--tc-strong)">{t('Keys Created Title')}</DialogTitle>
              <DialogDescription className="text-sm text-(--tc-muted)">{t('Keys Created Desc')}</DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 rounded-xl border border-(--tc-border) bg-(--tc-surface-raised) p-3">
              <code className="min-w-0 flex-1 break-all text-xs text-(--tc-strong)">{createdKey?.key}</code>
              <button
                type="button"
                onClick={handleCopy}
                title={t('Keys Copy Full')}
                className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-(--tc-muted) transition hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-2 focus-visible:ring-(--tc-primary-hover)/35 focus-visible:outline-none"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => handleClose(false)}
                className="h-10 bg-(--tc-primary) px-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition hover:bg-(--tc-primary-hover)"
              >
                {t('Keys Created Done')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
