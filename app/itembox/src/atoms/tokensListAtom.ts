// https://station.jup.ag/docs/token-list/token-list-api
// https://tokens.jup.ag/token/So11111111111111111111111111111111111111112

import { atom } from 'jotai'

import tokens from '../assets/tokens.json'
import { PublicKey } from '@solana/web3.js'
import { allBlueprintsAtom } from './allBlueprintsAtom'
import { atomFamily } from 'jotai/utils'

export interface TokenItem {
  id: string
  name: string
  symbol: string
  decimals: number
  image: string
}

export const assetSearchAtom = atom('')

export const tokensListAtom = atom<TokenItem[]>((get) => {
  const search = get(assetSearchAtom)
  if (!search) return tokens.slice(0, 100) as TokenItem[]

  const lowcase = search.toLowerCase()

  return tokens
    .filter((token) => {
      return (
        token.id === search ||
        token.name.toLowerCase().includes(lowcase) ||
        token.symbol.toLowerCase().includes(lowcase)
      )
    })
    .slice(0, 100) as TokenItem[]
})

export const queriedTokenAtom = atom(async (get) => {
  const search = get(assetSearchAtom)
  if (!search) return null

  const list = get(tokensListAtom)
  if (list.length > 0) return null

  try {
    new PublicKey(search)
  } catch (e) {
    return null
  }

  try {
    const response = await fetch(`https://tokens.jup.ag/token/${search}`)
    if (!response.ok) return null

    const data = await response.json()

    return {
      id: data.address,
      name: data.name,
      symbol: data.symbol,
      decimals: data.symbols,
      image: data.logoURI,
    } as TokenItem
  } catch (e) {}

  return null
})

export const tokenDataAtom = atomFamily((id: string) =>
  atom(async () => {
    const found = tokens.find((token) => token.id === id)
    if (found) return found as TokenItem

    try {
      const response = await fetch(`https://tokens.jup.ag/token/${id}`)
      if (!response.ok) return null

      const data = await response.json()

      if (data) {
        return {
          id: data.address,
          name: data.name,
          symbol: data.symbol,
          decimals: data.symbols,
          image: data.logoURI,
        } as TokenItem
      }
    } catch (e) {}

    // todo: get metadata manually

    return null
  })
)

export const blueprintsListAtom = atom(async (get) => {
  const search = get(assetSearchAtom)
  const blueprintIds = get(allBlueprintsAtom)
  const slice = blueprintIds.slice(0, 100)

  if (!search) return slice

  try {
    new PublicKey(search)
  } catch (e) {
    return slice
  }

  const found = blueprintIds.find((id) => id === search)
  if (found) {
    return [found]
  }

  return slice
})
