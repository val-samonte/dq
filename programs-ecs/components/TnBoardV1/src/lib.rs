use bolt_lang::*;

declare_id!("DQPBAAvhsGhf9gp5wwa3tzvSUjS4wiUTDZnioFSkpugw");

#[component]
#[derive(Default)]
pub struct TnBoardV1 {

    /// The character PDA.
    pub character: Pubkey,

    /// The battle entity, could be TnRankedPvpV1.
    pub battle: Pubkey,

    /// The game board of the character.
    pub board: [u8; 12],

    /// Last hash used, basically every move will update this. The pseudo-randomness will be based here.
    pub hash: [u8; 32],
}
