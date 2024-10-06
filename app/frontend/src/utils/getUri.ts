export const getUri = (rpc: string, uri: string) => {
  if (rpc.toLowerCase().includes('devnet')) {
    return uri.replace('arweave.net', 'devnet.irys.xyz')
  }
  return uri
}
