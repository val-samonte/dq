import bs58 from 'bs58'

export async function getDiscriminator(accountName: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(`account:${accountName}`)

  // Use subtle crypto to generate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  // Convert the resulting hashBuffer to a Uint8Array and take the first 8 bytes
  return bs58.encode(Buffer.from(new Uint8Array(hashBuffer).slice(0, 8)))
}
