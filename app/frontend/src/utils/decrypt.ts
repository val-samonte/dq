import bs58 from 'bs58'

export async function decrypt(
  encryptedString: string,
  password: string
): Promise<Uint8Array> {
  const [ivBase58, saltBase58, encryptedBase58] = encryptedString.split('.')

  const iv = bs58.decode(ivBase58)
  const salt = bs58.decode(saltBase58)
  const encryptedData = bs58.decode(encryptedBase58)

  // Derive the key using the same salt and password
  const encodedPassword = new TextEncoder().encode(password)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encodedPassword,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  )

  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedData
  )

  return new Uint8Array(decryptedData)
}
