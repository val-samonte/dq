import { useAtomValue } from 'jotai'
import { commandChecklistAtom, commandGroupAtom } from '../atoms/commandsAtom'
import { ElementSymbol } from './ElementSymbol'
import { Command } from '../types/Command'
import { inputUnitPointsAtom } from '../atoms/inputUnitPointsAtom'
import cn from 'classnames'
import { Check } from '@phosphor-icons/react'

export function CommandList() {
  const commands = useAtomValue(commandGroupAtom)

  return (
    <div className='w-full flex flex-col gap-5 text-white pb-5'>
      {commands.skills.length > 0 && (
        <CommandSection title='Skills' commands={commands.skills} />
      )}
      {commands.enhancements.length > 0 && (
        <CommandSection title='Enhancements' commands={commands.enhancements} />
      )}
      {commands.conjurations.length > 0 && (
        <CommandSection title='Conjurations' commands={commands.conjurations} />
      )}
      {commands.transmutations.length > 0 && (
        <CommandSection
          title='Transmutations'
          commands={commands.transmutations}
        />
      )}
    </div>
  )
}

function CommandSection({
  title,
  commands,
}: {
  title: string
  commands: Command[]
}) {
  const select = useAtomValue(inputUnitPointsAtom)
  const checklist = useAtomValue(commandChecklistAtom)

  return (
    <section className='flex flex-col gap-3 select-none'>
      <h3 className='bg-stone-900 px-3 py-2 sticky top-0'>{title}</h3>
      <ul className='flex flex-col gap-3 text-sm px-3'>
        {commands.map((command, i) => {
          const inList = checklist.find((c) => c.name === command.name)
          return (
            <li key={`command_${i}`} className='flex flex-col gap-1 flex-wrap'>
              <h4 className='flex items-center justify-between'>
                <span>{command.name}</span>
                {inList && (
                  <span className='w-5 h-5 flex items-center justify-center border border-stone-500/20 text-green-400'>
                    {inList.checked && <Check size={16} />}
                  </span>
                )}
              </h4>
              <ul className='flex flex-col gap-1 flex-wrap'>
                {command.links.map((link, j) => (
                  <li key={`link_${j}`} className='flex-none flex-wrap'>
                    <div className='flex items-center gap-1 flex-none flex-wrap'>
                      {link.elements.map((elem, k) => (
                        <div
                          key={`elem_${k}`}
                          className={cn(
                            'flex items-center gap-1 flex-none',
                            select.length !== 0 &&
                              k >= select.length &&
                              'opacity-30'
                          )}
                        >
                          <ElementSymbol elem={elem} />
                          {k < link.elements.length - 1 && (
                            <span className='text-sm'>➧</span>
                          )}
                        </div>
                      ))}
                      {link.output && (
                        <>
                          <span className='text-sm mx-1'>=</span>
                          <ElementSymbol elem={link.output} />
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
