import { SideBar } from "./SideBar"
import sampleStoryAtom from '../atoms/sampleStoryAtom'
import { useAtomValue } from "jotai"
import { useState } from "react"
import cn from "classnames"
import { ArrowFatLineRight, ArrowLeft, Trophy } from "@phosphor-icons/react"

export const ShowStoryPage = () => {
  // not used atm, still using dummy data
  // const { storyId } = useParams()
  const sampleStoryData = useAtomValue(sampleStoryAtom)
  const [content, setContent] = useState(sampleStoryData.content[0])
  const [page, setPage] = useState(1)
  const maxPage = sampleStoryData.content.length

  const handleNextPage = () => {
    if (page >= maxPage) return
    setContent(sampleStoryData.content[page])
    setPage(page + 1)
  }

  return (<div className="absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden">
    <div className="content flex h-full">
      <SideBar />
      <div className="inner-content flex flex-col w-full justify-start p-6 items-center gap-4">
        <a href="/stories" className="flex flex-inline text-white self-start justify-self-start w-[200px] align-middle justify-start gap-2" >
          <ArrowLeft size={32} className="flex-inline"/>
          <span className="flex-inline text-center justify-center align-middle">Go Back</span>
        </a>
        <h1 className="text-center font-bold text-xl">Story Preview</h1>
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
      </div>
    </div>
  </div>)
}
