import { useEffect, useRef, useState } from 'react'
import { Board } from './Board'
import { CommandList } from './CommandList'
import cn from 'classnames'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  commandChecklistAtom,
  commandsBaseAtom,
  lastCommandCalledAtom,
} from '../atoms/commandsAtom'
import {
  boardRawAtom,
  RenderActionType,
  renderBoardAtom,
  showAuraAtom,
} from '../atoms/gameBoardAtom'
import { Element } from '../enums/Element'
import { Command } from '../types/Command'
import {
  conjureCommands,
  enchanceCommands,
  enchanceCommandsT1,
  samplerSkills,
  transmuteCommands,
} from '../constants/commands'
import { ArrowsClockwise } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const defaultBoard: Element[] = [3, 2, 1, 1, 2, 2, 3, 1, 3, 1, 2, 3]
const defaultBoard2: Element[] = [
  Element.ArcaneII,
  2,
  1,
  1,
  Element.LifeII,
  2,
  3,
  1,
  3,
  Element.ChaosII,
  2,
  3,
]

const fireBall = {
  type: 'skill',
  skillType: 'offensive',
  name: 'Fireball',
  links: [
    {
      elements: [Element.ChaosI, Element.ChaosI, Element.ArcaneI],
    },
  ],
  cost: 3,
}

