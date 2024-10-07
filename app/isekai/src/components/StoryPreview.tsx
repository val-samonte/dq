import { ArrowFatLineRight, Trophy } from '@phosphor-icons/react'
import cn from "classnames"
import { useState } from "react"
import { SampleStoryDataType } from '../types'

export const StoryPreview = ({ sampleStoryData, label }: { sampleStoryData: SampleStoryDataType, label: string }) => {
  const [content, setContent] = useState(sampleStoryData.content[0])
  const [page, setPage] = useState(1)
  const maxPage = sampleStoryData.content.length

  const handleNextPage = () => {
    if (page >= maxPage) return
      setContent(sampleStoryData.content[page])
      setPage(page + 1)
    }

  return (<>
      <h1 className="text-center font-bold text-xl">{label}</h1>
      <div
        className="flex flex-col w-xl border-2 border-amber-300/50 rounded pr-6 pl-4 py-3 text-lg h-[400px] w-[300px] justify-end gap-4"
        style={{
          backgroundImage: 'url("/images/bg_library.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <img src={content.avatar} className={cn("flex-inline w-32", {"self-end": content.avatarPosition === "right"})} />
        <div className="flex border border-gray-500 rounded p-2 bg-white text-black">{content.dialog}</div>
        {page < maxPage ? <button
          onClick={handleNextPage}
          className={cn(
            'w-fit self-center justify-self-center',
            'flex items-center justify-center gap-3',
            'rounded pr-6 pl-4 py-3 text-md',
            'border-2 border-amber-300/50',
            'bg-gradient-to-t from-amber-800 to-yellow-800'
          )}
        >Next <ArrowFatLineRight size={24} /></button> : <Trophy size={32} className="flex self-center justify-self-center" />}

    </div>
  </>)
}