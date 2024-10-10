import { BN } from '@coral-xyz/anchor'
import { useNavigate, useParams } from 'react-router-dom'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useEffect, useState } from 'react'
import { Nav } from './Nav'
import { CenterWrapper } from './CenterWrapper'
import { useUserWallet } from '../atoms/userWalletAtom'
import cn from 'classnames'
import {
  Coins,
  FilePlus,
  Scroll,
  Shapes,
  Signature,
  Trash,
} from '@phosphor-icons/react'
import { allBlueprintsAtom } from '../atoms/allBlueprintsAtom'
import { SelectedIngredient } from './SelectedIngredient'
import {
  createRecipeTabAtom,
  SelectedIngredientActionTypes,
  selectedIngredientsAtom,
  selectedIngredientsCounterAtom,
} from '../atoms/selectedIngredientsAtom'
import { NumberInput } from './NumberInput'
import { TokensList } from './TokensList'
import { assetSearchAtom } from '../atoms/tokensListAtom'
import { BlueprintsList } from './BlueprintsList'
import { convertToBN, parseNumberBN } from '../utils/formatNumber'
import { itemboxSdkAtom } from '../atoms/itemboxSdkAtom'
import { PublicKey } from '@solana/web3.js'
import { programAtom } from '../atoms/programAtom'
import { recipeCreatedAtom } from './dialogs/RecipeCreated'
import { BlueprintHeader } from './BlueprintHeader'
import { PleaseConnect } from './PleaseConnect'
import { messageAtom } from './dialogs/MessageDialog'

