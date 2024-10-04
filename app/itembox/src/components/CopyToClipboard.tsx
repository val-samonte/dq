import { ReactNode, useState } from 'react'

export function CopyToClipboard({
  children,
  content,
}: {
  children: ReactNode
  content: string
}) {
  const [showCopied, setShowCopied] = useState(false)

  const show = () => {
    setShowCopied(true)
    setTimeout(() => {
      setShowCopied(false)
    }, 1000)
  }

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(content)
        show()
      }}
      className='flex flex-col items-center justify-center flex-none mx-auto'
    >
      {showCopied && (
        <div className='relative'>
          <div className='absolute -top-8 bg-slate-700 rounded px-2 py-1 flex -translate-x-[50%]'>
            Copied!
          </div>
        </div>
      )}
      {children}
    </button>
  )
}
