import { SideBar } from "./SideBar"
import { ArrowLeft } from "@phosphor-icons/react"
import { StoryPreview } from "./StoryPreview"
import { useAtomValue } from "jotai"
import sampleStoryAtom from "../atoms/sampleStoryAtom"

export const ShowStoryPage = () => {
  // not used atm, still using dummy data
  // const { storyId } = useParams()
  const sampleStoryData = useAtomValue(sampleStoryAtom)

  return (<div className="absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden">
    <div className="content flex h-full">
      <SideBar />
      <div className="inner-content flex flex-col w-full justify-start p-6 items-center gap-4">
        <a href="/stories" className="flex flex-inline text-white self-start justify-self-start w-[200px] align-middle justify-start gap-2" >
          <ArrowLeft size={32} className="flex-inline"/>
          <span className="flex-inline text-center justify-center align-middle">Go Back</span>
        </a>
        <StoryPreview sampleStoryData={sampleStoryData} label="Story Preview" />
      </div>
    </div>
  </div>)
}
