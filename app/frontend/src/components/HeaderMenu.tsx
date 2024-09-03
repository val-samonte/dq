import { CaretLeft, List } from "@phosphor-icons/react"
import { useMemo } from "react"
import { Link, useLocation } from "react-router-dom"

export function HeaderMenu() {
  const location = useLocation()

  const navLinks = useMemo(() => {
    const common = [
      {
        type: 'back',
        value: '/',
      },
    ]
    if (location.pathname.toLowerCase() === '/tutorial') {
      return [
        ...common,
        {
          type: 'title',
          value: 'Tutorial',
        },
      ]
    }
    if (location.pathname.toLowerCase() === '/tutorial/basics') {
      return [
        {
          type: 'back',
          value: '/tutorial',
        },
        {
          type: 'title',
          value: 'Tutorial',
        },
        {
          type: 'title',
          value: '/ Basics',
        },
      ]
    }
    if (location.pathname.toLowerCase() === '/tutorial/battle') {
      return [
        {
          type: 'back',
          value: '/tutorial',
        },
        {
          type: 'title',
          value: 'Tutorial',
        },
        {
          type: 'title',
          value: '/ Battle',
        },
      ]
    } else if (location.pathname.toLowerCase().includes('practice')) {
      return [
        ...common,
        {
          type: 'title',
          value: 'Practice',
        },
      ]
    } else if (location.pathname.toLowerCase().includes('challenge')) {
      return [
        ...common,
        {
          type: 'title',
          value: 'Challenge',
        },
      ]
    }
    return [
      {
        type: 'title',
        value: 'Home',
      },
    ]
  }, [location])

  return (<nav className='flex flex-none px-3 py-2 justify-between items-center'>
    <div className='font-serif flex gap-2 items-center'>
      {navLinks.map((item, i) => {
        if (item.type === 'back') {
          return (
            <Link to={item.value} key={'nav_' + i}>
              <CaretLeft size={32} />
            </Link>
          )
        }
        return <span key={'nav_' + i}>{item.value}</span>
      })}
    </div>
    <button>
      <List size={32} />
    </button>
  </nav>)
}