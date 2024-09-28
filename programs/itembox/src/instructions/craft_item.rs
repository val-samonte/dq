use std::{collections::HashMap, str::FromStr};

use anchor_lang::prelude::*;
use anchor_spl::{
  associated_token::AssociatedToken, token::{
    self, spl_token::{
      self,
      state::Mint
    }, Burn, Token, TokenAccount, TransferChecked
  }, token_2022::{
    self, 
    spl_token_2022::{
      self, 
      state::{
        Account as AssociatedTokenAccount, Mint as Mint2022
      },
      // instruction::{
      //   mint_to,
      //   burn
      // }
    }, 
    Burn as Burn2022, 
    MintTo, 
    TransferChecked as TransferChecked2022
  }, token_interface::Token2022
};
use anchor_lang::solana_program::{
  // program::invoke_signed,
  program_pack::Pack
};
use mpl_core::{
  instructions::CreateV2CpiBuilder, 
  types::{Plugin, Edition, PluginAuthority, PluginAuthorityPair}, ID as MPL_CORE_ID 
};

use crate::states::{Blueprint, Main, Recipe};

#[derive(Accounts)]
pub struct CraftItem<'info> {
  #[account(
    has_one = blueprint
  )]
  pub recipe: Box<Account<'info, Recipe>>,

  #[account(
    mut, 
    has_one = mint
  )]
  pub blueprint: Box<Account<'info, Blueprint>>,

  #[account(mut)]
  /// CHECK: has_one in the blueprint
  pub mint: UncheckedAccount<'info>,

  #[account(
    init_if_needed,
    payer = owner,
    associated_token::mint = mint,
    associated_token::authority = owner
  )]
  pub owner_ata: Box<Account<'info, TokenAccount>>,

  #[account(mut)]
  pub owner: Signer<'info>,

  #[account(mut)]
  pub asset_signer: Signer<'info>,

  #[account(
    seeds = [b"main"],
    bump = main.bump
  )]
  pub main: Box<Account<'info, Main>>,

  #[account(address = MPL_CORE_ID)]
  /// CHECK: this account is checked by the address constraint
  pub mpl_core_program: UncheckedAccount<'info>,

  pub token_program: Program<'info, Token>,
  pub token_program_2022: Program<'info, Token2022>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,
}

