export function apiErrorMessage(error, fallback) {
  const detail = error.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((item) => {
      const field = (item.loc || []).filter((part) => part !== 'body').join(' ').replaceAll('_', ' ')
      return `${field ? `${field}: ` : ''}${item.msg}`
    }).join('; ')
  }
  return fallback
}
