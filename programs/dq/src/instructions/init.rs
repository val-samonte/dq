use anchor_lang::prelude::*;

use crate::{state::main, state::Counter};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitParams {
  pub treasury: Pubkey,
  pub token_mint: Pubkey,
  pub character_mint_fee: u64,
}

#[derive(Accounts)]
#[instruction(params: InitParams)]
pub struct Init<'info> {
  #[account(
    init, 
    payer = authority, 
    seeds = [
      b"main",
    ], 
    bump, 
    space = Main::len()
  )]
  pub main: Box<Account<'info, Main>>,

  #[account(mut)]
  pub authority: Signer<'info>,

  pub system_program: Program<'info, System>,
}

pub fn init_handler(ctx: Context<Init>, params: InitParams) -> Result<()> {
  let main = &mut ctx.accounts.main;

  main.bump = ctx.bumps.main;
  main.authority = ctx.accounts.authority.key();
  main.treasury = params.treasury.key();
  main.token_mint = params.token.key();
  main.character_mint_fee = params.character_mint_fee;
  
  Ok(())
}
