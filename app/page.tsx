import { redirect } from 'next/navigation'

/**
 * 首页 (/) —— 重定向到 Plaza(广场)页
 * Plaza 页面本体在 app/(studio)/plaza;左侧共用导航栏由 (studio)/layout.tsx 提供
 */
export default function HomePage() {
  redirect('/plaza')
}
