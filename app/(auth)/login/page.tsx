'use client'

import { useForm } from '@tanstack/react-form'
import z from 'zod'

import { Button } from '@/components/ui/button'
import { DividerWithText } from '@/components/ui/divider-with-text'
import { FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { cn } from '@/lib/cn'

// 定义 Zod Schema 校验规则
const loginSchema = z.object({
  email: z.email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要 6 个字符').max(20, '密码最长 20 个字符'),
})

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

export default function LoginPage() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-3xl md:mb-2.5 md:text-4xl lg:text-5xl">欢迎回来</h1>
        <p className="text-base leading-relaxed font-medium text-gray-600 md:text-base">登录您的账户</p>
      </div>

      {/* Login Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Email Field */}
        <form.Field
          name="email"
          validators={{ onChange: loginSchema.shape.email }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>邮箱</Label>
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

        {/* Password Field */}
        <form.Field
          name="password"
          validators={{ onChange: loginSchema.shape.password }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>密码</Label>
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

        <Button
          type="submit"
          className="animate-fade-in h-12 w-full transform cursor-pointer rounded-xl bg-gray-900 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-xl active:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-gray-900 md:text-base"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? '登录中...' : '登录'}
        </Button>

        <DividerWithText>或继续使用</DividerWithText>
      </form>
    </div>
  )
}
