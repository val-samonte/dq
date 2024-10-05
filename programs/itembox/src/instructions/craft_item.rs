use std::{collections::HashMap, str::FromStr};

use anchor_lang::prelude::*;
use anchor_spl::{
  associated_token::{
    self,
    Create, 
    AssociatedToken
  }, 
  token::{
    self, 
    spl_token::{
      self,
    }, 
    Burn, 
    Token, 
    TransferChecked
  }, 
  token_2022::{
    self, 
    spl_token_2022::{
      self,
    }, 
    Burn as Burn2022, 
    MintTo, 
    TransferChecked as TransferChecked2022
  }, 
  token_interface::{
    Token2022,
    TokenAccount
  }
};
use mpl_core::{
  instructions::{BurnV1CpiBuilder, CreateV2CpiBuilder, TransferV1CpiBuilder}, 
  types::{Edition, Plugin, PluginAuthority, PluginAuthorityPair}, ID as MPL_CORE_ID 
};

use crate::{deserialize_ata, deserialize_mint, deserialize_mint_2022, extract_name_and_uri, states::{Blueprint, Main, Recipe}};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CraftItemArgs {
  items_ref: Vec<ItemRef>,
}

#[derive(Accounts)]
#[instruction(args: CraftItemArgs)]
pub struct CraftItem<'info> {
  #[account(
    has_one = blueprint
  )]
  pub recipe: Box<Account<'info, Recipe>>,

  #[account(
    mut, 
    has_one = mint,
    has_one = treasury
  )]
  pub blueprint: Box<Account<'info, Blueprint>>,

  #[account(mut)]
  /// CHECK: has_one in the blueprint
  pub treasury: UncheckedAccount<'info>,

  #[account(mut)]
  /// CHECK: has_one in the blueprint
  pub mint: UncheckedAccount<'info>,

  #[account(
    init_if_needed,
    payer = owner,
    associated_token::token_program = token_program,
    associated_token::mint = mint,
    associated_token::authority = owner
  )]
  pub owner_ata: Option<Box<InterfaceAccount<'info, TokenAccount>>>,

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

  pub token_program: Program<'info, Token2022>,
  pub token_program_old: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,
}

