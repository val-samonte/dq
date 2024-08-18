export enum Element {
  Empty = 0b0000_0000,

  ChaosI = 0b0000_0001,
  LifeI = 0b0000_0010,
  ArcaneI = 0b0000_0011,

  ChaosII = 0b0000_0101,
  LifeII = 0b0000_0110,
  ArcaneII = 0b0000_0111,

  ChaosIII = 0b0000_1101,
  LifeIII = 0b0000_1110,
  ArcaneIII = 0b0000_1111,

  OblivionI = 0b0001_0000,
  FateI = 0b0010_0000,
  EssenceI = 0b0011_0000,

  OblivionII = 0b0101_0000,
  FateII = 0b0110_0000,
  EssenceII = 0b0111_0000,

  OblivionIII = 0b1101_0000,
  FateIII = 0b1110_0000,
  EssenceIII = 0b1111_0000,
}

export function byteToName(elem: Element) {
  switch (elem) {
    case Element.ChaosI:
      return 'Chaos_I'
    case Element.LifeI:
      return 'Life_I'
    case Element.ArcaneI:
      return 'Arcane_I'
    case Element.ChaosII:
      return 'Chaos_II'
    case Element.LifeII:
      return 'Life_II'
    case Element.ArcaneII:
      return 'Arcane_II'
    case Element.ChaosIII:
      return 'Chaos_III'
    case Element.LifeIII:
      return 'Life_III'
    case Element.ArcaneIII:
      return 'Arcane_III'
    case Element.OblivionI:
      return 'Oblivion_I'
    case Element.FateI:
      return 'Fate_I'
    case Element.EssenceI:
      return 'Essence_I'
    case Element.OblivionII:
      return 'Oblivion_II'
    case Element.FateII:
      return 'Fate_II'
    case Element.EssenceII:
      return 'Essence_II'
    case Element.OblivionIII:
      return 'Oblivion_III'
    case Element.FateIII:
      return 'Fate_III'
    case Element.EssenceIII:
      return 'Essence_III'
  }
}
