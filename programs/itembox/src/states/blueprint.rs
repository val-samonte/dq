use anchor_lang::prelude::*;

#[account]
#[derive(Debug)]
pub struct Blueprint {
  /// Bump nonce of the PDA. (1)
  pub bump: u8,

  /// The address of the metaplex core collection with master edition plugin OR
  /// the mint address of the fungible token. (32)
  pub mint: Pubkey,

  /// Whether the item is non-fungible. (1)
  pub non_fungible: bool,

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
  pub counter: u32,

  // Unused reserved byte space for future additive changes. (128)
  pub _reserved: [u8; 128],
}

impl Blueprint {
  pub fn len() -> usize {
    8 + 1 + 32 + 1 + 32 + 32 + 32 + 4 + 128
  }

  pub fn from_account_info(account_info: &AccountInfo) -> Result<Self> {
    // Borrow data from the account_info and skip the first 8 bytes (the discriminator)
    let borrowed_data = &account_info.try_borrow_data()?[8..];

    // Attempt to deserialize the remaining data into Blueprint struct
    Blueprint::try_from_slice(borrowed_data).map_err(|_| ProgramError::InvalidAccountData.into())
  }
}
