import { CaretLeft, List } from "@phosphor-icons/react"
import { useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"

export function HeaderMenu() {
  const [showMenu, setShowMenu] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

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

  return (<nav className='flex flex-none px-3 py-2 justify-between items-center relative'>
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
    <button data-collapse-toggle="navbar-hamburger" type="button" className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false" onClick={toggleMenu}>
      <span className="sr-only">Open main menu</span>
      <List size={32} />
    </button>
    <div className={`${!showMenu && 'hidden'} w-full absolute inset-x-0 top-10 h-16 z-50`} id="navbar-hamburger">
      <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <li>
          <a href="/" className="block py-2 px-3 bg-sky-300 rounded dark:bg-sky-300 text-black" aria-current="page">Home</a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Settings</a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white">Connect Wallet</a>
        </li>
      </ul>
    </div>
  </nav>)
}