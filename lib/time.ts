import dayjs from 'dayjs'

export function formatTime(date: Date): string {
  const d = dayjs(date)
  const now = dayjs()

  // 如果是今天，只显示时分
  if (d.isSame(now, 'day')) {
    return d.format('HH:mm')
  }

  // 如果是今年，显示 月-日 时:分
  if (d.isSame(now, 'year')) {
    return d.format('MM-DD HH:mm')
  }

  // 跨年显示 年-月-日 时:分
  return d.format('YYYY-MM-DD HH:mm')
}
