import { cn } from '@/lib/utils'

interface AnimatedFieldProps {
  children: React.ReactNode
  index?: number // 字段索引，用于计算延迟
  animateName?: string // 动画名称
  delayMs?: number // 每个字段间隔延迟（默认 100ms）
  className?: string
}

function AnimatedField({ children, index = 0, animateName = 'animate-fade-slide-up', delayMs = 100, className }: AnimatedFieldProps) {
  return (
    <div
      className={cn(animateName, className)}
      style={{ animationDelay: `${index * delayMs}ms` }}
    >
      {children}
    </div>
  )
}

export { AnimatedField }
