export const base64ToFile = (base64String: string, fileName: string): File => {
  const byteString = atob(base64String.split(',')[1])
  const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0]
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const intArray = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i)
  }

  return new File([intArray], fileName, { type: mimeString })
}
