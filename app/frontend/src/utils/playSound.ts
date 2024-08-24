export interface Note {
  frequency: number
  duration: number
}

const audioContext = new window.AudioContext()

export function playSound(notes: Note[], volume: number = 0.1) {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  oscillator.type = 'triangle'
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  let currentTime = audioContext.currentTime

  notes.forEach((note) => {
    oscillator.frequency.setValueAtTime(note.frequency, currentTime)
    gainNode.gain.setValueAtTime(volume, currentTime)
    currentTime += note.duration
    gainNode.gain.setValueAtTime(0, currentTime)
  })

  oscillator.start()
  oscillator.stop(currentTime)
}
