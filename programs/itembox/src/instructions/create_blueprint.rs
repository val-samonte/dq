// use mpl_core to create a master edition collection

use anchor_lang::prelude::*;
// use mpl_token_metadata::instructions::CreateV1CpiBuilder;

use crate::states::{Main, Blueprint};

use mpl_core::{
  instructions::CreateCollectionV2CpiBuilder, 
  types::{Plugin, MasterEdition, PluginAuthority, PluginAuthorityPair}, ID as MPL_CORE_ID 
};
use mpl_token_metadata:: ID as MPL_TOKEN_METADATA_ID;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateBlueprintArgs {
  name: String,
  uri: String,
  treasury: Pubkey,
  mint_authority: Pubkey,
  non_fungible: bool,
}

#[derive(Accounts)]
#[instruction(args: CreateBlueprintArgs)]
pub struct CreateBlueprint<'info> {
  #[account(
    init, 
    payer = owner, 
    seeds = [
      b"blueprint",
      asset.key().as_ref()
    ], 
    bump, 
    space = Blueprint::len()
  )]
  pub blueprint: Box<Account<'info, Blueprint>>,

  #[account(mut)]
  /// CHECK: has_one in the main account
  pub treasury: UncheckedAccount<'info>,

  #[account(
    seeds = [
      b"main"
    ],
    bump = main.bump,
    has_one = treasury,
  )]
  pub main: Box<Account<'info, Main>>,

  #[account(mut)]
  pub asset: Signer<'info>,

  #[account(mut)]
  pub owner: Signer<'info>,

  #[account(address = MPL_CORE_ID)]
  /// CHECK: this account is checked by the address constraint
  pub mpl_core_program: UncheckedAccount<'info>,

  #[account(address = MPL_TOKEN_METADATA_ID)]
  /// CHECK: this account is checked by the address constraint
  pub mpl_token_metadata_program: UncheckedAccount<'info>,

  pub system_program: Program<'info, System>,
}

pub fn create_blueprint_handler(ctx: Context<CreateBlueprint>, args: CreateBlueprintArgs) -> Result<()> {
  let blueprint = &mut ctx.accounts.blueprint;
  let owner = &mut ctx.accounts.owner;
  let treasury = &mut ctx.accounts.treasury;
  // let main = &ctx.accounts.main;
  let mint_fee = ctx.accounts.main.blueprint_mint_fee;

  // pay fee to treasury

  let ix = anchor_lang::solana_program::system_instruction::transfer(
    &owner.key(),
    &treasury.key(),
    mint_fee,
  );
  anchor_lang::solana_program::program::invoke(
    &ix,
    &[
      owner.to_account_info(),
      treasury.to_account_info(),
      ctx.accounts.system_program.to_account_info(),
    ],
  )?;

  blueprint.bump = ctx.bumps.blueprint;
  blueprint.mint = ctx.accounts.asset.key();
  blueprint.authority = ctx.accounts.owner.key();
  blueprint.treasury = args.treasury.key();
  blueprint.mint_authority = args.mint_authority.key();
  blueprint.counter = 0;

  // let main_seed = &[&b"main"[..], &[main.bump]];

  if args.non_fungible {
    // create core collection with master edition plugin

    let mut plugins: Vec<PluginAuthorityPair> = vec![];

    plugins.push(
      PluginAuthorityPair {
        plugin: Plugin::MasterEdition(MasterEdition {
            max_supply: None,
            name: None,
            uri: None
        }),
        authority: Some(PluginAuthority::Address { address: ctx.accounts.main.key() }),
      }
    );

    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
      .collection(&ctx.accounts.asset.to_account_info())
      .payer(&ctx.accounts.owner.to_account_info())
      .update_authority(Some(&ctx.accounts.main.to_account_info()))
      .system_program(&ctx.accounts.system_program.to_account_info())
      .name(args.name)
      .uri(args.uri)
      .plugins(plugins)
      .invoke()?;

  } else {
    let asset = &ctx.accounts.asset;
    // create SPL token mint and apply token metadata
    // todo:

    // let (metadata, _bump) = Pubkey::find_program_address(
    //   &[
    //       b"metadata",
    //       MPL_TOKEN_METADATA_ID.as_ref(),
    //       asset.key().as_ref(),
    //   ],
    //   &MPL_TOKEN_METADATA_ID,
    // );
    // CreateV1CpiBuilder::new(&ctx.accounts.mpl_token_metadata_program.to_account_info());
  }
  
  Ok(())
}

// #[error_code]
// pub enum CreateBlueprintParamsError {
// }

