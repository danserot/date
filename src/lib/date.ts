export function localISO(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T12:00:00`)
  return Number.isFinite(parsed.getTime()) && localISO(parsed) === value && value >= localISO()
}

export function nextWeekday(weekday: number): string {
  const date = new Date()
  const delta = (weekday - date.getDay() + 7) % 7
  date.setDate(date.getDate() + (delta === 0 && date.getHours() >= 19 ? 7 : delta))
  return localISO(date)
}

export function formatDate(value: string, long = true): string {
  if (!value) return 'День ещё выбираем'
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: long ? 'long' : 'short', ...(long ? { weekday: 'long' as const } : {}),
    ...(new Date(`${value}T12:00:00`).getFullYear() !== new Date().getFullYear() ? { year: 'numeric' as const } : {}),
  }).format(new Date(`${value}T12:00:00`))
}
