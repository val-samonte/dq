use anchor_lang::prelude::*;

#[account]
pub struct Ranking {
    /// Bump nonce of the PDA. (1)
    pub bump: u8,

    /// The owner of this ranking card. (32)
    pub owner: Pubkey,

    /// Idle [0], Looking for a match [1], In battle [2]. (1)
    pub status: u8,

    /// Current season of this ranking card account. (2)
    pub season: u16,

    /// Elo rating. (2)
    pub elo: u16,

    /// How many times the owner won. (2)
    pub wins: u16,

    /// How many times the owner lost. (2)
    pub loses: u16,

    /// Unused reserved byte space for future additive changes. (128)
    pub _reserved: [u8; 128],
}

impl Ranking {
    pub fn len() -> usize {
        8 + 1 + 32 + 1 + 2 + 2 + 2 + 2 + 128
    }
}