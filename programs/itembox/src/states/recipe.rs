use anchor_lang::prelude::*;

#[account]
pub struct Recipe {
  /// Bump nonce of the PDA. (1)
  pub bump: u8,

  /// The blueprint to use to produce the item of this recipe. (32)
  pub blueprint: Pubkey,

  /// The amount of items produced by this recipe. (8)
  pub output_amount: u64,

  /// The list of ingredients for this recipe. (4 + dynamic)
  pub ingredients: Vec<Ingredient>,
}

impl Recipe {
  pub fn len(ingredients_count: usize) -> usize {
    let ingredient_size = 32 + 1 + 8 + 1;

    8 + 1 + 32 + 8 + 4 + (ingredient_size * ingredients_count)
  }
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone)]
pub struct Ingredient {

  /// A blueprint or the mint address of the SPL token. (32)
  pub asset: Pubkey,

  /// Blueprint NF [0], Blueprint F [1], SPL [2], Token Extensions [3]. (1)
  pub asset_type: u8,

  /// Amount needed, only applicable to fungible assets. (8)
  pub amount: u64,

  /// What to do with this asset after crafting the recipe. Retain [0], Burn [1], Transfer [2]. (1)
  pub consume_method: u8,
}
