export const parseNumber = (num: string, fallback?: number) => {
  num = num ?? ''
  let cleanNum = num.replace(/[^0-9.,]/g, '')

  cleanNum = cleanNum.replace(/,/g, '.')

  const parts = cleanNum.split('.')

  if (parts.length > 2) {
    cleanNum =
      parts.slice(0, parts.length - 1).join('') + '.' + parts.slice(-1).join('')
  }

  if (typeof fallback !== 'undefined') {
    const result = parseFloat(cleanNum)
    return isNaN(result) ? fallback : result
  }

  return parseFloat(cleanNum)
}

export const formatNumber = (num: string, decimals = 4) => {
  const numValue = parseNumber(num)
  return isNaN(numValue)
    ? ''
    : numValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
}
