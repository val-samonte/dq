export async function sha256(message: string) {
  return new Uint8Array(
    await crypto.subtle.digest('SHA-256', Buffer.from(message, 'utf-8'))
  )
}
