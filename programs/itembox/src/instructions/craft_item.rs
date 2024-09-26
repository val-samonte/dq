use std::{collections::HashMap, str::FromStr};

use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token::{self, spl_token, Burn}, token_2022::{self, spl_token_2022, Burn as Burn2022}};
use solana_program::program_pack::Pack;
use spl_token::state::Account as TokenAccount;

use crate::states::{Blueprint, Recipe};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateItemArgs {
  
}

#[derive(Accounts)]
// #[instruction(args: CraftItemArgs)]
pub struct CraftItem<'info> {
  #[account(
    has_one = blueprint
  )]
  pub recipe: Box<Account<'info, Recipe>>,

  #[account(mut)]
  pub blueprint: Box<Account<'info, Blueprint>>,

  #[account(mut)]
  pub owner: Signer<'info>,

  pub token_program: Program<'info, token::Token>,
  pub token_program_2022: Program<'info, token_2022::Token2022>,
  pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,
}

pub fn craft_item_handler(ctx: Context<CraftItem>, _args: CreateItemArgs) -> Result<()> {

  let recipe = &ctx.accounts.recipe;
  let owner_pubkey = ctx.accounts.owner.key();

  let mut account_map: HashMap<Pubkey, &AccountInfo> = HashMap::new();
  for account in ctx.remaining_accounts.iter() {
    account_map.insert(*account.key, account);
  }

  for ingredient in recipe.ingredients.iter() {
    if let Some(asset_account) = account_map.get(&ingredient.asset) {
      match ingredient.asset_type {
        0 => {
          // todo: parse blueprint
          // if let Ok(blueprint_account) = Blueprint::try_from_slice(&account_info.data.borrow()) {
            // let mint = account_map.get(&blueprint_account.mint).unwrap();
          // }

        }
        _ => {
          let token_program_id = if ingredient.asset_type == 1 {
            spl_token::id()
          } else {
            spl_token_2022::id()
          };

          let ata_pubkey = get_associated_token_address(
            &owner_pubkey, 
            &token_program_id, 
            &ingredient.asset.key()
          );

          if let Some(ata_account_info) = account_map.get(&ata_pubkey) {
            let ata_account = deserialize_ata(ata_account_info)?;
            if ata_account.amount < ingredient.amount {
              return Err(CraftItemError::InsufficientIngredientAmount.into());
            }

            // ata_account_info.to_account_info()

            match ingredient.consume_method {
              1 => {
                // Burn {
                //   mint: asset_account.to_account_info(),
                //   from: ata_account_info.to_account_info(),
                //   authority: ctx.accounts.owner.to_account_info(),

                // };
                // burn
                // token::burn(
                //   CpiContext::new(
                //       ctx.accounts.token_program.to_account_info(),
                //       Burn {
                //           mint: mint_account.to_account_info(),
                //           from: ata_account.to_account_info(),
                //           authority: ctx.accounts.owner.to_account_info(),
                //       },
                //   ),
                //   amount,
                // )
              }
              2 => {
                // transfer
              }
              _ => {
                // retain
                return Ok(());
              }
            }

          } else {
            return Err(CraftItemError::MissingIngredientAccount.into());
          }
        }
      }
    }
  }

  // todo: if everything is ok, mint the item
  // let _blueprint = &ctx.accounts.blueprint;

  Ok(())
}

#[error_code]
pub enum CraftItemError {
  #[msg("An account is missing from the remaining accounts")]
  MissingIngredientAccount,

  #[msg("Insufficient ingredient amount")]
  InsufficientIngredientAmount,
}

// had to manually do this due to ata lib issues
pub fn get_associated_token_address(
  wallet_address: &Pubkey,
  token_program_id: &Pubkey,
  token_mint_address: &Pubkey,
) -> Pubkey {
  Pubkey::find_program_address(
    &[
      &wallet_address.to_bytes(),
      &token_program_id.to_bytes(),
      &token_mint_address.to_bytes(),
    ],
    &Pubkey::from_str("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL").unwrap()
  ).0
}

pub fn deserialize_ata(account_info: &AccountInfo) -> Result<TokenAccount> {
  let account_data = account_info.try_borrow_data()?;

  match TokenAccount::unpack(&account_data) {
      Ok(token_account) => Ok(token_account),
      Err(_) => Err(ProgramError::InvalidAccountData.into()),
  }
}