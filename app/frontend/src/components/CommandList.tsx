import { useAtomValue } from 'jotai'
import { commandsAtom } from '../atoms/commandsAtom'
import { ElementSymbol } from './ElementSymbol'
import { Command } from '../types/Command'

export function CommandList() {
  const commands = useAtomValue(commandsAtom)

  return (
    <div className='max-w-sm w-full flex flex-col gap-5 text-white p-5'>
      {commands.skills.length > 0 && (
        <CommandSection title='Skills' commands={commands.skills} />
      )}
      {commands.enhancements.length > 0 && (
        <CommandSection title='Enhancements' commands={commands.enhancements} />
      )}
      {commands.transmutations.length > 0 && (
        <CommandSection
          title='Transmutations'
          commands={commands.transmutations}
        />
      )}
      {commands.conjurations.length > 0 && (
        <CommandSection title='Conjurations' commands={commands.conjurations} />
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
  return (
    <section className='flex flex-col gap-3'>
      <h3 className='bg-white/5 px-3'>{title}</h3>
      <ul className='flex flex-col gap-3 text-sm px-3'>
        {commands.map((command, i) => (
          <li key={`command_${i}`} className='flex flex-col gap-1'>
            <h4>{command.name}</h4>
            <ul className='flex flex-col gap-1'>
              {command.links.map((link, j) => (
                <li key={`link_${j}`}>
                  <div className='flex items-center'>
                    {link.elements.map((elem, k) => (
                      <div key={`elem_${k}`} className='flex items-center'>
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
        ))}
      </ul>
    </section>
  )
}
