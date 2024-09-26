use anchor_lang::prelude::*;

#[account]
pub struct Main {
  /// Bump nonce of the PDA. (1)
  pub bump: u8,

  /// The authority that is permitted to update this state. (32)
  pub authority: Pubkey,

  /// The wallet that stores the collected fees. (32)
  pub treasury: Pubkey,

  /// Governance token of Itembox. (32)
  pub token_mint: Pubkey,

  /// Amount of fee being collected when minting a blueprint. (8)
  pub blueprint_mint_fee: u64,

  /// Unused reserved byte space for future additive changes. (128)
  pub _reserved: [u8; 128],
}

impl Main {
  pub fn len() -> usize {
    8 + 1 + 32 + 32 + 32 + 8 + 128
  }
}
