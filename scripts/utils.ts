import { readFileSync } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'
import { Keypair } from '@solana/web3.js'
import { KeypairSigner, Umi } from '@metaplex-foundation/umi'
import { createSignerFromKeypair } from '@metaplex-foundation/umi'

export function loadKeypair(filePath: string): Keypair {
  const resolvedPath = filePath.startsWith('~')
    ? filePath.replace('~', homedir())
    : filePath
  const absolutePath = resolve(resolvedPath)
  const keypairString = readFileSync(absolutePath, 'utf-8')
  const keypairBuffer = Buffer.from(JSON.parse(keypairString))
  return Keypair.fromSecretKey(keypairBuffer)
}

export function loadUmiKeypair(umi: Umi, path: string): KeypairSigner {
  const solanaKp = loadKeypair(path)
  const keypair = umi.eddsa.createKeypairFromSecretKey(solanaKp.secretKey)
  const keypairSigner = createSignerFromKeypair(umi, keypair)
  return keypairSigner
}