function Content() {
  const wallet = useUserWallet()
  const sdk = useAtomValue(itemboxSdkAtom)
  const program = useAtomValue(programAtom)
  const { blueprintId } = useParams()
  const blueprint = useAtomValue(blueprintAtom(blueprintId || ''))
  const [selectedIngredients, setIngredients] = useAtom(
    selectedIngredientsAtom(blueprintId || '')
  )
  const { total, tokens, blueprints } = useAtomValue(
    selectedIngredientsCounterAtom(blueprintId || '')
  )
  const [outputAmount, setOutputAmount] = useState('1')
  const [tab, setTab] = useAtom(createRecipeTabAtom)
  const [search, setSearch] = useAtom(assetSearchAtom)
  const [busy, setBusy] = useState(false)
  const showDialog = useSetAtom(recipeCreatedAtom)
  const navigate = useNavigate()
  const showMessage = useSetAtom(messageAtom)

  useEffect(() => {
    if (
      !wallet?.publicKey ||
      wallet.publicKey.toBase58() !== blueprint?.authority
    ) {
      navigate(`/blueprints/${blueprintId}`)
    }
  }, [blueprint, wallet])

  if (!blueprint) {
    // todo: make skeleton
    return null
  }

  const onSubmit = async () => {
    if (!blueprintId) return
    // todo: validate ingredients

    const output = parseNumberBN(outputAmount, 0)
    if (output.eq(new BN(0))) {
      return
    }

    setBusy(true)

    try {
      const ingredients = selectedIngredients.map((ingredient) => {
        const parsedNumber = convertToBN(ingredient.amount, ingredient.decimals)

        return {
          asset: new PublicKey(ingredient.id),
          amount: parsedNumber,
          consumeMethod: ingredient.consumeMethod,
        }
      })

      const result = await sdk.createRecipe(
        new PublicKey(blueprintId),
        ingredients,
        new BN(outputAmount)
      )

      const recipeData = await program.account.recipe.fetch(result.recipe)

      setBusy(false)

      setIngredients({
        type: SelectedIngredientActionTypes.CLEAR,
      })

      setOutputAmount('1')

      showDialog({
        account: recipeData,
        publicKey: result.recipe.toBase58(),
        signature: result.signature,
      })
    } catch (e) {
      console.error(e)
      showMessage({
        title: 'Error Creating a Recipe',
        message: (
          <>
            <p>There was an error while creating a recipe for this item!</p>
            <p>
              (Note that on Devnet some of the tokens might not have their
              counterpart on Mainnet which might be the reason for the error)
            </p>
          </>
        ),
      })
    }

    setBusy(false)
  }

  return (
    <div className='flex flex-col p-5 gap-5'>
      <BlueprintHeader
        to={`/blueprints/${blueprint.id}`}
        name={blueprint.name}
        image={blueprint.image}
        title={'New Recipe for'}
      />
      <div className={cn('h-[60vh] grid grid-cols-12 gap-5')}>
        <div
          className={cn(
            'col-span-12 lg:col-span-7 h-full rounded-lg rounded-br-none',
            'bg-gray-700 flex flex-col overflow-hidden'
          )}
        >
          <div className='grid grid-cols-2 gap-2 px-2 pt-2 bg-black/20'>
            <button
              onClick={() => {
                setTab('blueprints')
              }}
              className={cn(
                tab === 'blueprints'
                  ? 'opacity-100 bg-gray-700'
                  : 'opacity-80 bg-gray-700/50',
                'flex gap-3 transition-all',
                'items-center justify-between',
                'rounded-t px-4 py-3 text-lg'
              )}
            >
              <span className='flex items-center gap-3'>
                <Scroll size={24} />
                <span className='hidden lg:inline'>Blueprints</span>
                <span className='inline lg:hidden'>BP</span>
              </span>
              {blueprints > 0 && (
                <span
                  className={cn(
                    'bg-green-400/50 rounded-full',
                    'flex items-center justify-center',
                    'w-6 h-6 text-sm font-mono'
                  )}
                >
                  {blueprints}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setTab('tokens')
              }}
              className={cn(
                tab === 'tokens'
                  ? 'opacity-100 bg-gray-700'
                  : 'opacity-80 bg-gray-700/50',
                'flex gap-3 transition-all',
                'items-center justify-between',
                'rounded-t px-4 py-3 text-lg'
              )}
            >
              <span className='flex items-center gap-3'>
                <Coins size={24} />
                Tokens
              </span>
              {tokens > 0 && (
                <span
                  className={cn(
                    'bg-green-400/50 rounded-full',
                    'flex items-center justify-center',
                    'w-6 h-6 text-sm font-mono'
                  )}
                >
                  {tokens}
                </span>
              )}
            </button>
          </div>
          <div className='h-full flex flex-col overflow-y-auto overflow-x-hidden relative'>
            <div className='p-3 lg:p-5 bg-gray-700 sticky top-0'>
              <input
                disabled={busy}
                className={cn(
                  'z-10',
                  'items-center gap-3',
                  'rounded px-3 lg:px-6 py-3 text-lg',
                  'bg-black/20 w-full'
                )}
                type='text'
                placeholder='Search by asset address, name or symbol'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {tab === 'blueprints' && (
              <Suspense fallback={null}>
                <BlueprintsList />
              </Suspense>
            )}
            {tab === 'tokens' && (
              <Suspense fallback={null}>
                <TokensList />
              </Suspense>
            )}
          </div>
        </div>
        <div
          className={cn(
            'hidden lg:flex flex-col lg:col-span-5 h-full rounded-lg rounded-br-none bg-gray-700 overflow-hidden'
          )}
        >
          <div className='px-2 pt-2 gap-2 bg-black/20 flex items-center justify-between'>
            <div
              className={cn(
                'flex-auto',
                'bg-gray-700',
                'flex gap-3',
                'items-center justify-between',
                'rounded-t px-4 py-3 text-lg'
              )}
            >
              <span className='flex items-center gap-3'>
                <Shapes size={24} />
                Selected Ingredients
              </span>
              {total > 0 && (
                <span
                  className={cn(
                    'bg-green-400/50 rounded-full',
                    'flex items-center justify-center',
                    'w-6 h-6 text-sm font-mono'
                    // 'px-3',
                  )}
                >
                  {total}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                if (!busy) {
                  setIngredients({ type: SelectedIngredientActionTypes.CLEAR })
                }
              }}
              className='rounded p-2 flex items-center justify-center'
            >
              <Trash size={20} />
            </button>
          </div>
          <div className='px-5 overflow-y-auto overflow-x-hidden relative flex-auto'>
            <div className='flex flex-col py-5 gap-5 show-next-when-empty'>
              {selectedIngredients.map((ing) => (
                <SelectedIngredient key={ing.id} id={ing.id} />
              ))}
            </div>
            <div className='absolute inset-0 flex items-center justify-center text-center opacity-50'>
              Please select resources from the left
            </div>
          </div>
        </div>
      </div>
      <div className='flex-none mx-auto flex items-center gap-5 portrait:flex-col lg:py-5'>
        <div className='text-lg flex flex-col md:flex-row flex-wrap items-center justify-center gap-3'>
          <span>This Recipe will produce</span>
          {blueprint.nonFungible ? (
            <span>x1</span>
          ) : (
            <NumberInput
              disabled={busy}
              min={new BN(1)}
              decimals={0}
              className='w-full max-w-14 bg-black/10 rounded px-3 py-2 text-center'
              value={outputAmount}
              onChange={setOutputAmount}
            />
          )}
          <span>{blueprint.name}</span>
        </div>
        <button
          onClick={onSubmit}
          className={cn(
            'w-fit',
            'flex items-center gap-3',
            'rounded pr-6 pl-4 py-3 text-lg',
            'bg-gradient-to-t',
            busy ? 'opacity-50 cursor-wait' : 'opacity-100 cursor-pointer',
            'border-2 border-amber-300/50',
            'from-amber-800 to-yellow-800'
          )}
          disabled={busy}
        >
          {!busy ? (
            <>
              <FilePlus size={24} />
              Create Recipe
            </>
          ) : (
            <>
              <Signature size={24} />
              Please Sign
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export function CreateRecipePage() {
  const wallet = useUserWallet()
  const { blueprintId } = useParams()
  const reloadBlueprint = useSetAtom(blueprintAtom(blueprintId || ''))
  const reloadBlueprints = useSetAtom(allBlueprintsAtom)

  useEffect(() => {
    reloadBlueprint()
    reloadBlueprints()
  }, [blueprintId])

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <CenterWrapper>
        {wallet?.publicKey ? (
          <div className='min-h-[calc(100vh-4rem)]'>
            <Suspense fallback={null}>
              <Content />
            </Suspense>
          </div>
        ) : (
          <PleaseConnect />
        )}
      </CenterWrapper>
    </div>
  )
}
