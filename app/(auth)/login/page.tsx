'use client'

import { useSearchParams } from 'next/navigation'

import EmailLogin from '../_components/EmailLogin'
import PhoneLogin from '../_components/PhoneLogin'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const model = searchParams.get('model') || 'phone'

  return (
    <div>
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-3xl md:mb-2.5 md:text-4xl lg:text-5xl">欢迎回来</h1>
        <p className="text-base leading-relaxed font-medium text-gray-600 md:text-base">登录您的账户</p>
      </div>

      {/* Login Form */}
      {model === 'phone' ? <PhoneLogin /> : <EmailLogin />}
    </div>
  )
}