pub fn craft_item_handler<'a, 'b, 'c, 'info>(
  ctx: Context<'a, 'b, 'c, 'info, CraftItem<'info>>,
  args: CraftItemArgs
) -> Result<()> {

  let owner = &ctx.accounts.owner;
  let recipe = &ctx.accounts.recipe;
  let main = &ctx.accounts.main;
  let additional_seeds: &[&[&[u8]]] = &[&[b"main", &[main.bump]]];

  let mut account_map: HashMap<Pubkey, &AccountInfo<'info>> = HashMap::new();
  for account in ctx.remaining_accounts.iter() {
    account_map.insert(*account.key, account);
  }
  
  for ingredient in recipe.ingredients.iter() {
    if let Some(asset_account) = account_map.get(&ingredient.asset) {
      match ingredient.asset_type {
        // =============================
        // Blueprint Ingredient
        // =============================
        0 | 1 => {
          let blueprint_account = Blueprint::from_account_info(&asset_account)?;
          
          if let Some(asset) = account_map.get(&blueprint_account.mint) {
            // =============================
            // Metaplex Core Asset
            // =============================
            if blueprint_account.non_fungible {
              if let Some(item) = get_item_ref(&args.items_ref, &blueprint_account.mint.key()) {
                if let Some(item_account) = account_map.get(&item) {
                  match ingredient.consume_method {
                    // =============================
                    // BURN
                    // =============================
                    1 => {
                      BurnV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
                        .asset(&item_account.to_account_info())
                        .collection(Some(&asset.to_account_info()))
                        .payer(&owner.to_account_info())
                        .authority(Some(&owner.to_account_info()))
                        .system_program(Some(&ctx.accounts.system_program.to_account_info()))
                        .invoke()?;
                    }
                    // =============================
                    // TRANSFER
                    // =============================
                    2 => {
                      if let Some(treasury_account) = account_map.get(&ctx.accounts.blueprint.treasury) {
                        TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
                          .asset(&item_account.to_account_info())
                          .collection(Some(&asset.to_account_info()))
                          .payer(&owner.to_account_info())
                          .authority(Some(&owner.to_account_info()))
                          .new_owner(&treasury_account.to_account_info())
                          .system_program(Some(&ctx.accounts.system_program.to_account_info()))
                          .invoke()?;
                      } else {
                        return Err(CraftItemError::MissingReceiverTokenAccount.into());
                      }
                    }
                    // =============================
                    // RETAIN 
                    // =============================
                    _ => {
                      // todo: check if the blueprint is owned by the owner
                    }
                  }
                } else {
                  return Err(CraftItemError::MissingNonFungibleItemAccount.into());
                }
              } else {
                return Err(CraftItemError::MissingNonFungibleItemRef.into());
              }
            // =============================
            // SPL Token Extensions
            // =============================
            } else {

              let mint_account = deserialize_mint_2022(asset)?;

              let ata_pubkey = get_associated_token_address(
                &owner.key(), 
                &spl_token_2022::id().key(), 
                &asset.key()
              );
            
              if let Some(ata_account_info) = account_map.get(&ata_pubkey) {
                let required_amount = ingredient.amount;

                let ata_account = deserialize_ata(ata_account_info)?;

                if ata_account.amount < required_amount {
                  return Err(CraftItemError::InsufficientIngredientAmount.into());
                }
              
                match ingredient.consume_method {
                  // =============================
                  // BURN
                  // =============================
                  1 => {
              
                    token_2022::burn(
                      CpiContext::new(
                        ctx.accounts.token_program.to_account_info(),
                        Burn2022 {
                          mint: asset.to_account_info(),
                          from: ata_account_info.to_account_info(),
                          authority: owner.to_account_info(),
                        },
                      ),
                      required_amount
                    )?;
              
                  }
                  // =============================
                  // TRANSFER
                  // =============================
                  2 => {
                    let receiver_ata_pubkey = get_associated_token_address(
                      &ctx.accounts.blueprint.treasury.key(),
                      &spl_token_2022::id().key(),
                      &asset.key()
                    );
              
                    if let Some(receiver_ata_account_info) = account_map.get(&receiver_ata_pubkey) {

                      ctx.accounts.create_associated_token_account(
                        &ctx.accounts.treasury,
                        asset,
                        receiver_ata_account_info,
                        true
                      )?;

                      // let receiver_ata_account = deserialize_ata(receiver_ata_account_info)?;
                      
                      token_2022::transfer_checked(
                        CpiContext::new(
                          ctx.accounts.token_program.to_account_info(),
                          TransferChecked2022 {
                            mint: asset.to_account_info(),
                            from: ata_account_info.to_account_info(),
                            to: receiver_ata_account_info.to_account_info(),
                            authority: owner.to_account_info(),
                          }
                        ),
                        required_amount,
                        mint_account.decimals
                      )?;
                      
                    } else {
                      return Err(CraftItemError::MissingReceiverTokenAccount.into());
                    }
                  }
                  // =============================
                  // RETAIN 
                  // =============================
                  _ => {
                    // do nothing. balance is checked before this.
                  }
                }
              } else {
                return Err(CraftItemError::MissingSenderTokenAccount.into());
              }
            }

          } else {
            if blueprint_account.non_fungible {
              return Err(CraftItemError::MissingBlueprintNonFungibleAccount.into());
            } else {
              return Err(CraftItemError::MissingBlueprintFungibleAccount.into());
            }
          }
        }
        // =============================
        // SPL / Token2022 Ingredient
        // =============================
        _ => {
          let token_program_id = if ingredient.asset_type == 2 {
            spl_token::id()
          } else {
            spl_token_2022::id()
          };

          let ata_pubkey = get_associated_token_address(
            &owner.key(), 
            &token_program_id.key(), 
            &ingredient.asset.key()
          );

          if let Some(ata_account_info) = account_map.get(&ata_pubkey) {
            let ata_account = deserialize_ata(ata_account_info)?;
            let required_amount = ingredient.amount;
            
            if ata_account.amount < required_amount {
              return Err(CraftItemError::InsufficientIngredientAmount.into());
            }

            match ingredient.consume_method {
              // =============================
              // BURN
              // =============================
              1 => {
                if ingredient.asset_type == 2 {
                  // =============================
                  // SPL Token
                  // =============================

                  token::burn(
                    CpiContext::new(
                      ctx.accounts.token_program_old.to_account_info(), 
                      Burn {
                        mint: asset_account.to_account_info(),    
                        from: ata_account_info.to_account_info(), 
                        authority: owner.to_account_info(), 
                      },
                    ),
                    required_amount
                  )?;

                } else {
                  // =============================
                  // SPL Token Extensions
                  // =============================

                  token_2022::burn(
                    CpiContext::new(
                      ctx.accounts.token_program.to_account_info(),
                      Burn2022 {
                        mint: asset_account.to_account_info(),
                        from: ata_account_info.to_account_info(),
                        authority: owner.to_account_info(),
                      },
                    ),
                    required_amount
                  )?;

                }
              }
              // =============================
              // TRANSFER
              // =============================
              2 => {

                let receiver_ata_pubkey = get_associated_token_address(
                  &ctx.accounts.treasury.key(),
                  &token_program_id.key(),
                  &ingredient.asset.key()
                );

                if let Some(receiver_ata_account_info) = account_map.get(&receiver_ata_pubkey) {

                  if ingredient.asset_type == 2 {
                    // =============================
                    // SPL Token
                    // =============================

                    let mint_account = deserialize_mint(asset_account)?;

                    ctx.accounts.create_associated_token_account(
                      &ctx.accounts.treasury,
                      asset_account,
                      receiver_ata_account_info,
                      false
                    )?;                    
                  
                    token::transfer_checked(
                      CpiContext::new(
                        ctx.accounts.token_program_old.to_account_info(),
                        TransferChecked {
                          mint: asset_account.to_account_info(),
                          from: ata_account_info.to_account_info(),
                          to: receiver_ata_account_info.to_account_info(),
                          authority: owner.to_account_info(),
                        }
                      ),
                      required_amount,
                      mint_account.decimals
                    )?;

                  } else {
                    // =============================
                    // SPL Token Extensions
                    // =============================

                    let mint_account = deserialize_mint_2022(asset_account)?;

                    ctx.accounts.create_associated_token_account(
                      &ctx.accounts.treasury,
                      asset_account,
                      receiver_ata_account_info,
                      true
                    )?;

                    token_2022::transfer_checked(
                      CpiContext::new(
                        ctx.accounts.token_program.to_account_info(),
                        TransferChecked2022 {
                          mint: asset_account.to_account_info(),
                          from: ata_account_info.to_account_info(),
                          to: receiver_ata_account_info.to_account_info(),
                          authority: owner.to_account_info(),
                        }
                      ),
                      required_amount,
                      mint_account.decimals
                    )?;

                  }
                } else {
                  return Err(CraftItemError::MissingReceiverTokenAccount.into());
                }
              }
              // =============================
              // RETAIN 
              // =============================
              _ => {
                // check if amount is correct
              }
            }
          } else {
            return Err(CraftItemError::MissingSenderTokenAccount.into());
          }
        }
      }
    } else {
      match ingredient.asset_type {
        1 => {
          return Err(CraftItemError::MissingSplMintAccount.into());
        }
        2 => {
          return Err(CraftItemError::MissingToken2022MintAccount.into());
        }
        _ => {
          return Err(CraftItemError::MissingBlueprintAccount.into());
        }
      }
    }
  }
  

  let blueprint = &mut ctx.accounts.blueprint;  
  blueprint.counter = blueprint.counter.checked_add(1).unwrap();
  
  if blueprint.non_fungible {  
    // create core asset with edition plugin

    let mut plugins: Vec<PluginAuthorityPair> = vec![];

    plugins.push(
      PluginAuthorityPair {
        plugin: Plugin::Edition(Edition {
          number: blueprint.counter,
        }),
        authority: Some(PluginAuthority::Address { address: main.key() }),
      }
    );

    let (name, uri) = extract_name_and_uri(&ctx.accounts.mint)?;

    CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
      .asset(&ctx.accounts.asset_signer.to_account_info())
      .collection(Some(&ctx.accounts.mint.to_account_info()))
      .payer(&owner.to_account_info())
      .owner(Some(&owner.to_account_info()))
      .authority(Some(&main.to_account_info()))
      .update_authority(None)
      .system_program(&ctx.accounts.system_program.to_account_info())
      .plugins(plugins)
      .name(name)
      .uri(uri)      
      .invoke_signed(additional_seeds)?;

  } else {
    if let Some(owner_ata) = &ctx.accounts.owner_ata {
      token_2022::mint_to(
        CpiContext::new(
          ctx.accounts.token_program.to_account_info(),
          MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: owner_ata.to_account_info(),
            authority: ctx.accounts.main.to_account_info(),
          },
        ).with_signer(additional_seeds), 
        // note: output amount is always an integer
        recipe.output_amount
      )?;
    } else {
      return Err(CraftItemError::MissingOwnerAtaAccount.into());
    }
  }

  Ok(())
}

