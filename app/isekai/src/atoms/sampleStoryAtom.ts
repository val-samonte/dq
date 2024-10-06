import { atom } from 'jotai'

// not final data format, currently ugly af.
const sampleStoryAtom = atom({
  name: 'Hammer Quest',
  type: 'dialog',
  content: [
    {
      dialog: 'Hello adventurer welcome to smithy city.',
      avatar: '/images/npc_gabranth.png',
      avatarPosition: 'right',
      type: 'dialog'
    }, {
      dialog: 'Here is your requested item.',
      avatar: '/images/char_male.png',
      avatarPosition: 'left',
      type: 'dialog'
    }, {
      dialog: 'Thanks for delivering my hammer.',
      avatar: '/images/npc_gabranth.png',
      avatarPosition: 'right',
      type: 'dialog'
    }, {
      dialog: 'You are welcome smithy chad.',
      avatar: '/images/char_male.png',
      avatarPosition: 'left',
      type: 'dialog'
    }, {
      dialog: 'Pls recieve this reward for your efforts.',
      avatar: '/images/npc_gabranth.png',
      avatarPosition: 'right',
      type: 'reward',
      reward: '5SVG3T9CNQsm2kEwzbRq6hASqh1oGfjqTtLXYUibpump'
    },
  ]
})

export default sampleStoryAtom