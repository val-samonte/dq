
use anchor_lang::{
  prelude::{ProgramError, Result},
  solana_program::account_info::AccountInfo,
};
use anchor_spl::token_interface::spl_token_2022::state::Mint as Mint2022;
use anchor_spl::token_interface::spl_token_2022::solana_program::program_pack::Pack;

pub fn deserialize_mint_2022(account_info: &AccountInfo) -> Result<Mint2022> {
  let account_data = account_info.try_borrow_data()?;
  Mint2022::unpack(&account_data[0..82]).map_err(|_| ProgramError::InvalidAccountData.into())
}
