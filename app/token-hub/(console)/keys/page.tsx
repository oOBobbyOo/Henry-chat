'use client'

import { useState } from 'react'

import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'
import { useKeysQuery, useServiceAccountsQuery } from '@/services/token-hub'

import { CreateKeyDialog } from './_components/create-key-dialog'
import { KeysTable } from './_components/keys-table'

/** 页签类型 */
type KeysTab = 'mine' | 'service'

/**
 * Token Hub 控制台 —— API Keys
 * 标题 + 创建 Key + 页签(我的 Key / 服务账号)+ 表格
 */
export default function KeysPage() {
  const { t } = useT('token-hub')
  const [tab, setTab] = useState<KeysTab>('mine')

  const { data: keysData } = useKeysQuery()
  const { data: serviceData } = useServiceAccountsQuery()

  const tabs: { key: KeysTab; label: string }[] = [
    { key: 'mine', label: t('Keys Tab Mine') },
    { key: 'service', label: t('Keys Tab Service') },
  ]

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-4 lg:py-9">
      <div className="space-y-7">
        {/* 标题区 */}
        <header className="flex flex-col gap-4 border-b border-[#dce5f6]/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold tracking-[-0.045em] text-[#0f1c3a] sm:text-[26px]">{t('Keys Title')}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5b6b8c]">{t('Keys Subtitle')}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <CreateKeyDialog />
          </div>
        </header>

        {/* 页签 */}
        <div className="inline-flex max-w-full items-center gap-5 overflow-x-auto border-b border-[#dce5f6] scrollbar-none">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center -mb-px border-b-2 px-4 text-[12px] font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-[#4269ee]/20 focus-visible:outline-none',
                tab === key ? 'relative z-10 border-b-4 border-b-[#294fd4] text-[#3867ff]' : 'border-b-transparent text-[#8a9bc0] hover:border-b-[#dce5f6] hover:text-[#5b6b8c]',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        {tab === 'mine' ? (
          <KeysTable keys={keysData.items} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[15px] border border-dashed border-[#dce5f6] bg-white/60 px-6 py-16 text-center">
            <p className="text-sm font-medium text-[#0f1c3a]">{t('Keys Service Empty Title')}</p>
            <p className="max-w-md text-xs leading-5 text-[#8a9bc0]">{t('Keys Service Empty Desc')}</p>
          </div>
        )}

        {/* 服务账号数量提示 */}
        {tab === 'service' && serviceData && serviceData.items.length > 0 && (
          <p className="text-xs text-[#8a9bc0]">
            {t('Keys Service Count')}: {serviceData.items.length}
          </p>
        )}
      </div>
    </main>
  )
}
