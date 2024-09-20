// // todo: separate config PDA from the counter PDA

// use anchor_lang::prelude::*;

// #[account]
// pub struct Config {
//   /// Bump nonce of the PDA. (1)
//   pub bump: u8,

//   /// The authority that is permitted to update this state. (32)
//   pub authority: Pubkey,

//   /// The wallet that stores the collected fees. (32)
//   pub treasury: Pubkey,

//   /// Governance token to use. (32)
//   pub token_mint: Pubkey,

//   /// Amount of fee being collected when a Quest is created. (8)
//   pub base_fee: u64,

//   /// Amount of fee being collected when a Quest lingers for more than 1 month, daily. (8)
//   pub decay_fee: u64,

//   /// Slots before the decay fee takes effect, ideally after a month. (8)
//   pub decay_start: u64,

//   /// Vote threshold for dispute resolution. (8)
//   pub vote_threshold: u64,

//   /// Duration of the dispute resolution period, in slots (block height). (8)
//   pub dispute_duration: u64,

//   /// Slots before being able to vote on a dispute. (8)
//   pub staked_vote_power_start: u64,

//   /// Interval in slots to unlock a portion of the staked votes until depletion. (8)
//   pub unstaked_vote_unlock_interval: u64,

//   /// Unused reserved byte space for future additive changes. (128)
//   pub _reserved: [u8; 128],
// }

// impl Config {
//   pub fn len() -> usize {
//     8 + 1 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 128
//   }
// }


// #[error_code]
// pub enum ConfigError {
//   #[msg("The program data did not match.")]
//   InvalidProgramData,

//   #[msg("The update authority provided is invalid.")]
//   InvalidUpdateAuthority,
// }