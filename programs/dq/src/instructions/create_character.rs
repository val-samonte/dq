use anchor_lang::prelude::*;

use crate::state::{Main, Character};

use mpl_core::{
  instructions::CreateV2CpiBuilder, 
  types::{PermanentBurnDelegate, PermanentFreezeDelegate, PluginAuthority, PluginAuthorityPair}, ID as MPL_CORE_ID 
};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCharacterArgs {
  name: String,
  gender: String,
  stat_int: u8,
  stat_str: u8,
  stat_dex: u8,
  stat_vit: u8,
}

#[derive(Accounts)]
#[instruction(args: CreateCharacterArgs)]
pub struct CreateCharacter<'info> {
  #[account(
    init, 
    payer = owner, 
    seeds = [
      b"character",
      asset.key().as_ref()
    ], 
    bump, 
    space = Character::len()
  )]
  pub character: Box<Account<'info, Character>>,

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

  pub system_program: Program<'info, System>,
  
}

pub fn create_character_handler(ctx: Context<CreateCharacter>, args: CreateCharacterArgs) -> Result<()> {
  args.validate()?;

  let character = &mut ctx.accounts.character;
  let owner = &mut ctx.accounts.owner;
  let treasury = &mut ctx.accounts.treasury;
  let mint_fee = ctx.accounts.main.character_mint_fee;

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

  // assign attributes (gender and stats)

  character.bump = ctx.bumps.character;
  character.gender = match args.gender.as_str() {
    "male" => 0,
    _ => 1
  };
  character.stat_int = args.stat_int;
  character.stat_str = args.stat_str;
  character.stat_dex = args.stat_dex;
  character.stat_vit = args.stat_vit;

  // perma freeze and perma burn plugin

  let mut plugins: Vec<PluginAuthorityPair> = vec![];

  plugins.push(
    PluginAuthorityPair {
      plugin: mpl_core::types::Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: false }),
      authority: Some(PluginAuthority::Address { address: ctx.accounts.main.key() }),
    }
  );

  plugins.push(
    PluginAuthorityPair {
      plugin: mpl_core::types::Plugin::PermanentBurnDelegate(PermanentBurnDelegate {  }),
      authority: Some(PluginAuthority::Address { address: ctx.accounts.main.key() }),
    }
  );

  // mint

  let uri = match args.gender.as_str() {
    "male" => "https://shdw-drive.genesysgo.net/EQUAMGwdZNwhuZxXVFeVmxVYd3ZWMhL1TYFoM1WScLgQ/character_male.json",
    _ => "https://shdw-drive.genesysgo.net/EQUAMGwdZNwhuZxXVFeVmxVYd3ZWMhL1TYFoM1WScLgQ/character_female.json",
  };

  CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .name(args.name)
    .uri(uri.to_string())
    .plugins(plugins)
    .payer(&ctx.accounts.owner.to_account_info())
    .update_authority(Some(&ctx.accounts.main.to_account_info()))
    .owner(None)
    .authority(None)
    .collection(None)
    .system_program(&ctx.accounts.system_program.to_account_info())
    .invoke()?;
  
  Ok(())
}

#[error_code]
pub enum CreateCharacterParamsError {
  #[msg("Name exceeds maximum length")]
  NameTooLong,

  #[msg("Gender must be either 'male' or 'female'")]
  InvalidGender,

  #[msg("Total stats (int, str, dex, vit) must equal 12")]
  InvalidTotalStats,
}

impl CreateCharacterArgs {
  pub fn validate(&self) -> Result<()> {
    const MAX_NAME_LENGTH: usize = 32; 
    const TOTAL_STATS: u8 = 12;        

    // Validate name length
    if self.name.len() > MAX_NAME_LENGTH {
        return Err(CreateCharacterParamsError::NameTooLong.into());
    }

    // Validate gender
    if self.gender != "male" && self.gender != "female" {
        return Err(CreateCharacterParamsError::InvalidGender.into());
    }

    // Validate that the total of all stats equals 12
    let total_stats = self.stat_int + self.stat_str + self.stat_dex + self.stat_vit;
    if total_stats != TOTAL_STATS {
        return Err(CreateCharacterParamsError::InvalidTotalStats.into());
    }

    Ok(())
  }
}

