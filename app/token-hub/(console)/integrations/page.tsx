'use client'

import { useMemo, useState } from 'react'

import Link from 'next/link'

import { Check, Download, KeyRound, Loader2, Plug, ShieldCheck, X } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'
import { useHealthQuery, useKeysQuery, useModelsQuery } from '@/services/token-hub'

import { ConfigDialog } from './_components/config-dialog'
import { INTEGRATION_APPS, filterModelsByProtocol, type IntegrationApp } from './types'

/** 网关连通性检查状态 */
type HealthState = 'idle' | 'checking' | 'ok' | 'fail'

/**
 * Token Hub 控制台 —— 应用接入
 * 标题 + 下载 CC Switch / 管理 API Keys + 第一步向导(选择接入方式 / 模型 / API Key)+ 底部连通性检查
 * 布局对齐生产: 应用选择 3 列网格 → 模型 + Key 两列并排 → 卡片底部操作栏
 */
export default function IntegrationsPage() {
  const { t } = useT('token-hub')

  // —— 数据 ——
  const { data: modelsData } = useModelsQuery()
  const { data: keysData } = useKeysQuery()
  const healthQuery = useHealthQuery()

  // —— 状态 ——
  const [app, setApp] = useState<IntegrationApp>(INTEGRATION_APPS[0])
  const [modelAlias, setModelAlias] = useState<string>('')
  const [keyId, setKeyId] = useState<string>('')
  const [configOpen, setConfigOpen] = useState(false)
  const [health, setHealth] = useState<HealthState>('idle')

  // 按当前应用协议筛选模型
  const matchedModels = useMemo(() => filterModelsByProtocol(modelsData.items, app.protocol), [modelsData.items, app.protocol])

  // 默认选中第一个匹配模型(应用切换时)
  const selectedModel = matchedModels.find((m) => m.alias === modelAlias) ?? matchedModels[0]
  const effectiveModelAlias = selectedModel?.alias ?? ''

  // 选中的 API Key
  const activeKeys = keysData.items.filter((k) => k.status === 'active')
  const selectedKey = activeKeys.find((k) => k.id === keyId) ?? activeKeys[0]

  const canGenerate = Boolean(selectedModel && selectedKey)

  /** 连通性检查: 复用健康检查查询 */
  const runHealthCheck = async () => {
    setHealth('checking')
    try {
      const res = await healthQuery.refetch()
      setHealth(res.isSuccess ? 'ok' : 'fail')
    } catch {
      setHealth('fail')
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-4 lg:py-9">
      <div className="space-y-7">
        {/* 标题区 */}
        <header className="flex flex-col gap-4 border-b border-[#dce5f6]/80 pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tighter text-[#0f1c3a] sm:text-[32px]">{t('Integ Title')}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5b6b8c]">{t('Integ Subtitle')}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#dce5f6] bg-white px-4 text-sm font-semibold text-[#5b6b8c] shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition hover:border-[#4269ee]/40 hover:bg-[#eef3ff] hover:text-[#294fd4]"
            >
              <Download className="h-4 w-4" />
              {t('Integ Download CC Switch')}
            </a>
            <Link
              href="/token-hub/keys"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#294fd4] px-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition hover:bg-[#4269ee] hover:shadow-[0_8px_20px_rgb(49_88_232/0.28)]"
            >
              <KeyRound className="h-4 w-4" />
              {t('Integ Manage Keys')}
            </Link>
          </div>
        </header>

        {/* 向导第一步 */}
        <section className="overflow-hidden rounded-[18px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
          {/* 步骤头 */}
          <div className="flex items-center justify-between gap-4 border-b border-[#dce5f6] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#edf1ff] text-[15px] font-bold text-[#3867ff]">01</span>
              <div>
                <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#0f1c3a]">{t('Integ Step Title')}</h2>
                <p className="mt-1 text-xs leading-5 text-[#8a9bc0]">{t('Integ Step Desc')}</p>
              </div>
            </div>
            <span className="hidden shrink-0 text-xs whitespace-nowrap text-[#8a9bc0] sm:block">
              {INTEGRATION_APPS.length} {t('Integ Ways')}
            </span>
          </div>

          {/* 主体: 应用选择(3列) → 模型 + Key(2列) */}
          <div className="space-y-6 px-5 py-5 sm:px-6 sm:pb-6">
            {/* 选择应用或 SDK —— 3 列网格 */}
            <div>
              <h3 className="text-[13px] font-bold tracking-[0.06em] text-[#0f1c3a]">{t('Integ Choose App')}</h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {INTEGRATION_APPS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={app.id === item.id}
                    onClick={() => {
                      setApp(item)
                      setModelAlias('')
                    }}
                    className={cn(
                      'group flex cursor-pointer flex-col gap-1.5 rounded-xl border p-3.5 text-left transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none',
                      app.id === item.id ? 'border-[#294fd4] bg-[#edf1ff]/60 shadow-[0_2px_10px_rgb(49_88_232/0.08)]' : 'border-[#dce5f6] bg-white hover:border-[#4269ee]/40 hover:bg-[#f7f9fd]',
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-[#0f1c3a]">{item.name}</span>
                      {app.id === item.id && <Check className="h-3.5 w-3.5 shrink-0 text-[#3867ff]" />}
                    </span>
                    <span className="text-[11px] leading-4 text-[#8a9bc0]">{item.desc}</span>
                    <span className="mt-0.5 inline-flex w-fit rounded-md bg-[#eef3ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#3867ff]">{item.protocolLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 模型 + API Key —— 两列并排 */}
            <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
              {/* 选择模型 */}
              <div className="rounded-2xl border border-[#dce5f6]/70 bg-[#f7f9fd]/55 p-3.5 sm:p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[13px] font-bold tracking-[0.06em] text-[#0f1c3a]">{t('Integ Choose Model')}</h3>
                  <span className="shrink-0 text-xs text-[#8a9bc0]">
                    {matchedModels.length} {t('Integ Matching Models')}
                  </span>
                </div>
                <div className="scrollbar-hidden mt-3 flex max-h-64 flex-col gap-1.5 overflow-y-auto pr-1">
                  {matchedModels.map((model) => (
                    <button
                      key={model.alias}
                      type="button"
                      aria-pressed={effectiveModelAlias === model.alias}
                      onClick={() => setModelAlias(model.alias)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none',
                        effectiveModelAlias === model.alias ? 'border-[#294fd4] bg-[#edf1ff]/60' : 'border-[#dce5f6] bg-white hover:border-[#4269ee]/40 hover:bg-[#f7f9fd]',
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-[#0f1c3a]">{model.display_name}</span>
                        <code className="block truncate font-mono text-[11px] text-[#8a9bc0]">{model.alias}</code>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="hidden rounded-md bg-[#eef3ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#3867ff] md:inline">{app.protocolLabel}</span>
                        {effectiveModelAlias === model.alias && <Check className="h-4 w-4 shrink-0 text-[#3867ff]" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 选择我的 API Key */}
              <div className="rounded-2xl border border-[#dce5f6]/70 bg-[#f7f9fd]/55 p-3.5 sm:p-4">
                <h3 className="text-[13px] font-bold tracking-[0.06em] text-[#0f1c3a]">{t('Integ Choose Key')}</h3>
                <div className="mt-3 flex flex-col gap-2">
                  {activeKeys.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-[#dce5f6] px-4 py-6 text-center text-xs text-[#8a9bc0]">
                      {t('Integ No Keys')}{' '}
                      <Link
                        href="/token-hub/keys"
                        className="font-semibold text-[#3867ff] hover:underline"
                      >
                        {t('Integ Manage Keys')}
                      </Link>
                    </p>
                  ) : (
                    activeKeys.map((key) => (
                      <button
                        key={key.id}
                        type="button"
                        aria-pressed={selectedKey?.id === key.id}
                        onClick={() => setKeyId(key.id)}
                        className={cn(
                          'flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none',
                          selectedKey?.id === key.id ? 'border-[#294fd4] bg-[#edf1ff]/60' : 'border-[#dce5f6] bg-white hover:border-[#4269ee]/40 hover:bg-[#f7f9fd]',
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-[#0f1c3a]">
                            {key.name} · <code className="font-mono text-[12px]">{key.key_prefix}…</code>
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-[11px] text-[#8a9bc0]">
                            {key.key_prefix}… · {t('Integ Key Last Used')}: {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : '—'}
                          </span>
                        </span>
                        {selectedKey?.id === key.id && <Check className="h-4 w-4 shrink-0 text-[#3867ff]" />}
                      </button>
                    ))
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="mt-4 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConfigOpen(true)}
                    disabled={!canGenerate}
                    className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#294fd4] px-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgb(49_88_232/0.22)] transition-all duration-200 hover:bg-[#4269ee] hover:shadow-[0_8px_20px_rgb(49_88_232/0.28)] focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Plug className="h-4 w-4" />
                    {t('Integ Generate Config')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作栏: 网关连通性检查 */}
          <div className="flex flex-col gap-3 border-t border-[#dce5f6] bg-[#f7f9fd]/35 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#294fd4]" />
              <div>
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0f1c3a]">
                  {t('Integ Health Title')}
                  <span className="rounded-md bg-[#eef3ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#3867ff]">{t('Integ Health Optional')}</span>
                </p>
                <p className="mt-1 text-[11px] leading-4 text-[#8a9bc0]">{t('Integ Health Desc')}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              {health === 'ok' && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                  {t('Integ Health Ok')}
                </span>
              )}
              {health === 'fail' && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
                  <X className="h-3.5 w-3.5" />
                  {t('Integ Health Fail')}
                </span>
              )}
              <button
                type="button"
                onClick={runHealthCheck}
                disabled={health === 'checking'}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-[#dce5f6] bg-white px-3.5 text-xs font-semibold text-[#5b6b8c] transition hover:border-[#4269ee]/40 hover:bg-[#eef3ff] hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
              >
                {health === 'checking' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                {t('Integ Health Check')}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 生成配置对话框 */}
      {configOpen && selectedModel && selectedKey && (
        <ConfigDialog
          app={app}
          model={selectedModel}
          keyName={selectedKey.name}
          keyPrefix={selectedKey.key_prefix}
          onClose={() => setConfigOpen(false)}
        />
      )}
    </main>
  )
}
