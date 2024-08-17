import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Board } from './components/Board'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Board />
  </StrictMode>
)

// separate board for each player / party
// instead of turn based, there will be a bar that gradually fills

// 1 turn bar = 3 turn points

// linking 3 of the same orb (and level) will promote the orb to the next level
// the last linked orb will be the one that is promoted, the other 2 will get destroyed
// costs 1 turn bar

// II > I > I = 33% magic increase
// II > II > I = 66% magic increase
// II > II > II = 100% magic increase (double)

// III > I > I = 50% magic increase
// III > II > I = 100% magic increase
// III > II > II = 150% magic increase
// III > III > I = 150% magic increase
// III > III > II = 200% magic increase
// III > III > III = 300% magic increase (triple)

// transmuting orbs
// matching 2 different orbs will transmute them into secondary orbs
// player can only transmute if one of the equipment has the secondary orb as requirements
// costs 1 turn bar

// arcane (blue) + chaos (red) = oblivion (purple) (down triangle)
// chaos (red) + life (green) = fate (yellow) (diamond)
// life (green) + arcane (blue) = essence (cyan)

// 0000 0001 - chaos I
// 0000 0010 - life I
// 0000 0011 - arcane I
// 0000 0101 - chaos II
// 0000 0110 - life II
// 0000 0111 - arcane II
// 0000 1101 - chaos III
// 0000 1110 - life III
// 0000 1111 - arcane III
// 0001 0000 - oblivion I
// 0010 0000 - fate I
// 0011 0000 - essence I
// 0101 0000 - oblivion II
// 0110 0000 - fate II
// 0111 0000 - essence II
// 1101 0000 - oblivion III
// 1110 0000 - fate III
// 1111 0000 - essence III