pub fn craft_item_handler<'a, 'b, 'c, 'info>(
  ctx: Context<'a, 'b, 'c, 'info, CraftItem<'info>>
) -> Result<()> {

  let recipe = &ctx.accounts.recipe;
  let owner_pubkey = ctx.accounts.owner.key();

  let mut account_map: HashMap<Pubkey, &AccountInfo<'info>> = HashMap::new();
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
            &owner_pubkey.key(), 
            &token_program_id.key(), 
            &ingredient.asset.key()
          );

          if let Some(ata_account_info) = account_map.get(&ata_pubkey) {
            let ata_account = deserialize_ata(ata_account_info)?;
            if ata_account.amount < ingredient.amount {
              return Err(CraftItemError::InsufficientIngredientAmount.into());
            }

            match ingredient.consume_method {
              // =====================
              // BURN
              // =====================
              1 => {
                if ingredient.asset_type == 1 {
                  // =====================
                  // SPL Token
                  // =====================

                  let mint_account = deserialize_mint(asset_account)?;

                  token::burn(
                    CpiContext::new(
                      ctx.accounts.token_program.to_account_info(), 
                      Burn {
                        mint: asset_account.to_account_info(),    
                        from: ata_account_info.to_account_info(), 
                        authority: ctx.accounts.owner.to_account_info(), 
                      },
                    ),
                    ingredient.amount * 10u64.pow(mint_account.decimals as u32)
                  )?;
                } else {
                  // =====================
                  // SPL Token Extensions
                  // =====================

                  let mint_account = deserialize_mint_2022(asset_account)?;

                  token_2022::burn(
                    CpiContext::new(
                      ctx.accounts.token_program_2022.to_account_info(),
                      Burn2022 {
                        mint: asset_account.to_account_info(),
                        from: ata_account_info.to_account_info(),
                        authority: ctx.accounts.owner.to_account_info(),
                      },
                    ),
                    ingredient.amount * 10u64.pow(mint_account.decimals as u32)
                  )?;
                }
              }
              // =====================
              // TRANSFER
              // =====================
              2 => {
                let receiver_ata_pubkey = get_associated_token_address(
                  &ctx.accounts.blueprint.treasury.key(),
                  &token_program_id.key(),
                  &ingredient.asset.key()
                );

                if let Some(receiver_ata_account_info) = account_map.get(&receiver_ata_pubkey) {

                  let receiver_ata_account = deserialize_ata(receiver_ata_account_info)?;
                  if receiver_ata_account.amount < ingredient.amount {
                    return Err(CraftItemError::InsufficientIngredientAmount.into());
                  }

                  if ingredient.asset_type == 1 {
                    // =====================
                    // SPL Token
                    // =====================

                    let mint_account = deserialize_mint(asset_account)?;

                    token::transfer_checked(
                      CpiContext::new(
                        ctx.accounts.token_program.to_account_info(),
                        TransferChecked {
                          mint: asset_account.to_account_info(),
                          from: ata_account_info.to_account_info(),
                          to: receiver_ata_account_info.to_account_info(),
                          authority: ctx.accounts.owner.to_account_info(),
                        }
                      ),
                      ingredient.amount,
                      mint_account.decimals
                    )?;

                  } else {
                    // =====================
                    // SPL Token Extensions
                    // =====================

                    let mint_account = deserialize_mint_2022(asset_account)?;

                    token_2022::transfer_checked(
                      CpiContext::new(
                        ctx.accounts.token_program_2022.to_account_info(),
                        TransferChecked2022 {
                          mint: asset_account.to_account_info(),
                          from: ata_account_info.to_account_info(),
                          to: receiver_ata_account_info.to_account_info(),
                          authority: ctx.accounts.owner.to_account_info(),
                        }
                      ),
                      ingredient.amount,
                      mint_account.decimals
                    )?;

                  }
                } else {
                  return Err(CraftItemError::MissingIngredientAccount.into());
                }
              }
              // =====================
              // RETAIN 
              // =====================
              _ => {
                // do nothing
              }
            }
          } else {
            return Err(CraftItemError::MissingIngredientAccount.into());
          }
        }
      }
    }
  }

  // if everything is ok, mint the item
  let blueprint = &mut ctx.accounts.blueprint;
  let owner_ata = &ctx.accounts.owner_ata;
  let mint = &ctx.accounts.mint;
  let main = &ctx.accounts.main;
  
  blueprint.counter += 1;

  if blueprint.non_fungible {  
    // create core core asset with edition plugin

    let mut plugins: Vec<PluginAuthorityPair> = vec![];

    plugins.push(
      PluginAuthorityPair {
        plugin: Plugin::Edition(Edition {
          number: blueprint.counter,
        }),
        authority: Some(PluginAuthority::Address { address: main.key() }),
      }
    );

    CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
      .asset(&ctx.accounts.asset_signer.to_account_info())
      .collection(Some(&mint.to_account_info()))
      .payer(&ctx.accounts.owner.to_account_info())
      .owner(Some(&ctx.accounts.owner.to_account_info()))
      .authority(Some(&ctx.accounts.owner.to_account_info()))
      .update_authority(None)
      .system_program(&ctx.accounts.system_program.to_account_info())
      .plugins(plugins)
      .invoke()?;

  } else {
    let mint_account = deserialize_mint_2022(mint)?;
    let amount = 10u64.pow(mint_account.decimals as u32);
    // let main_seed = &[&b"main"[..], &[main.bump]];
    // let seeds = &[main_seed];

    // todo: invoke signed
    token_2022::mint_to(CpiContext::new(
      ctx.accounts.token_program_2022.to_account_info(),
      MintTo {
        mint: mint.to_account_info(),
        to: owner_ata.to_account_info(),
        authority: ctx.accounts.main.to_account_info(),
      },
    ), amount)?;

    // let ix = mint_to(
    //   ctx.program.key,
    //   ctx.accounts.mint.key,
    //   ctx.accounts.to.key,
    //   ctx.accounts.authority.key,
    //   &[],
    //   amount,
    // )?;
    // anchor_lang::solana_program::program::invoke_signed(
    //     &ix,
    //     &[ctx.accounts.to, ctx.accounts.mint, ctx.accounts.authority],
    //     ctx.signer_seeds,
    // )
    // .map_err(Into::into)
  }

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

pub fn deserialize_ata(account_info: &AccountInfo) -> Result<AssociatedTokenAccount> {
  let account_data = account_info.try_borrow_data()?;

  match AssociatedTokenAccount::unpack(&account_data) {
      Ok(token_account) => Ok(token_account),
      Err(_) => Err(ProgramError::InvalidAccountData.into()),
  }
}

pub fn deserialize_mint(account_info: &AccountInfo) -> Result<Mint> {
  let account_data = account_info.try_borrow_data()?;
  Mint::unpack(&account_data).map_err(|_| ProgramError::InvalidAccountData.into())
}

pub fn deserialize_mint_2022(account_info: &AccountInfo) -> Result<Mint2022> {
  let account_data = account_info.try_borrow_data()?;
  Mint2022::unpack(&account_data).map_err(|_| ProgramError::InvalidAccountData.into())
}