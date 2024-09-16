import QRCodeStyling from 'qr-code-styling'
import { useEffect, useRef } from 'react'

const qrCode = new QRCodeStyling({
  width: 256,
  height: 256,
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 20,
  },
})

export function QRCode({ data }: { data?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current)
    }
  }, [])

  useEffect(() => {
    qrCode.update({
      data,
    })
  }, [data])

  if (!data) return <div className='mx-auto w-64 aspect-square bg-white' />
  return <div ref={ref} className='mx-auto w-64 aspect-square bg-white' />
}
