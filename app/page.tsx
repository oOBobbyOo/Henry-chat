import Link from 'next/link'

export default async function Home() {
  // ⏱️ 测试延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  return (
    <div>
      <h1>APP</h1> <br />
      <Link href="/rankings">Rankings</Link>
    </div>
  )
}
