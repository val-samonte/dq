import { CardsThree, CirclesThreePlus } from '@phosphor-icons/react'

export function SideBar() {
  return (
<div className="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0 h-full">
    <div className="flex items-center justify-center mt-8">
        <div className="flex items-center">
            <span className="mx-2 text-2xl font-semibold text-white">Isekai Dashboard</span>
        </div>
    </div>

    <nav className="mt-10">
        <a className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="/stories">
            <CirclesThreePlus size={32} />

            <span className="mx-3">Created Stories</span>
        </a>

        <a className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="/blueprints">
            <CardsThree size={32} />

            <span className="mx-3">Imported Blueprints</span>
        </a>
    </nav>
</div>
  )
}