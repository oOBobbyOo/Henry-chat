'use client'

import { useCallback, useEffect, useState } from 'react'

import { useForm } from '@tanstack/react-form'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'
import z from 'zod'

import { AnimatedField } from '@/components/ui/animated-field'
import { Button } from '@/components/ui/button'
import { DividerWithText } from '@/components/ui/divider-with-text'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { AuthService } from '@/services/auth'

import { LoginOrSignup } from './LoginOrSignup'
import { SocialLoginButtons } from './SocialLoginButtons'

// 统一 Input 样式类（边框/阴影/无外环/聚焦反馈）
const inputClasses = cn(
  'h-12',
  'border-gray-300 dark:border-gray-600',
  'focus-visible:border-violet-500', // ✅ 保留边框变色作为焦点指示
  'focus-visible:ring-0 focus-visible:ring-offset-0', // 🚫 隐藏外环与偏移量
  // 🟦 默认柔和阴影
  'shadow-sm shadow-gray-200/60 dark:shadow-gray-800/60',
  // 🔵 聚焦时增强彩色阴影
  'focus-visible:shadow-lg focus-visible:shadow-violet-500/20',
)

export function PhoneLoginForm() {
  const { t } = useT('auth')

  const [countdown, setCountdown] = useState(0)
  const [isSending, setIsSending] = useState(false)

  // 🔢 倒计时定时器
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // 定义 Zod Schema 校验规则
  const loginSchema = z.object({
    phone: z.string().regex(/^1[3-9]\d{9}$/, t('Please enter a valid phone number.')),
    code: z.string().regex(/^\d{6}$/, t('Please enter a 6-digit verification code.')),
  })

  const form = useForm({
    defaultValues: {
      phone: '',
      code: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await AuthService.phoneLogin(value)
        toast.success(t('Login successful!'))
      } catch {
        toast.error(t('Login failed!'))
      }
    },
  })

  // 📤 发送验证码
  const handleSendCode = useCallback(async () => {
    // 触发手机号字段校验
    await form.validateField('phone', 'blur')
    const phone = form.getFieldValue('phone')
    const phoneMeta = form.getFieldMeta('phone')
    if (!phone || (phoneMeta?.errors ?? []).length > 0) return // 校验失败则拦截

    setIsSending(true)
    try {
      // TODO: 请求短信接口获取手机验证码
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCountdown(60)
    } catch (error) {
      console.error('发送验证码失败', error)
    } finally {
      setIsSending(false)
    }
  }, [form])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {/* Phone Field */}
      <AnimatedField index={0}>
        <form.Field
          name="phone"
          validators={{ onChange: loginSchema.shape.phone }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t('Phone')}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={t('Enter your Phone number')}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  // 仅允许输入数字
                  const val = e.target.value.replace(/\D/g, '')
                  field.handleChange(val)
                }}
                aria-invalid={!!field.state.meta.errors.length}
                aria-describedby={field.state.meta.isTouched && field.state.meta.errors.length ? `${field.name}-error` : undefined}
                className={inputClasses}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />
      </AnimatedField>

      {/* Code Field */}
      <AnimatedField index={1}>
        <form.Field
          name="code"
          validators={{ onChange: loginSchema.shape.code }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t('Verification code')}</Label>
              <div className="flex gap-2.5">
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  autoComplete="one-time-code" // iOS/Android 自动读取短信验证码
                  placeholder={t('Enter your Verification code')}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    // 仅允许输入数字
                    const val = e.target.value.replace(/\D/g, '')
                    field.handleChange(val)
                  }}
                  aria-invalid={!!field.state.meta.errors.length}
                  aria-describedby={field.state.meta.isTouched && field.state.meta.errors.length ? `${field.name}-error` : undefined}
                  className={cn(inputClasses, 'flex-1')}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || isSending}
                  className="min-w-[100px] shrink-0 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-sm font-medium text-gray-900 shadow-sm transition-all duration-300 hover:border-violet-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-gray-300 disabled:hover:bg-white sm:w-[150px]"
                >
                  {isSending ? t('Sending...') : countdown > 0 ? t('{{countdown}}s', { countdown }) : t('Get code')}
                </button>
              </div>
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />
      </AnimatedField>

      <AnimatedField index={2}>
        <Button
          type="submit"
          className="h-12 w-full transform cursor-pointer rounded-xl bg-gray-900 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-xl active:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-gray-900 md:text-base"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? t('Logging in...') : t('Log in')}
        </Button>
      </AnimatedField>

      <AnimatedField index={3}>
        <SocialLoginButtons />
      </AnimatedField>

      <DividerWithText>{t('Or continue with')}</DividerWithText>

      <LoginOrSignup currentModel="phone" />
    </form>
  )
}