const script = [
  {
    text: 'In this tutorial, we will cover the basic mechanics of the game.',
    disableBoard: true,
    disableCommand: true,
    boardOpacity: 0,
    commandOpacity: 0,
    reset: true,
    showNext: true,
  },
  {
    text: 'The Board is a 3x4 grid that consists of Elements.',
    disableBoard: true,
    disableCommand: true,
    commandOpacity: 0,
    reset: true,
    showNext: true,
  },
  {
    text: 'Tier 1 Elements are symbols represented by Red Triangles, Green Squares, and Blue Circles.',
    disableBoard: true,
    disableCommand: true,
    commandOpacity: 0,
    reset: true,
    showNext: true,
  },
  {
    text: 'Red Triangles are called Chaos Stones, which are often used for offensive skills.',
    disableBoard: true,
    disableCommand: true,
    commandOpacity: 0,
    reset: true,
    showNext: true,
    aura: Element.ChaosI,
  },
  {
    text: 'Green Squares are called Life Crystals, which are often used for supportive skills.',
    disableBoard: true,
    disableCommand: true,
    commandOpacity: 0,
    reset: true,
    showNext: true,
    aura: Element.LifeI,
  },
  {
    text: 'Blue Circles are called Arcane Orbs, which are often used for special and disruptive skills.',
    disableBoard: true,
    disableCommand: true,
    commandOpacity: 0,
    reset: true,
    showNext: true,
    aura: Element.ArcaneI,
  },
  {
    text: 'To the right, you will find a list of available Commands.',
    disableBoard: true,
    disableCommand: true,
    boardOpacity: 0.5,
    reset: true,
    showNext: true,
    commands: [fireBall],
    checklist: [],
  },
  {
    text: 'To execute a specific Command, you must link the correct Elements in the right order.',
    disableBoard: true,
    disableCommand: true,
    boardOpacity: 0.5,
    reset: true,
    showNext: true,
    commands: [fireBall],
    checklist: [],
  },
  {
    text: 'Let’s try casting Fireball by linking the correct Elements in order.',
    reset: true,
    commands: [fireBall],
    checklist: [
      {
        name: fireBall.name,
        checked: false,
      },
    ],
  },
  {
    text: 'Well done! Pretty easy, right? As you may have noticed, the Elements you linked together are spent, and new ones drop from above.',
    disableBoard: true,
    disableCommand: true,
    boardOpacity: 0.5,
    showNext: true,
  },
  {
    text: 'Now that you’ve cast your first skill, let’s make things more complicated.',
    disableBoard: true,
    disableCommand: true,
    boardOpacity: 0.5,
    commandOpacity: 0.5,
    showNext: true,
  },
  {
    text: 'Transmutation allows you to convert two different Elements into another different Element.',
    disableBoard: true,
    boardOpacity: 0.5,
    showNext: true,
    commands: transmuteCommands,
    checklist: [],
  },
  {
    text: 'Let’s try all possible transmutations',
    commands: transmuteCommands,
    checklist: [
      {
        name: 'Transmute Chaos',
        checked: false,
      },
      {
        name: 'Transmute Life',
        checked: false,
      },
      {
        name: 'Transmute Arcane',
        checked: false,
      },
    ],
  },
  {
    text: 'Great job! Transmutation is a valuable tool for unblocking yourself in certain situations, but it should be used sparingly.',
    disableBoard: true,
    boardOpacity: 0.5,
    showNext: true,
  },
  {
    text: 'Next, we are going to cover Enhancements.',
    disableBoard: true,
    disableCommand: true,
    boardOpacity: 0.5,
    commandOpacity: 0.5,
    showNext: true,
  },
  {
    text: 'Enhancement allows you to increase an Element’s level, unlocking more powerful skills and Conjurations.',
    disableBoard: true,
    boardOpacity: 0.5,
    showNext: true,
    commands: enchanceCommandsT1,
    checklist: [],
  },
  {
    text: 'Let’s try doing some Enhancements.',
    commands: [...enchanceCommandsT1, ...transmuteCommands],
    checklist: [
      {
        name: 'Enhance Chaos',
        checked: false,
      },
      {
        name: 'Enhance Life',
        checked: false,
      },
      {
        name: 'Enhance Arcane',
        checked: false,
      },
    ],
  },
  {
    text: 'Awesome, you’re a fast learner! You can enhance an Element up to Level 3, but be aware that it comes with some risks, such as losing the ability to Transmute the Element.',
    disableBoard: true,
    boardOpacity: 0.5,
    showNext: true,
  },
  {
    text: 'Finally, we are going to cover Conjurations and Tier 2 Elements.',
    disableBoard: true,
    disableCommand: true,
    boardOpacity: 0.5,
    commandOpacity: 0.5,
    showNext: true,
  },
  {
    text: 'Conjuration unlocks Tier 2 Elements, such as Oblivion Stone, Fate Crystal, and Essence Orb.',
    disableBoard: true,
    boardOpacity: 0.5,
    showNext: true,
    commands: conjureCommands,
    checklist: [],
  },
  {
    text: 'Let’s conjure all Tier 2 Elements. Click the button on the right to reset the board.',
    commands: [...conjureCommands, ...enchanceCommands, ...transmuteCommands],
    checklist: [
      {
        name: 'Conjure Oblivion',
        checked: false,
      },
      {
        name: 'Conjure Fate',
        checked: false,
      },
      {
        name: 'Conjure Essence',
        checked: false,
      },
    ],
    showReset: true,
  },
  {
    text: 'Fantastic! You now have the basic knowledge of the game.',
    disableBoard: true,
    boardOpacity: 0.5,
    showNext: true,
  },
  {
    text: 'Now let’s practice everything we’ve learned so far.',
    disableBoard: true,
    disableCommand: true,
    boardOpacity: 0.5,
    commandOpacity: 0.5,
    showNext: true,
    checklist: [],
  },
  {
    text: 'Execute all skills to complete the basics tutorial.',
    commands: [
      ...samplerSkills,
      ...enchanceCommands,
      ...conjureCommands,
      ...transmuteCommands,
    ],
    checklist: [
      { name: 'Fireball', checked: false },
      { name: 'Harden', checked: false },
      { name: 'Shuffle', checked: false },
      { name: 'Lightning Bolt', checked: false },
      { name: 'Heal', checked: false },
      { name: 'Tornado', checked: false },
    ],
    showReset: true,
  },
  {
    text: 'Congratulations! You’ve completed the basics. Feel free to explore and play around more.',
    checklist: [],
    showEnd: true,
  },
]

