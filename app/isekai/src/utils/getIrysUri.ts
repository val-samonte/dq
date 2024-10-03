export const getIrysUri = (rpc: string, uri: string) => {
  if (rpc.toLowerCase().includes('devnet')) {
    return uri.replace('https://arweave.net/', 'https://devnet.irys.xyz/')
  }
  return uri
}
