import { cn } from '@/lib/cn'

interface DividerWithTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DividerWithText({ children, className, ...props }: DividerWithTextProps) {
  return (
    <div
      className={cn('relative flex items-center justify-center py-2', className)}
      {...props}
    >
      {/* 横线 */}
      <div className="absolute inset-0 flex items-center">
        <span className="border-border w-full border-t" />
      </div>

      {/* 文字遮罩层 */}
      <span className="bg-card text-muted-foreground relative z-10 px-3 text-xs uppercase">{children}</span>
    </div>
  )
}
