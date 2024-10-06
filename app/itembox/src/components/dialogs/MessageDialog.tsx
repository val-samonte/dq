import { atom, useAtom } from 'jotai'
import Dialog from '../Dialog'
import { ReactNode, Suspense, useEffect, useState } from 'react'
import { DialogCommonPanel } from './DialogCommonPanel'

interface MessageDialogProps {
  title: string
  message: ReactNode
}

export const messageAtom = atom<MessageDialogProps | null>(null)

function Content() {
  const [data, setData] = useAtom(messageAtom)
  const [lastData, setLastData] = useState(data)

  useEffect(() => {
    if (data) {
      setLastData(data)
    }
  }, [data])

  return (
    <DialogCommonPanel
      title={lastData?.title || ''}
      onClose={() => {
        setData(null)
      }}
    >
      {lastData?.message}
    </DialogCommonPanel>
  )
}

export function MessageDialog() {
  const [data, setData] = useAtom(messageAtom)
  return (
    <Dialog
      show={!!data}
      onClose={() => {
        setData(null)
      }}
    >
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </Dialog>
  )
}
