use anchor_lang::prelude::*;

#[account]
pub struct Blueprint {
  /// Bump nonce of the PDA. (1)
  pub bump: u8,

  /// The address of the metaplex core collection with master edition plugin OR
  /// the mint address of the fungible token. (32)
  pub mint: Pubkey,

  /// The creator and owner of this blueprint, 
  /// which also acts as the update authority. (32)
  pub authority: Pubkey,

  /// The receiver of the transfered items if the Recipe is configured 
  /// to transfer an ingredient. (32)
  pub treasury: Pubkey,

  /// The account who can mint the item of this blueprint. 
  /// Note: Recipes are still able to MINT this item if the condition is met. (32)
  pub mint_authority: Pubkey,

  /// Number of editions printed, if mint is a Master Edition. (8)
  pub counter: u64,

  /// Unused reserved byte space for future additive changes. (128)
  pub _reserved: [u8; 128],
}

impl Blueprint {
  pub fn len() -> usize {
    8 + 1 + 32 + 32 + 32 + 32 + 8 + 128
  }
}
