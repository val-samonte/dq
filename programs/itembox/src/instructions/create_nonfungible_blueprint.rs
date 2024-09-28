// use mpl_core to create a master edition collection

use anchor_lang::prelude::*;
use crate::states::{Main, Blueprint};

use mpl_core::{
  instructions::CreateCollectionV2CpiBuilder, 
  types::{Plugin, MasterEdition, PluginAuthority, PluginAuthorityPair}, ID as MPL_CORE_ID 
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateNonFungibleBlueprintArgs {
  name: String,
  uri: String,
  treasury: Pubkey,
  mint_authority: Pubkey,
}

#[derive(Accounts)]
#[instruction(args: CreateNonFungibleBlueprintArgs)]
pub struct CreateNonFungibleBlueprint<'info> {
  #[account(
    init, 
    payer = owner, 
    seeds = [
      b"blueprint",
      collection.key().as_ref()
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
  pub collection: Signer<'info>,

  #[account(mut)]
  pub owner: Signer<'info>,

  #[account(address = MPL_CORE_ID)]
  /// CHECK: this account is checked by the address constraint
  pub mpl_core_program: UncheckedAccount<'info>,

  pub system_program: Program<'info, System>,
}

pub fn create_nonfungible_blueprint_handler(
  ctx: Context<CreateNonFungibleBlueprint>, 
  args: CreateNonFungibleBlueprintArgs
) -> Result<()> {
  let blueprint = &mut ctx.accounts.blueprint;
  let treasury = &mut ctx.accounts.treasury;
  let owner = &ctx.accounts.owner;
  let main = &ctx.accounts.main;
  let collection = &ctx.accounts.collection;
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
  blueprint.mint = ctx.accounts.collection.key();
  blueprint.non_fungible = true;
  blueprint.authority = ctx.accounts.owner.key();
  blueprint.treasury = args.treasury.key();
  blueprint.mint_authority = args.mint_authority.key();
  blueprint.counter = 0;

  // create core collection with master edition plugin

  let mut plugins: Vec<PluginAuthorityPair> = vec![];

  plugins.push(
    PluginAuthorityPair {
      plugin: Plugin::MasterEdition(MasterEdition {
        max_supply: None,
        name: None,
        uri: None
      }),
      authority: Some(PluginAuthority::Address { address: main.key() }),
    }
  );

  CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .collection(&collection.to_account_info())
    .payer(&owner.to_account_info())
    .update_authority(Some(&main.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .plugins(plugins)
    .invoke()?;
  
  Ok(())
}
