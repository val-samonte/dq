import { BN } from '@coral-xyz/anchor'

// Helper function to handle decimals with BN
const scaleToInteger = (value: string, decimals: number): BN => {
  const cleanedValue = value.replace(/[^0-9.,]/g, '').replace(/,/g, '.')
  const [integerPart, fractionalPart = ''] = cleanedValue.split('.')
  const scaledFraction = fractionalPart.padEnd(decimals, '0').slice(0, decimals)
  return new BN(integerPart + scaledFraction)
}

// Function to parse a number string into BN
export const parseNumberBN = (
  num: string,
  decimals: number,
  fallback?: BN
): BN => {
  try {
    const cleanNum = num ?? ''
    const bnValue = scaleToInteger(cleanNum, decimals)
    return bnValue
  } catch {
    if (typeof fallback !== 'undefined') {
      return fallback
    }
    throw new Error('Invalid number format')
  }
}

// Function to format a BN value to a string with decimals
export const formatNumberBN = (bn: BN, decimals: number = 4): string => {
  const bnStr = bn.toString().padStart(decimals + 1, '0')
  const integerPart = bnStr.slice(0, bnStr.length - decimals) || '0'
  const fractionalPart = bnStr.slice(-decimals).padEnd(decimals, '0')

  const formattedNumber = `${integerPart}.${fractionalPart}`
  return parseFloat(formattedNumber).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function convertToBN(valueStr: string, decimals: number) {
  const cleanedValueStr = valueStr.replace(/,/g, '')

  const [integerPart, fractionalPart = ''] = cleanedValueStr.split('.')

  let fullFractionalPart = fractionalPart

  if (decimals === 0) {
    fullFractionalPart = ''
  } else {
    fullFractionalPart = fractionalPart.padEnd(decimals, '0')
  }

  const integerRepresentation = integerPart + fullFractionalPart

  return new BN(integerRepresentation)
}
