import { GithubLogo } from '@phosphor-icons/react'

export function Footer() {
  return (
    <footer className='w-full max-w-7xl mx-auto'>
      <div className='py-32 px-5 text-center flex items-center justify-center'>
        <a
          href='https://github.com/val-samonte/dq'
          target='_blank'
          rel='noreferrer noopener'
        >
          <GithubLogo size={32} />
        </a>
      </div>
    </footer>
  )
}