#[error_code]
pub enum CraftItemError {

  #[msg("Missing Blueprint PDA account from the remaining accounts")]
  MissingBlueprintAccount,

  #[msg("A Non-Fungible Item address is not provided as args in items_ref")]
  MissingNonFungibleItemRef,

  #[msg("Missing Non-Fungible Item account from the remaining accounts")]
  MissingNonFungibleItemAccount,

  #[msg("Missing Blueprint Non-Fungible (Core Collection) account from the remaining accounts")]
  MissingBlueprintNonFungibleAccount,

  #[msg("Missing Blueprint Fungible (Token2022) account from the remaining accounts")]
  MissingBlueprintFungibleAccount,

  #[msg("Missing SPL Mint account from the remaining accounts")]
  MissingSplMintAccount,

  #[msg("Missing Token2022 Mint account from the remaining accounts")]
  MissingToken2022MintAccount,

  #[msg("Missing sender associated token account from the remaining accounts")]
  MissingSenderTokenAccount,

  #[msg("Missing receiver associated token account from the remaining accounts")]
  MissingReceiverTokenAccount,

  #[msg("Insufficient ingredient amount, make sure you are passing the decimal value")]
  InsufficientIngredientAmount,

  #[msg("Max supply reached")]
  MaxSupplyReached,

