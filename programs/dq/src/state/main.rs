use anchor_lang::prelude::*;

#[account]
pub struct Main {
  /// Bump nonce of the PDA. (1)
  pub bump: u8,

  /// The authority that is permitted to update this state. (32)
  pub authority: Pubkey,

  /// The wallet that stores the collected fees. (32)
  pub treasury: Pubkey,

  /// Governance token of TriNexus. (32)
  pub token_mint: Pubkey,

  // todo:
  // characters_collection_address
  // equipment_collection_address
  // consumables_collection_address
  // materials_collection_address

  /// Amount of fee being collected when minting a character. (8)
  pub character_mint_fee: u64,

  /// How many seconds for the character before regaining 1 energy. (8)
  pub character_energy_replenish: u64,

  /// Unused reserved byte space for future additive changes. (128)
  pub _reserved: [u8; 128],
}

impl Main {
  pub fn len() -> usize {
    8 + 1 + 32 + 32 + 32 + 8 + 128
  }
}


#[error_code]
pub enum MainError {
  #[msg("The update authority provided is invalid.")]
  InvalidUpdateAuthority,
}