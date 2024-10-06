import { Suspense, useEffect, useState } from 'react'
import { Nav } from './Nav'
import { CenterWrapper } from './CenterWrapper'
import { BlueprintHeader } from './BlueprintHeader'
import cn from 'classnames'
import { useParams } from 'react-router-dom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { ingredientsAtom, recipeAtom } from '../atoms/recipeAtom'
import {
  FilePlus,
  NumberSquareOne,
  Signature,
  Stack,
} from '@phosphor-icons/react'
import { IngredientExpanded } from './IngredientExpanded'
import { NonFungibleInventory } from './NonFungibleInventory'
import { useUserWallet } from '../atoms/userWalletAtom'
import { PleaseConnect } from './PleaseConnect'
import { FungibleInventory } from './FungibleInventory'
import {
  CraftingItemActionType,
  craftingItemAtom,
} from '../atoms/craftingItemAtom'
import { itemboxSdkAtom } from '../atoms/itemboxSdkAtom'
import { PublicKey } from '@solana/web3.js'
import { messageAtom } from './dialogs/MessageDialog'
import { userAssetsAtom } from '../atoms/userAssetsAtom'
import { itemCraftedAtom } from './dialogs/ItemCrafted'

function Content() {
  const { recipeId } = useParams()
  const recipe = useAtomValue(recipeAtom(recipeId || ''))
  const { ingredients, requirements, nonFungibles, fungibles } = useAtomValue(
    ingredientsAtom(recipeId || '')
  )
  const blueprint = useAtomValue(blueprintAtom(recipe?.blueprint || ''))
  const [state, stateAction] = useAtom(craftingItemAtom(recipeId || ''))
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState('nonfungible')
  const sdk = useAtomValue(itemboxSdkAtom)
  const showMessage = useSetAtom(messageAtom)
  const reloadAssets = useSetAtom(userAssetsAtom)
  const showSuccess = useSetAtom(itemCraftedAtom)

  useEffect(() => {
    setTab(nonFungibles.length > 0 ? 'nonfungible' : 'fungible')
  }, [nonFungibles])

  const onSubmit = async () => {
    if (!state?.passed) return
    if (!recipeId) return
    if (!recipe) return

    setBusy(true)

    try {
      const result = await sdk.craftItem(
        new PublicKey(recipeId),
        state.nonFungibles.map((i) => ({
          collection: new PublicKey(i.collection),
          item: new PublicKey(i.selected[0]),
        }))
      )

      stateAction()
      reloadAssets()

      showSuccess({
        blueprintId: recipe.blueprint,
        signature: result.signature,
        amount: recipe.outputAmount,
      })
    } catch (e) {
      console.log(e)
      showMessage({
        title: 'Error Crafting an Item',
        message: (
          <>
            <p>There was an error while trying to craft the item!</p>
            <p className='max-w-full overflow-auto'>{JSON.stringify(e)}</p>
          </>
        ),
      })
    }

    setBusy(false)
  }

  if (!recipe || !blueprint) {
    return null
  }

  return (
    <div className='flex flex-col p-5 gap-5'>
      <BlueprintHeader
        to={`/blueprints/${blueprint.id}`}
        name={blueprint.name}
        image={blueprint.image}
        title={'Craft new item'}
      />
      <div className={cn('lg:h-[60vh] grid grid-cols-12 gap-5')}>
        <div
          className={cn(
            'col-span-12 min-h-[25vh] max-h-[60vh] lg:col-span-6 h-full rounded-lg rounded-br-none',
            'bg-gray-700 flex flex-col overflow-hidden'
          )}
        >
          <div className='grid grid-cols-2 gap-2 px-2 pt-2 bg-black/20'>
            {nonFungibles.length > 0 && (
              <button
                onClick={() => {
                  setTab('nonfungible')
                }}
                className={cn(
                  tab === 'nonfungible'
                    ? 'opacity-100 bg-gray-700'
                    : 'opacity-80 bg-gray-700/50',
                  'flex gap-3 transition-all',
                  'items-center justify-between',
                  'rounded-t px-4 py-3 text-lg'
                )}
              >
                <span className='flex items-center gap-3 overflow-hidden text-nowrap'>
                  <NumberSquareOne size={24} className='flex-none' />
                  My Non-Fungibles
                </span>
              </button>
            )}
            <button
              onClick={() => {
                setTab('fungible')
              }}
              className={cn(
                tab === 'fungible'
                  ? 'opacity-100 bg-gray-700'
                  : 'opacity-80 bg-gray-700/50',
                'flex gap-3 transition-all',
                'items-center justify-between',
                'rounded-t px-4 py-3 text-lg'
              )}
            >
              <span className='flex items-center gap-3 overflow-hidden text-nowrap'>
                <Stack size={24} className='flex-none' />
                My Fungibles
              </span>
            </button>
          </div>
          <div className='px-5 overflow-y-auto overflow-x-hidden relative flex-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 py-5 gap-5 show-next-when-empty'>
              {recipeId && tab === 'nonfungible' && (
                <Suspense fallback={null}>
                  <NonFungibleInventory
                    recipeId={recipeId}
                    filters={nonFungibles}
                    selectMode='multiple'
                    onSelection={(items) => {
                      if (!busy) {
                        stateAction({
                          type: CraftingItemActionType.MAP,
                          data: items.map((i) => ({
                            blueprintId: i.blueprintId,
                            collectionId: i.collectionId,
                            assetId: i.id,
                          })),
                        })
                      }
                    }}
                  />
                </Suspense>
              )}
              {tab === 'fungible' && (
                <FungibleInventory mint_types={fungibles} />
              )}
            </div>
            <div className='absolute inset-0 flex items-center justify-center text-center opacity-50'>
              <span className='text-center w-[80%]'>
                I do not have any related ingredients for this recipe
              </span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'col-span-12 lg:col-span-6 h-full rounded-lg rounded-br-none',
            'bg-gray-700 flex flex-col overflow-hidden'
          )}
        >
          <div className='w-full overflow-y-auto overflow-x-hidden relative'>
            <div className='flex flex-col'>
              <div className='sticky top-0 px-6 py-4 text-lg bg-black/20'>
                {blueprint.name} Ingredients
              </div>
              <div className='flex flex-col gap-5 p-5'>
                {ingredients.map((ingredient) => {
                  if (ingredient.assetType === 0) {
                    const item = state?.nonFungibles.find(
                      (i) => i.asset === ingredient.asset.toBase58()
                    )
                    if (item && item.selected.length > 0) {
                      return (
                        <IngredientExpanded
                          key={ingredient.id}
                          {...ingredient}
                          selectedAssets={item.selected}
                        />
                      )
                    }
                  }

                  return (
                    <IngredientExpanded key={ingredient.id} {...ingredient} />
                  )
                })}
              </div>
              {requirements.length > 0 && (
                <>
                  <div className='sticky top-0 px-6 py-4 text-lg bg-black/20'>
                    Required Assets
                  </div>
                  <div className='flex flex-col gap-5 p-5'>
                    {requirements.map((ingredient) => {
                      if (ingredient.assetType === 0) {
                        const item = state?.nonFungibles.find(
                          (i) => i.asset === ingredient.asset.toBase58()
                        )
                        if (item && item.selected.length > 0) {
                          return (
                            <IngredientExpanded
                              key={ingredient.id}
                              {...ingredient}
                              selectedAssets={item.selected}
                            />
                          )
                        }
                      }

                      return (
                        <IngredientExpanded
                          key={ingredient.id}
                          {...ingredient}
                        />
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='flex-none mx-auto flex flex-col items-center gap-5 portrait:flex-col lg:py-5'>
        {state?.passed ? (
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
                Craft Item
              </>
            ) : (
              <>
                <Signature size={24} />
                Please Sign
              </>
            )}
          </button>
        ) : (
          <div className='text-lg'>Required ingredients not met</div>
        )}
      </div>
    </div>
  )
}

export function CraftItemPage() {
  const wallet = useUserWallet()
  const { recipeId } = useParams()
  const reloadRecipe = useSetAtom(recipeAtom(recipeId || ''))
  const reloadCraftingState = useSetAtom(craftingItemAtom(recipeId || ''))

  useEffect(() => {
    reloadRecipe()
    reloadCraftingState()
  }, [])

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
