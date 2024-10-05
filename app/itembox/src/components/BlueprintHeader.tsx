import { Link } from 'react-router-dom'

interface BlueprintHeaderProps {
  to: string
  image: string
  name: string
  title: string
}

export function BlueprintHeader({
  to,
  name,
  image,
  title,
}: BlueprintHeaderProps) {
  return (
    <Link to={to} className='flex gap-5 items-center lg:py-5'>
      <div className='w-24 h-24 aspect-square rounded-lg overflow-hidden'>
        <img src={image} className='w-full h-full object-contain ' />
      </div>
      <h1 className='text-xl lg:text-4xl tracking-wider'>
        <span className='text-base'>{title}</span>
        <br /> {name}
      </h1>
    </Link>
  )
}
