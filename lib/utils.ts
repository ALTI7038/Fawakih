export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function formatPrice(value: number | string): string {
  const n = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(n)) return 'RM 0.00'
  return `RM ${n.toFixed(2)}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
