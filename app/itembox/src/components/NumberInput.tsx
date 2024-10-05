import React, { useState, useEffect, InputHTMLAttributes } from 'react'
import BN from 'bn.js'
import { formatNumberBN, parseNumberBN } from '../utils/formatNumber'

interface NumberInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'onBlur' | 'max' | 'min'
  > {
  value: string
  onChange: (value: string) => void
  onBlur?: (value: string) => void
  max?: BN
  min?: BN
  decimals?: number
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  onBlur,
  max,
  min,
  decimals = 4,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  const handleBlur = () => {
    let numBN: BN
    try {
      numBN = parseNumberBN(value, decimals)
      console.log('Parsed BN Value:', numBN.toString()) // Debug point 1
    } catch {
      numBN = new BN(0) // Fallback to 0 if parsing fails
    }

    // Apply max limit if available
    if (max && numBN.gt(max)) {
      numBN = max
    }

    // Apply min limit if available
    if (min && numBN.lt(min)) {
      numBN = min
    }

    console.log('BN Value after min/max check:', numBN.toString()) // Debug point 2

    // Format the value and update state
    const formattedValue = formatNumberBN(numBN, decimals)
    console.log('Formatted Value:', formattedValue) // Debug point 3
    setDisplayValue(formattedValue)
    onChange(formattedValue)

    // Trigger onBlur callback if provided
    onBlur?.(formattedValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    onChange(inputValue)
  }

  return (
    <input
      type='text'
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={(e) => e.target.select()}
      {...props}
    />
  )
}