  #[msg("Missing owner associated token account")]
  MissingOwnerAtaAccount,
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

pub fn get_item_ref(
  items_ref: &Vec<ItemRef>,
  collection: &Pubkey,
) -> Option<Pubkey> {
  
  for entry in items_ref {
    if entry.collection.key() == collection.key() {
      return Some(entry.item);
    }
  }
  
  None
}

impl<'info> CraftItem<'info> {
  fn create_associated_token_account(
    &self,
    owner: &AccountInfo<'info>,
    mint: &AccountInfo<'info>,
    ata: &AccountInfo<'info>,
    token_extension: bool,
  ) -> Result<()> {
    if ata.data_is_empty() {
      let token_program = if token_extension {
        self.token_program.to_account_info()
      } else {
        self.token_program_old.to_account_info()
      };

      let cpi_accounts = Create {
        payer: self.owner.to_account_info(),
        associated_token: ata.to_account_info(),
        authority: owner.to_account_info(),
        mint: mint.to_account_info(),
        system_program: self.system_program.to_account_info(),
        token_program: token_program.to_account_info(),
      };

      let cpi_program = self.associated_token_program.to_account_info();
      let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
      
      associated_token::create(cpi_ctx)?;
    }

    Ok(())
  }


}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ItemRef {
  pub collection: Pubkey,
  pub item: Pubkey,
}