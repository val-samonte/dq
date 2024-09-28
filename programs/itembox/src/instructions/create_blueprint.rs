// use mpl_core to create a master edition collection

use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, InitializeMint2, Token2022};

use crate::states::{Main, Blueprint};

use mpl_core::{
  instructions::CreateCollectionV2CpiBuilder, 
  types::{Plugin, MasterEdition, PluginAuthority, PluginAuthorityPair}, ID as MPL_CORE_ID 
};
use mpl_token_metadata::{instructions::CreateV1CpiBuilder,  ID as MPL_TOKEN_METADATA_ID};

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
      mint.key().as_ref()
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
  pub mint: Signer<'info>,

  /// CHECK: The metadata account PDA is derived with the provided seeds, ensuring correctness
  #[account(
    mut,
    seeds = [
      b"metadata",
      MPL_TOKEN_METADATA_ID.as_ref(),
      mint.key().as_ref(),
    ],
    bump,
  )]
  pub metadata: UncheckedAccount<'info>, 

  #[account(mut)]
  pub owner: Signer<'info>,

  #[account(address = MPL_CORE_ID)]
  /// CHECK: this account is checked by the address constraint
  pub mpl_core_program: UncheckedAccount<'info>,

  #[account(address = MPL_TOKEN_METADATA_ID)]
  /// CHECK: this account is checked by the address constraint
  pub mpl_token_metadata_program: UncheckedAccount<'info>,

  pub system_program: Program<'info, System>,
  pub token_program_2022: Program<'info, Token2022>,
  
  /// CHECK: Instructions sysvar account
  #[account(address = anchor_lang::solana_program::sysvar::instructions::ID)]
  pub sysvar_instructions: UncheckedAccount<'info>,
}

pub fn create_blueprint_handler(ctx: Context<CreateBlueprint>, args: CreateBlueprintArgs) -> Result<()> {
  let blueprint = &mut ctx.accounts.blueprint;
  let treasury = &mut ctx.accounts.treasury;
  let owner = &ctx.accounts.owner;
  let main = &ctx.accounts.main;
  let mint = &ctx.accounts.mint;
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
  blueprint.mint = ctx.accounts.mint.key();
  blueprint.non_fungible = args.non_fungible;
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
        authority: Some(PluginAuthority::Address { address: main.key() }),
      }
    );

    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
      .collection(&mint.to_account_info())
      .payer(&owner.to_account_info())
      .update_authority(Some(&main.to_account_info()))
      .system_program(&ctx.accounts.system_program.to_account_info())
      .name(args.name)
      .uri(args.uri)
      .plugins(plugins)
      .invoke()?;

  } else {
    // create SPL token mint and apply token metadata

    token_2022::initialize_mint2(
      CpiContext::new(
        ctx.accounts.token_program_2022.to_account_info(),
        InitializeMint2 {
          mint: mint.to_account_info(),
        },
      ),
      0,
      &main.key(),
      Some(&main.key()),
    )?;

    CreateV1CpiBuilder::new(&ctx.accounts.mpl_token_metadata_program.to_account_info())
      .metadata(&ctx.accounts.metadata.to_account_info())          
      .mint(&mint.to_account_info(), true)
      .authority(&main.to_account_info())
      .payer(&owner.to_account_info())
      .update_authority(&main.to_account_info(), true)
      .system_program(&ctx.accounts.system_program.to_account_info())
      .sysvar_instructions(&ctx.accounts.sysvar_instructions.to_account_info())
      .name(args.name)               
      .uri(args.uri)                 
      .invoke()?;                                        
  }
  
  Ok(())
}
