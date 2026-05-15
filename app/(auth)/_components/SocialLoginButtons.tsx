'use client'

import { useState } from 'react'

import { createAuthClient } from 'better-auth/client'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type SocialProvider = 'google' | 'facebook'

interface SocialLoginButtonProps {
  provider: SocialProvider
  onClick: () => void
  isLoading?: boolean
  className?: string
}

const providerConfig = {
  google: {
    label: 'Google',
    Icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    theme: 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-750',
  },
  facebook: {
    label: 'Facebook',
    Icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    theme: 'bg-[#1877F2] text-white hover:text-white/90 hover:bg-[#166FE5] border-transparent dark:bg-[#1877F2] dark:hover:bg-[#1565C0]',
  },
} as const

export function SocialLoginButton({ provider, onClick, isLoading = false, className }: SocialLoginButtonProps) {
  const { label, Icon, theme } = providerConfig[provider]

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
      aria-label={`使用 ${label} 登录`}
      className={cn(
        'flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 md:text-base',
        theme,
        className,
      )}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-5 w-5" />}
      <span>{isLoading ? '登录中...' : `使用 ${label} 登录`}</span>
    </Button>
  )
}

export const authClient = createAuthClient()

export function SocialLoginButtons({ providers = ['google', 'facebook'], className }: { providers?: SocialProvider[]; className?: string }) {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null)

  const handleSignIn = async (provider: SocialProvider) => {
    if (loadingProvider) return
    setLoadingProvider(provider)
    try {
      await authClient.signIn.social({ provider, callbackURL: '/' })
    } catch {
      setLoadingProvider(null)
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {providers.map((provider) => (
        <SocialLoginButton
          key={provider}
          provider={provider}
          onClick={() => handleSignIn(provider)}
          isLoading={loadingProvider === provider}
        />
      ))}
    </div>
  )
}
