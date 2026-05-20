'use server'

import { Suspense } from 'react'

import { getT } from 'next-i18next/server'

import { EmailLoginForm } from '../_components/EmailLoginForm'
import { PhoneLoginForm } from '../_components/PhoneLoginForm'

interface LoginPageProps {
  searchParams: Promise<{ model?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { t } = await getT('auth')

  // 直接 await 获取参数（微任务级延迟，不影响首屏体验）
  const { model = 'phone' } = await searchParams
  const isValidModel = model === 'email' ? 'email' : 'phone'

  return (
    <>
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-3xl md:mb-2.5 md:text-4xl lg:text-5xl">{t('Welcome back!')}</h1>
        <p className="text-base leading-relaxed font-medium text-gray-600 md:text-base">{t('Log in to your account')}</p>
      </div>

      {/* Login Form */}
      <Suspense>{isValidModel === 'phone' ? <PhoneLoginForm /> : <EmailLoginForm />}</Suspense>
    </>
  )
}
