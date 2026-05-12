export function isArray(value: any): boolean {
  return Array.isArray(value)
}

// 非空数组
export function isValidArray(value: any): boolean {
  return Array.isArray(value) && value.length > 0
}
