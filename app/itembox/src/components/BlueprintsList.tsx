import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import { BlueprintPill } from './BlueprintPill'
import { blueprintsListAtom } from '../atoms/tokensListAtom'

export function BlueprintsList() {
  const { blueprintId } = useParams()
  const blueprintIds = useAtomValue(blueprintsListAtom)

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5 px-3 lg:px-5 pb-3 lg:pb-5'>
      {blueprintIds
        .filter((id) => id !== blueprintId)
        .map((id) => (
          <BlueprintPill key={id} id={id} />
        ))}
    </div>
  )
}
