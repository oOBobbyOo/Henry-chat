'use client'

import { useState } from 'react'

import Link from 'next/link'

import { useForm } from '@tanstack/react-form'
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useT } from 'next-i18next/client'
import { toast } from 'sonner'
import z from 'zod'

import { AnimatedField } from '@/components/ui/animated-field'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { AuthService } from '@/services/auth'

// 复用统一输入框样式（增加左侧图标内边距）
const inputClasses = cn(
  'h-12',
  'border-gray-300 dark:border-gray-600',
  'focus-visible:border-violet-500',
  'focus-visible:ring-0 focus-visible:ring-offset-0',
  'shadow-sm shadow-gray-200/60 dark:shadow-gray-800/60',
  'focus-visible:shadow-lg focus-visible:shadow-violet-500/20',
)

export function ForgotPasswordForm() {
  const { t } = useT('auth')

  const [isSuccess, setIsSuccess] = useState(false)

  // 校验规则
  const forgotSchema = z.object({
    email: z.email(t('Please enter a valid email address.')),
  })

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      try {
        await AuthService.forgotPassword(value)
        setIsSuccess(true)
      } catch {
        toast.error(t('Email sending failed!'))
      }
    },
  })

  // 🔹 成功状态 UI
  if (isSuccess) {
    return (
      <AnimatedField index={0}>
        <div className="space-y-6 py-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{t('Email Sent')}</h3>
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">{form.getFieldValue('email')}</span> {t('Has been sent a password reset link.')} {t('Please check your inbox (and spam folder).')}
            </p>
          </div>
          <Link href="/login?model=email">
            <Button
              variant="outline"
              className="flex h-12 w-full flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-750"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('Back to Log In')}
            </Button>
          </Link>
        </div>
      </AnimatedField>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-5"
    >
      <AnimatedField index={0}>
        <form.Field
          name="email"
          validators={{ onChange: forgotSchema.shape.email }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t('Email')}</Label>
              <div className="relative">
                <Input
                  id={field.name}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t('Enter your registered email')}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={!!field.state.meta.errors.length}
                  aria-describedby={field.state.meta.isTouched && field.state.meta.errors.length ? `${field.name}-error` : undefined}
                  className={cn(inputClasses, 'pl-10')}
                />
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              </div>
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />
      </AnimatedField>

      <AnimatedField index={1}>
        <Button
          type="submit"
          className="h-12 w-full transform cursor-pointer rounded-xl bg-gray-900 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-xl active:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-gray-900 md:text-base"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? t('Sending...') : t('Send Reset Link')}
        </Button>
      </AnimatedField>

      <AnimatedField index={2}>
        <Link
          href="/login?model=email"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('Back to Log In')}
        </Link>
      </AnimatedField>
    </form>
  )
}