export function TutorialBasic() {
  const [step, setStep] = useState(0)
  const setCommands = useSetAtom(commandsBaseAtom)
  const setBoard = useSetAtom(boardRawAtom)
  const setRender = useSetAtom(renderBoardAtom)
  const setAura = useSetAtom(showAuraAtom)
  const checklistStep = useRef(0)
  const [checklist, setChecklist] = useAtom(commandChecklistAtom)
  const lastCommand = useAtomValue(lastCommandCalledAtom)

  useEffect(() => {
    if (script[step].reset) {
      setCommands([])
      setBoard(defaultBoard)
      setRender({ type: RenderActionType.LOAD })
    }
    if (script[step].commands) {
      setCommands(script[step].commands.map((c) => ({ ...c })) as Command[])
    }
    if (script[step].aura) {
      setAura(script[step].aura)
    } else {
      setAura(null)
    }
    if (script[step].checklist) {
      checklistStep.current = step
      setChecklist(script[step].checklist.map((c) => ({ ...c })))
    }
  }, [step, setCommands, setBoard, setRender, setAura, setChecklist])

  useEffect(() => {
    setChecklist((list) => {
      return list.map((item) => {
        if (item.name === lastCommand?.name) {
          item.checked = true
        }
        return item
      })
    })
  }, [lastCommand, setChecklist])

  const goNext = () =>
    setStep((s) => {
      if (s < script.length - 1) {
        return s + 1
      }
      return s
    })

  useEffect(() => {
    if (script[step].showNext) return
    if (
      !script[step].checklist ||
      script[step].checklist.length === 0 ||
      checklist.length === 0
    )
      return
    if (checklistStep.current !== step) return
    if (checklist.every((c) => c.checked)) {
      goNext()
    }
  }, [step, checklist, setStep])

  return (
    <div className='flex-auto h-full w-full flex flex-col'>
      <div
        className='flex-auto flex flex-col relative'
        style={{
          backgroundImage: 'url("/bg_library.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <img
          src='/npc_monique.png'
          alt='Monique'
          className='h-[90%] aspect-square absolute -right-5 bottom-0'
        />
        <div className='flex flex-col gap-2 absolute border-l border-amber-300 px-5 py-3 m-5 bottom-0 inset-x-0 bg-gradient-to-r from-black/80 via-black/80 to-black/10'>
          <p className='font-serif text-amber-100'>Monique</p>
          <p className='text-sm max-w-[80%]'>{script[step].text}</p>
        </div>
        {script[step].showEnd && (
          <Link
            to={'/tutorial'}
            className={cn(
              'absolute bottom-0 right-0 m-8 px-3 py-1',
              'bg-amber-100 border-2 border-amber-300 text-stone-800'
            )}
          >
            End
          </Link>
        )}
        {script[step].showReset && (
          <button
            className={cn(
              'absolute bottom-0 right-0 m-8 px-3 py-1',
              'bg-amber-100 border-2 border-amber-300 text-stone-800'
            )}
            onClick={() => {
              setBoard(defaultBoard2)
              setRender({ type: RenderActionType.LOAD })
            }}
          >
            <ArrowsClockwise size={24} />
          </button>
        )}
        {script[step].showNext && (
          <button
            className={cn(
              'absolute bottom-0 right-0 m-8 px-3 py-1',
              'bg-amber-100 border-2 border-amber-300 text-stone-800'
            )}
            onClick={goNext}
          >
            Next
          </button>
        )}
      </div>
      <div
        className={cn(
          'relative flex-none grid grid-cols-12 max-h-[50%] transition-all'
        )}
      >
        <div
          className={cn(
            'col-span-7 bg-stone-950/80 h-full overflow-hidden transition-all',
            script[step].disableBoard && 'pointer-events-none',
            script[step].boardOpacity === 0 && 'opacity-0',
            script[step].boardOpacity === 0.5 && 'opacity-30',
            (typeof script[step].boardOpacity === 'undefined' ||
              script[step].boardOpacity === 1) &&
              'opacity-100'
          )}
        >
          <Board />
        </div>
        <div
          className={cn(
            'col-span-5 relative transition-all',
            script[step].disableCommand && 'pointer-events-none',
            script[step].commandOpacity === 0 && 'opacity-0',
            script[step].commandOpacity === 0.5 && 'opacity-30',
            (typeof script[step].commandOpacity === 'undefined' ||
              script[step].commandOpacity === 1) &&
              'opacity-100'
          )}
        >
          <div className='absolute inset-0 overflow-x-hidden overflow-y-auto bg-stone-950'>
            <CommandList />
          </div>
        </div>
      </div>
    </div>
  )
}
