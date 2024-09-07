import bs58 from 'bs58'

export async function encrypt(
  data: Uint8Array,
  password: string
): Promise<string> {
  const encodedPassword = new TextEncoder().encode(password)

  // Generate a random salt for key derivation
  const salt = crypto.getRandomValues(new Uint8Array(16))

  // Derive a key using PBKDF2
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
    ['encrypt']
  )

  // Generate a random IV (Initialization Vector)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  )

  return `${bs58.encode(iv)}.${bs58.encode(salt)}.${bs58.encode(
    new Uint8Array(encryptedData)
  )}`
}
