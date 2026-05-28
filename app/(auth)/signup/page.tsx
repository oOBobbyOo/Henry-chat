'use server'

import { getT } from 'next-i18next/server'

import { SignupForm } from '../_components/SignupForm'

export default async function SignupPage() {
  const { t } = await getT('auth')

  return (
    <>
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-3xl md:mb-2.5 md:text-4xl lg:text-5xl dark:text-white">{t('Create Account')}</h1>
        <p className="text-base leading-relaxed font-medium text-gray-600 md:text-base dark:text-gray-400">{t('Create Your Account')}</p>
      </div>

      {/* Signup Form */}
      <SignupForm />
    </>
  )
}
