import { dayjs } from './dayjs'

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

/**
 * Format date to string
 * @param date - Unix timestamp (seconds), date string, or Date object
 * @param formatStr - dayjs format string, default 'YYYY-MM-DD'
 */
export function formatDate(date: number | string | Date, formatStr: string = 'YYYY-MM-DD'): string {
  let d: dayjs.Dayjs

  // 如果是数字且为秒级时间戳（小于 10 位数），转为毫秒
  if (typeof date === 'number') {
    d = date < 1e10 ? dayjs(date * 1000) : dayjs(date)
  } else {
    d = dayjs(date)
  }

  return d.format(formatStr)
}
