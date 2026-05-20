'use client'

import Link from 'next/link'

import { useForm } from '@tanstack/react-form'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'
import z from 'zod'

import { AnimatedField } from '@/components/ui/animated-field'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DividerWithText } from '@/components/ui/divider-with-text'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { cn } from '@/lib/utils'
import { AuthService } from '@/services/auth'

import { LoginOrSignup } from './LoginOrSignup'

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

export function EmailLoginForm() {
  const { t } = useT('auth')

  // 定义 Zod Schema 校验规则
  const loginSchema = z.object({
    email: z.email(t('Please enter a valid phone number.')),
    password: z
      .string()
      .min(6, t('Passwords must be at least {{number}} characters long.', { number: 6 }))
      .max(20, t('Passwords must be at most {{number}} characters long.', { number: 20 })),
    remember: z.boolean().optional(),
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember: false, // 默认未勾选
    },
    onSubmit: async ({ value }) => {
      const { email, password } = value
      try {
        await AuthService.emailLogin({ email, password })
        toast.success(t('Login successful!'))
      } catch {
        toast.error(t('Login failed!'))
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {/* Email Field */}
      <AnimatedField index={0}>
        <form.Field
          name="email"
          validators={{ onChange: loginSchema.shape.email }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t('Email')}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={!!field.state.meta.errors.length}
                aria-describedby={field.state.meta.isTouched && field.state.meta.errors.length ? `${field.name}-error` : undefined}
                className={inputClasses}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />
      </AnimatedField>

      {/* Password Field */}
      <AnimatedField index={1}>
        <form.Field
          name="password"
          validators={{ onChange: loginSchema.shape.password }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t('Password')}</Label>
              <PasswordInput
                id={field.name}
                name={field.name}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={!!field.state.meta.errors.length}
                aria-describedby={field.state.meta.isTouched && field.state.meta.errors.length ? `${field.name}-error` : undefined}
                className={inputClasses}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />
      </AnimatedField>

      <AnimatedField index={2}>
        <div className="flex items-center justify-between gap-2">
          <form.Field
            name="remember"
            children={(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className="border-gray-300 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600"
                />
                <Label
                  htmlFor={field.name}
                  className="text-muted-foreground cursor-pointer text-sm font-normal select-none"
                >
                  {t('Remember me')}
                </Label>
              </div>
            )}
          />

          <Link
            href="/forgot-password"
            className="focus-visible:ring-ring rounded-md text-sm font-medium text-violet-400 hover:text-violet-600 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t('Forgot password?')}
          </Link>
        </div>
      </AnimatedField>

      <AnimatedField index={3}>
        <Button
          type="submit"
          className="h-12 w-full transform cursor-pointer rounded-xl bg-gray-900 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-xl active:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-gray-900 md:text-base"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? t('Logging in...') : t('Log in')}
        </Button>
      </AnimatedField>

      <DividerWithText>{t('Or continue with')}</DividerWithText>

      <LoginOrSignup currentModel="email" />
    </form>
  )
}
