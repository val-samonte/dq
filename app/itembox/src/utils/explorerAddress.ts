export const explorerAddress = (account: string) => {
  return `https://solana.fm/address/${account}/transactions?cluster=devnet-alpha`
}

export const explorerTransaction = (tx: string) => {
  return `https://solana.fm/tx/${tx}?cluster=devnet-alpha`
}
