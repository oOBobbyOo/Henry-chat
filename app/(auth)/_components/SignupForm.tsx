'use client'

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
import { PasswordInput } from '@/components/ui/password-input'
import { cn } from '@/lib/utils'
import { AuthService } from '@/services/auth'

import { LoginOrSignup } from '../_components/LoginOrSignup'

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

export function SignupForm() {
  const { t } = useT('auth')

  // 定义 Zod Schema 校验规则
  const signupSchema = z.object({
    name: z.string().min(2, t('Enter your username')),
    email: z.email(t('Please enter a valid phone number.')),
    password: z
      .string()
      .min(6, t('Passwords must be at least {{number}} characters long.', { number: 6 }))
      .max(20, t('Passwords must be at most {{number}} characters long.', { number: 20 })),
    confirmPassword: z.string().min(1, t('Please enter your password again.')),
  })

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      const { name, email, password } = value
      try {
        await AuthService.signup({ name, email, password })
        toast.success(t('Sign up successful!'))
      } catch {
        toast.error(t('Sign up failed!'))
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
      {/* Name Field */}
      <AnimatedField index={0}>
        <form.Field
          name="name"
          validators={{ onChange: signupSchema.shape.name }}
        >
          {(field) => (
            <AnimatedField index={1}>
              <div className="space-y-2">
                <Label htmlFor={field.name}>{t('Username')}</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  placeholder={t('Enter your username')}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-describedby={field.state.meta.isTouched && field.state.meta.errors.length ? `${field.name}-error` : undefined}
                  className={inputClasses}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            </AnimatedField>
          )}
        </form.Field>
      </AnimatedField>

      {/* Email Field */}
      <AnimatedField index={1}>
        <form.Field
          name="email"
          validators={{ onChange: signupSchema.shape.email }}
          children={(field) => (
            <AnimatedField index={2}>
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
            </AnimatedField>
          )}
        />
      </AnimatedField>

      {/* Password Field */}
      <AnimatedField index={2}>
        <form.Field
          name="password"
          validators={{ onChange: signupSchema.shape.password }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t('Password')}</Label>
              <PasswordInput
                id={field.name}
                name={field.name}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
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

      {/* ConfirmPassword Field */}
      <AnimatedField index={3}>
        <form.Field
          name="confirmPassword"
          validators={{
            onChange: signupSchema.shape.confirmPassword,
            // 失去焦点时比对两次密码
            onBlur: ({ value, fieldApi }) => {
              return value !== fieldApi.form.getFieldValue('password') ? { message: '两次输入的密码不一致' } : undefined
            },
          }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t('Confirm Password')}</Label>
              <PasswordInput
                id={field.name}
                name={field.name}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
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

      <AnimatedField index={4}>
        <Button
          type="submit"
          className="h-12 w-full transform cursor-pointer rounded-xl bg-gray-900 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-xl active:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-gray-900 md:text-base dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:disabled:hover:bg-white"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? t('Signing up...') : t('Sign Up')}
        </Button>
      </AnimatedField>

      <DividerWithText>{t('Or continue with')}</DividerWithText>

      <LoginOrSignup currentModel="signup" />
    </form>
  )
}
