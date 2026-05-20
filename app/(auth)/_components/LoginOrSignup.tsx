'use client'

import { useRouter } from 'next/navigation'

import { CircleUser, LucideIcon, Mail, Phone } from 'lucide-react'
import { useT } from 'next-i18next/client'

export type ModelType = 'phone' | 'email' | 'signup'

interface Model {
  type: ModelType
  path: string
  lang: string
  label: string
  shortLabel: string
  icon: LucideIcon
}

export const models: Model[] = [
  { type: 'phone', path: '/login?model=phone', lang: 'Phone Login', label: '手机登录', shortLabel: '手机', icon: Phone },
  { type: 'email', path: '/login?model=email', lang: 'Email Login', label: '邮箱登录', shortLabel: '邮箱', icon: Mail },
  { type: 'signup', path: '/signup', lang: 'Create Account', label: '创建账户', shortLabel: '注册', icon: CircleUser },
]

interface LoginOrSignupProps {
  currentModel: ModelType
}

export function LoginOrSignup({ currentModel }: LoginOrSignupProps) {
  const { t } = useT('auth')

  const router = useRouter()

  const onModelChange = (path: string) => {
    router.push(path)
  }

  return (
    <div className="flex gap-2">
      {models
        .filter((model) => model.type !== currentModel)
        .map((model) => {
          const Icon = model.icon

          return (
            <button
              key={model.type}
              type="button"
              onClick={() => onModelChange(model.path)}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition-all duration-300 hover:border-gray-400 hover:bg-gray-50"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t(model.lang)}</span>
            </button>
          )
        })}
    </div>
  )
}
