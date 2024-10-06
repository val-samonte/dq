import cn from 'classnames'

export const StoryThumbnail = ({ name }: { name: string }) => {
  return (
    <a href="/story/D5uDLb353MoaJHFGk8FuB2mosjkboJ8Zdgnxwz6EDDnB" className={cn("relative group h-64 bg-center bg-cover border-gray-600 rounded-lg border-4 hover:border-gray-200 overflow-hidden transition-all duration-500 group-hover:rounded-3xl w-fullflex cursor-pointer")} style={{ backgroundImage: `url('/images/bg_bar.png')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:backdrop-blur-sm backdrop-blur-none transition-all duration-500"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-white text-lg font-bold">{name}</span>
      </div>
    </a>
  )
}