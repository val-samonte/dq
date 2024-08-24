import { useAtomValue } from 'jotai'
import { inputUnitPointsAtom } from '../atoms/inputUnitPointsAtom'
import { useEffect } from 'react'
import { playSound } from '../utils/playSound'

export function SoundFX() {
  const unitPoints = useAtomValue(inputUnitPointsAtom)

  useEffect(() => {
    if (unitPoints.length === 0) return
    playSound(
      [
        {
          frequency: 140 + unitPoints.length * 80,
          duration: 0.1,
        },
        {
          frequency: 140 + unitPoints.length * 120,
          duration: 0.1,
        },
      ],
      0.1
    )
  }, [unitPoints])

  return null
}
