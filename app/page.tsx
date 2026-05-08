export default async function Home() {
  // ⏱️ 测试延迟
  await new Promise((resolve) => setTimeout(resolve, 2500))

  return <div>app</div>
}
