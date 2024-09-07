import { useAtomValue } from 'jotai'
import { commandGroupAtom } from '../atoms/commandsAtom'
import { ElementSymbol } from './ElementSymbol'
import { Command } from '../types/Command'
import { inputUnitPointsAtom } from '../atoms/inputUnitPointsAtom'
import cn from 'classnames'
import { Check } from '@phosphor-icons/react'
import { manaAtom } from '../atoms/hud'

export type Checklist = { name: string; checked: boolean; level?: number }[]

export function CommandList({ checklist }: { checklist?: Checklist }) {
  const commands = useAtomValue(commandGroupAtom)

  return (
    <div className='w-full flex flex-col gap-5 text-white pb-5'>
      {commands.skills.length > 0 && (
        <CommandSection
          title='Skills'
          commands={commands.skills}
          checklist={checklist}
        />
      )}
      {commands.conjurations.length > 0 && (
        <CommandSection
          title='Conjurations'
          commands={commands.conjurations}
          checklist={checklist}
        />
      )}
      {commands.enhancements.length > 0 && (
        <CommandSection
          title='Enhancements'
          commands={commands.enhancements}
          checklist={checklist}
        />
      )}
      {commands.transmutations.length > 0 && (
        <CommandSection
          title='Transmutations'
          commands={commands.transmutations}
          checklist={checklist}
        />
      )}
    </div>
  )
}

function CommandSection({
  title,
  commands,
  checklist,
}: {
  title: string
  commands: Command[]
  checklist?: Checklist
}) {
  const select = useAtomValue(inputUnitPointsAtom)
  const mana = useAtomValue(manaAtom)

  return (
    <section className='flex flex-col gap-3 select-none'>
      <h3 className='bg-stone-900 px-3 py-2 sticky top-0 z-10 font-serif text-sm'>
        {title}
      </h3>
      <ul className='flex flex-col gap-3 text-sm px-3'>
        {commands.map((command, i) => {
          const inList = (checklist ?? []).find((c) => c.name === command.name)
          return (
            <li
              key={`command_${i}`}
              className={cn(
                'flex flex-col gap-1 flex-wrap transition-all',
                typeof mana === 'undefined' || (mana ?? 0) >= command.cost
                  ? 'opacity-100'
                  : 'opacity-50'
              )}
            >
              <h4 className='flex items-center justify-between gap-1'>
                <span>{command.name}</span>
                {mana !== null && (
                  <span className='text-xs'>{command.cost}</span>
                )}
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
