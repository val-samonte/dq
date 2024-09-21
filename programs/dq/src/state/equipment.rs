use anchor_lang::prelude::*;

#[account]
pub struct Equipment {
  /// Bump nonce of the PDA. (1)
  pub bump: u8,

  /// The character PDA that holds this equipment. (32)
  pub character: Pubkey,

  /// The mint address of the asset. (32)
  pub mint: Pubkey,

  /// Is it equipped [1] or not [0]. (1)
  pub status: u8,

  /// Weapon [1], Armor [2]. (1)
  pub item_type: u8,

  /// The current skill points to unlock the associated skill. (1)
  pub current_sp: u8,

  /// The max skill points required to unlock the associated skill. (1)
  pub max_sp: u8,

  /// Unused reserved byte space for future additive changes. (128)
  pub _reserved: [u8; 128],
}

impl Equipment {
  pub fn len() -> usize {
    8 + 1 + 32 + 32 + 1 + 1 + 1 + 1 + 128
  }
}
