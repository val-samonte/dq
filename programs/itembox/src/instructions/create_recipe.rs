use anchor_lang::prelude::*;

use crate::states::{Blueprint, Ingredient, Recipe};
use anchor_spl::{token::spl_token, token_2022::spl_token_2022};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateRecipeArgs {
  ingredients: Vec<IngredientDefinition>
}

#[derive(Accounts)]
#[instruction(args: CreateRecipeArgs)]
pub struct CreateRecipe<'info> {

  #[account(
    init,
    payer = authority,
    seeds = [
      b"recipe",
      recipe_id.key().as_ref()
    ],
    bump,
    space = Recipe::len(args.ingredients.len())
  )]
  pub recipe: Account<'info, Recipe>,

  pub recipe_id: Signer<'info>,

  #[account(mut)]
  pub authority: Signer<'info>,

  #[account(
    has_one = authority
  )]
  pub blueprint: Account<'info, Blueprint>,

  pub system_program: Program<'info, System>,
}

pub fn create_recipe_handler(ctx: Context<CreateRecipe>, args: CreateRecipeArgs) -> Result<()> {
  let recipe = &mut ctx.accounts.recipe;
  let remaining_accounts = ctx.remaining_accounts;

  recipe.bump = ctx.bumps.recipe;
  recipe.blueprint = ctx.accounts.blueprint.key();

  for (index, account_info) in remaining_accounts.iter().enumerate() {

    if account_info.key().eq(&recipe.blueprint) {
      return Err(CreateRecipeError::BlueprintOutputIsAnIngredient.into());
    }

    if let Some(ingredient) = args.ingredients.get(index) {
      if let Ok(_blueprint_account) = Blueprint::try_from_slice(&account_info.data.borrow()) {
        
        recipe.ingredients.push(Ingredient {
          amount: ingredient.amount,
          asset: account_info.key(),
          asset_type: 0,
          consume_method: ingredient.consume_method
        });

        // TODO: SECURITY RISK, we cannot rely with this comparison
      } else if account_info.owner.eq(&spl_token::id()) {
        
        recipe.ingredients.push(Ingredient {
          amount: ingredient.amount,
          asset: account_info.key(),
          asset_type: 1,
          consume_method: ingredient.consume_method
        });

      } else if account_info.owner.eq(&spl_token_2022::id()) {
        
        recipe.ingredients.push(Ingredient {
          amount: ingredient.amount,
          asset: account_info.key(),
          asset_type: 2,
          consume_method: ingredient.consume_method
        });

      } else {
        return Err(CreateRecipeError::InvalidIngredient.into());
      }
      
    } else {
      return Err(CreateRecipeError::MissingIngredientDefinition.into());
    }
  }

  Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone)]
pub struct IngredientDefinition {

  /// Amount needed, only applicable to fungible assets. (8)
  pub amount: u64,

  /// What to do with this asset after crafting the recipe. Retain [0], Burn [1], Transfer [2]. (1)
  pub consume_method: u8,
}

#[error_code]
pub enum CreateRecipeError {
  #[msg("Blueprint output should not be a part of the ingredients")]
  BlueprintOutputIsAnIngredient,

  #[msg("The account provided is not a valid ingredient")]
  InvalidIngredient,

  #[msg("Missing ingredient definition for the remaining accounts")]
  MissingIngredientDefinition,
}