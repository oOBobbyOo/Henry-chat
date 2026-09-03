'use client'

import { useState } from 'react'

import { Check, Copy, ShieldCheck } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/time'

/**
 * 用户信息卡 —— 头像 + 姓名 + 状态 + 角色 + 6 项资料网格 + 身份同步提示
 */
export function ProfileInfoCard({ profile }: { profile?: TokenHub.Profile }) {
  const { t } = useT('token-hub')
  const [copied, setCopied] = useState(false)

  if (!profile) return null

  const avatarText = profile.name?.charAt(0) ?? 'U'
  const joinedAt = profile.created_at ? formatDate(profile.created_at, 'YYYY年M月D日') : '—'

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(profile.user_id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error(t('Profile Copy Failed'))
    }
  }

  const fields: { label: string; value: string; extra?: string; copyable?: boolean }[] = [
    { label: t('Profile Field Email'), value: profile.email ?? '—' },
    { label: t('Profile Field Phone'), value: profile.mobile_e164 ?? profile.mobile ?? '—' },
    { label: t('Profile Field Org'), value: profile.department_name ?? '—', extra: profile.departments?.find((d) => d.is_primary) ? t('Profile Primary') : undefined },
    { label: t('Profile Field Role'), value: t('Profile Role Developer') },
    { label: t('Profile Field Joined'), value: joinedAt },
    { label: t('Profile Field Id'), value: profile.user_id, copyable: true },
  ]

  return (
    <div className="overflow-hidden rounded-[15px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      <div className="p-5 sm:p-6">
        {/* 头像 + 身份 */}
        <div className="flex items-start gap-4">
          <Avatar
            size="lg"
            className="h-14 w-14"
          >
            {profile.avatar_url && (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.name ?? 'User'}
              />
            )}
            <AvatarFallback className="bg-[#edf1ff] text-lg font-bold text-[#294fd4]">{avatarText}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h2 className="truncate text-[17px] font-semibold text-[#0f1c3a]">{profile.name ?? '—'}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t('Profile Status Normal')}
              </span>
            </div>
            <p className="mt-1 truncate text-[13px] text-[#5b6b8c]">{profile.email ?? '—'}</p>
            <span className="mt-1.5 inline-flex rounded-md bg-[#eef3ff] px-2 py-0.5 text-[11px] font-semibold text-[#3867ff]">{t('Profile Role Developer')}</span>
          </div>
        </div>

        {/* 资料网格(2 列) */}
        <div className="mt-5 grid gap-x-8 gap-y-5 border-t border-[#dce5f6]/80 pt-5 sm:grid-cols-2">
          {fields.map(({ label, value, extra, copyable }) => (
            <div
              key={label}
              className="min-w-0"
            >
              <p className="text-[11px] font-semibold tracking-[0.06em] text-[#8a9bc0] uppercase">{label}</p>
              <div className="mt-1.5 flex min-w-0 items-center gap-2">
                <span className="truncate font-mono text-[13px] text-[#0f1c3a]">{value}</span>
                {extra && <span className="shrink-0 rounded bg-[#edf1ff] px-1.5 py-0.5 text-[10px] font-semibold text-[#3867ff]">{extra}</span>}
                {copyable && (
                  <button
                    type="button"
                    onClick={handleCopyId}
                    title={t('Profile Copy Id')}
                    aria-label={t('Profile Copy Id')}
                    className="inline-flex h-6 shrink-0 cursor-pointer items-center gap-1 rounded-md px-1.5 text-[11px] font-semibold text-[#8a9bc0] transition hover:bg-[#eef3ff] hover:text-[#294fd4]"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copied ? t('Profile Copied') : t('Profile Copy Id')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 身份同步提示 */}
      <div className="flex items-center gap-2 border-t border-[#dce5f6]/80 bg-[#f7f9fd]/60 px-5 py-3 text-[11px] text-[#8a9bc0] sm:px-6">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#4269ee]" />
        {t('Profile Sync Note')}
      </div>
    </div>
  )
}
