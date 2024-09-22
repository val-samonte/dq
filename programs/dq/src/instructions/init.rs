use anchor_lang::prelude::*;

use crate::state::Main;

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitArgs {
  pub treasury: Pubkey,
  pub token_mint: Pubkey,
  pub character_mint_fee: u64,
}

#[derive(Accounts)]
#[instruction(args: InitArgs)]
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

pub fn init_handler(ctx: Context<Init>, args: InitArgs) -> Result<()> {
  let main = &mut ctx.accounts.main;

  main.bump = ctx.bumps.main;
  main.authority = ctx.accounts.authority.key();
  main.treasury = args.treasury.key();
  main.token_mint = args.token_mint.key();
  main.character_mint_fee = args.character_mint_fee;
  
  Ok(())
}
