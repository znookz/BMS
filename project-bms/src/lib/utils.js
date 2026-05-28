export function formatBaht(n, decimals = 0) {
  return '฿' + (Number(n) || 0).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatNumber(n) {
  return (Number(n) || 0).toLocaleString('en-US')
}

export function bahtCompact(n) {
  if (n >= 1_000_000) return '฿' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000)     return '฿' + (n / 1_000).toFixed(1) + 'K'
  return '฿' + n
}

export function initials(name) {
  const parts = (name || '').trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
