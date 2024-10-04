import React, { useState, useEffect, InputHTMLAttributes } from 'react'
import { formatNumber, parseNumber } from '../utils/formatNumber'

interface NumberInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'onBlur' | 'max'
  > {
  value: string
  onChange: (value: string) => void
  onBlur?: (value: string) => void
  max?: number
  min?: number
  decimals?: number
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  onBlur,
  max,
  min,
  decimals,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  const handleBlur = () => {
    let num = parseNumber(value, 0)

    if (typeof max === 'number') {
      num = Math.min(num, max)
    }

    if (typeof min === 'number') {
      num = Math.max(num, min)
    }

    const formattedValue = formatNumber(num + '', decimals)
    setDisplayValue(formattedValue)
    onChange(formattedValue)

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
