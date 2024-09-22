use anchor_lang::prelude::*;

#[account]
pub struct Character {
  /// Bump nonce of the PDA. (1)
  pub bump: u8,

  /// The mint address of the asset. (32)
  pub mint: Pubkey,

  /// Remaining energy of the character to perform actions. (1)
  pub energy: u8,

  /// The last time the character gained a point of energy. (8)
  pub time_energy_gained: u64,

  /// What generation is the character. Defaults to 0. (1)
  pub generation: u8,

  /// How many PvP fights the character won. (2)
  pub wins: u16,

  /// How many PvP fights the character lost. (2)
  pub loses: u16,

  /// Male [0], Female [1]. (1)
  pub gender: u8,

  /// Intelligence.
  pub stat_int: u8,

  /// Strength.
  pub stat_str: u8,

  /// Dexterity.
  pub stat_dex: u8,

  /// Vitality.
  pub stat_vit: u8,

  /// The mint address of the weapon asset equipped. (32)
  pub weapon_mint: Pubkey,

  /// The mint address of the armor asset equipped. (32)
  pub armor_mint: Pubkey,

  /// Unused reserved byte space for future additive changes. (128)
  pub _reserved: [u8; 128],
}

impl Character {
  pub fn len() -> usize {
    8 + 1 + 32 + 1 + 8 + 1 + 2 + 2 + 32 + 32 + 128
  }
}
