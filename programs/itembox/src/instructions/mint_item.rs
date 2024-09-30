use anchor_lang::prelude::*;
use anchor_spl::{
  associated_token::AssociatedToken,
  token_2022::{
    self, 
    MintTo, 
  }, 
  token_interface::{
    Token2022,
    TokenAccount
  }
};
use mpl_core::{
  instructions::CreateV2CpiBuilder, 
  types::{Edition, Plugin, PluginAuthority, PluginAuthorityPair}, ID as MPL_CORE_ID 
};

use crate::{extract_name_and_uri, states::{Blueprint, Main}};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct MintItemArgs {
  amount: u64,
}

#[derive(Accounts)]
#[instruction(args: MintItemArgs)]
pub struct MintItem<'info> {
  #[account(
    mut, 
    has_one = mint,
    has_one = mint_authority
  )]
  pub blueprint: Box<Account<'info, Blueprint>>,

  #[account(mut)]
  /// CHECK: has_one in the blueprint
  pub mint: UncheckedAccount<'info>,

  #[account(
    init_if_needed,
    payer = mint_authority,
    associated_token::token_program = token_program,
    associated_token::mint = mint,
    associated_token::authority = receiver
  )]
  pub receiver_ata: Option<Box<InterfaceAccount<'info, TokenAccount>>>,

  #[account(mut)]
  /// CHECK: can be any account
  pub receiver: UncheckedAccount<'info>,

  #[account(mut)]
  pub mint_authority: Signer<'info>,

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
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,
}

pub fn mint_item_handler(ctx: Context<MintItem>, args: MintItemArgs) -> Result<()> {

  let receiver = &ctx.accounts.receiver;
  let mint_authority = &ctx.accounts.mint_authority;
  let main = &ctx.accounts.main;
  let additional_seeds: &[&[&[u8]]] = &[&[b"main", &[main.bump]]];

  let blueprint = &mut ctx.accounts.blueprint;  
  blueprint.counter = blueprint.counter.checked_add(1).unwrap();
  
  if blueprint.non_fungible {  

    if args.amount > 1 {
      return Err(MintItemError::CannotMintMoreThanOneNonFungibleItem.into());
    }

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
      .payer(&mint_authority.to_account_info())
      .owner(Some(&receiver.to_account_info()))
      .authority(Some(&main.to_account_info()))
      .update_authority(None)
      .system_program(&ctx.accounts.system_program.to_account_info())
      .plugins(plugins)
      .name(name)
      .uri(uri)      
      .invoke_signed(additional_seeds)?;

  } else {
    if let Some(receiver_ata) = &ctx.accounts.receiver_ata {
      token_2022::mint_to(
        CpiContext::new(
          ctx.accounts.token_program.to_account_info(),
          MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: receiver_ata.to_account_info(),
            authority: ctx.accounts.main.to_account_info(),
          },
        ).with_signer(additional_seeds), 
        // note: output amount is always an integer
        args.amount
      )?;
    } else {
      return Err(MintItemError::MissingOwnerAtaAccount.into());
    }
  }

  Ok(())
}

#[error_code]
pub enum MintItemError {
  #[msg("Max supply reached")]
  MaxSupplyReached,

  #[msg("Missing owner associated token account")]
  MissingOwnerAtaAccount,

  #[msg("Cannot mint more than one non-fungible item")]
  CannotMintMoreThanOneNonFungibleItem,
}
