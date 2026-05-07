import * as React from 'react'

import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/cn'

import { Input } from './input'

export function PasswordInput({ className, ...props }: React.ComponentProps<'input'>) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)} // pr-10 为右侧图标预留空间
        {...props}
      />
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-0 right-0 h-full rounded-r-md px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? '隐藏密码' : '显示密码'}
        tabIndex={-1} // 避免 Tab 键优先聚焦到眼睛按钮
      >
        {showPassword ? (
          <EyeOff
            className="h-4 w-4"
            aria-hidden="true"
          />
        ) : (
          <Eye
            className="h-4 w-4"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  )
}
