import { X } from "@phosphor-icons/react"
import { useAtomValue, useSetAtom } from "jotai"
import { BlueprintsGrid } from "./BlueprintsGrid"
import { useEffect } from "react"
import { useUserWallet } from "../atoms/userWalletAtom"
import { userBlueprintsAtom } from "../atoms/userBlueprintsAtom"
interface BpModalProps {
  handleClose: () => void
}
export const BpModal = ({ handleClose }: BpModalProps) => {
  const wallet = useUserWallet()
  const walletAddress = wallet?.publicKey?.toBase58()
  const blueprintIds = useAtomValue(userBlueprintsAtom(walletAddress ?? ''))

  const reload = useSetAtom(userBlueprintsAtom(walletAddress ?? ''))

  useEffect(() => {
    reload()
  }, [])

  return (
    <div aria-hidden="true" className="modal-backdrop overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-fit max-w-fit max-h-full">
        <div className="relative rounded-lg shadow bg-stone-700 text-white">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600">
              <h3 className="text-xl font-semibold text-white">
                  Select a Blueprint
              </h3>
              <X size={16} className="cursor-pointer" onClick={handleClose} />
          </div>
          <div className="p-4 md:p-5">
            <BlueprintsGrid ids={blueprintIds as string[]} simpleView={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
