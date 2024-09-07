import { Eye, EyeSlash } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'

export interface AuthFormProps {
  username: string
  submitLabel?: string | ReactNode
  children?: ReactNode
  newAccount?: boolean
  onSubmit: ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => void
}

export function AuthForm({
  username,
  children,
  submitLabel,
  newAccount,
  onSubmit,
}: AuthFormProps) {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ username, password })
      }}
      action='#'
      method='post'
      className='flex flex-col relative text-center'
    >
      {children}
      <input
        style={{ visibility: 'hidden' }}
        type='text'
        id='username'
        name='username'
        autoComplete='username'
        defaultValue={username}
        readOnly
      />
      <div className='relative w-full'>
        <input
          className='bg-stone-900 rounded px-10 py-2 text-center w-full'
          autoFocus
          type={!visible ? 'password' : 'text'}
          id='password'
          name='password'
          autoComplete={newAccount ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type='button'
          onClick={() => setVisible((v) => !v)}
          className='absolute right-0 top-0 h-full flex items-center justify-center aspect-square'
        >
          {!visible ? <Eye size={20} /> : <EyeSlash size={20} />}
        </button>
      </div>
      <button
        className='mt-5 px-3 py-2 bg-amber-100 rounded text-stone-800 flex items-center justify-center gap-2'
        type='submit'
      >
        {submitLabel ?? 'Submit'}
      </button>
    </form>
  )
}
