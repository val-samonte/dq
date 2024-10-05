use anchor_lang::prelude::*;

use crate::states::{Blueprint, Ingredient, Recipe};
use anchor_spl::{token::spl_token, token_2022::spl_token_2022};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateRecipeArgs {
  ingredients: Vec<IngredientDefinition>,
  output_amount: u64,
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
  recipe.output_amount = args.output_amount;

  let mut clear_requirements = false;
  
  for (index, account_info) in remaining_accounts.iter().enumerate() {

    if account_info.key().eq(&recipe.blueprint) {
      return Err(CreateRecipeError::BlueprintOutputIsAnIngredient.into());
    }

    if let Some(ingredient) = args.ingredients.get(index) {

      if ingredient.amount == 0 {
        return Err(CreateRecipeError::IngredientAmountIsZero.into());
      }

      if ingredient.consume_method > 0 && !clear_requirements {
        clear_requirements = true;
      }

      // TODO: SECURITY RISK, we cannot rely with this comparison
      if account_info.owner.eq(&crate::id()) {
        let blueprint_account = Blueprint::from_account_info(&account_info)?;
        
        recipe.ingredients.push(Ingredient {
          amount: ingredient.amount,
          asset: account_info.key(),
          asset_type: if blueprint_account.non_fungible { 0 } else { 1 },
          consume_method: ingredient.consume_method
        });

      } else if account_info.owner.eq(&spl_token::id()) {
        
        recipe.ingredients.push(Ingredient {
          amount: ingredient.amount,
          asset: account_info.key(),
          asset_type: 2,
          consume_method: ingredient.consume_method
        });

      } else if account_info.owner.eq(&spl_token_2022::id()) {
        
        recipe.ingredients.push(Ingredient {
          amount: ingredient.amount,
          asset: account_info.key(),
          asset_type: 3,
          consume_method: ingredient.consume_method
        });

      } else {
        return Err(CreateRecipeError::InvalidIngredient.into());
      }
      
    } else {
      return Err(CreateRecipeError::MissingIngredientDefinition.into());
    }
  }

  if recipe.ingredients.len() == 0 {
    return Err(CreateRecipeError::NoIngredients.into());
  }

  if !clear_requirements {
    return Err(CreateRecipeError::IngredientIsRetainOnly.into());
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

  #[msg("Ingredient amount should not be equal to zero")]
  IngredientAmountIsZero,

  #[msg("One of the ingredients must not have Retain as consume method")]
  IngredientIsRetainOnly,

  #[msg("No ingredients provided")]
  NoIngredients
}