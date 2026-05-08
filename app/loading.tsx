export default function Loading() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex animate-[fade-in_0.4s_ease-out_forwards] flex-col items-center gap-4">
        {/* 双层交错旋转加载器 */}
        <div className="relative flex h-14 w-14 items-center justify-center">
          {/* 外圈轨道 */}
          <div className="border-muted/20 absolute h-full w-full rounded-full border-[3px]" />
          {/* 主旋转环 */}
          <div className="absolute h-full w-full animate-spin rounded-full border-[3px] border-transparent border-t-violet-500" />
          {/* 延迟内环（增加动感） */}
          <div
            className="absolute h-10 w-10 animate-spin rounded-full border-[3px] border-transparent border-b-violet-400"
            style={{ animationDelay: '0.25s', animationDirection: 'reverse' }}
          />
          {/* 中心呼吸点 */}
          <div className="relative z-10 h-3 w-3 animate-pulse rounded-full bg-violet-500/90 shadow-lg shadow-violet-500/20" />
        </div>

        {/* 状态文字 */}
        <div className="text-center text-sm font-medium tracking-wide">
          <p className="text-foreground">正在加载页面</p>
          <p className="text-muted-foreground animate-pulse text-xs">请稍候...</p>
        </div>
      </div>
    </main>
  )
}
