// source https://www.quicknode.com/guides/solana-development/anchor/token-2022

use anchor_lang::{
  prelude::{ProgramError, Result},
  solana_program::{
      account_info::AccountInfo,
      program::invoke,
      pubkey::Pubkey,
      rent::Rent,
      system_instruction::transfer,
      sysvar::Sysvar,
  },
  Lamports,
};
use anchor_lang::solana_program::program_pack::Pack;
use anchor_spl::{token::spl_token::state::Mint, token_interface::spl_token_2022::{
  extension::{BaseStateWithExtensions, Extension, StateWithExtensions},
  solana_zk_token_sdk::zk_token_proof_instruction::Pod,
  state::Mint as Mint2022,
  state::Account as AssociatedTokenAccount,
}};
use mpl_core::Collection;
use spl_tlv_account_resolution::{account::ExtraAccountMeta, state::ExtraAccountMetaList};
use spl_type_length_value::variable_len_pack::VariableLenPack;

pub const APPROVE_ACCOUNT_SEED: &[u8] = b"approve-account";
pub const META_LIST_ACCOUNT_SEED: &[u8] = b"extra-account-metas";

pub fn update_account_lamports_to_minimum_balance<'info>(
  account: AccountInfo<'info>,
  payer: AccountInfo<'info>,
  system_program: AccountInfo<'info>,
) -> Result<()> {
  let extra_lamports = Rent::get()?.minimum_balance(account.data_len()) - account.get_lamports();
  if extra_lamports > 0 {
    invoke(
      &transfer(payer.key, account.key, extra_lamports),
      &[payer, account, system_program],
    )?;
  }
  Ok(())
}

pub fn get_mint_extensible_extension_data<T: Extension + VariableLenPack>(
  account: &mut AccountInfo,
) -> Result<T> {
  let mint_data = account.data.borrow();
  let mint_with_extension = StateWithExtensions::<Mint2022>::unpack(&mint_data)?;
  let extension_data = mint_with_extension.get_variable_len_extension::<T>()?;
  Ok(extension_data)
}

pub fn get_mint_extension_data<T: Extension + Pod>(account: &mut AccountInfo) -> Result<T> {
  let mint_data = account.data.borrow();
  let mint_with_extension = StateWithExtensions::<Mint2022>::unpack(&mint_data)?;
  let extension_data = *mint_with_extension.get_extension::<T>()?;
  Ok(extension_data)
}

pub fn get_meta_list(approve_account: Option<Pubkey>) -> Vec<ExtraAccountMeta> {
  if let Some(approve_account) = approve_account {
    return vec![ExtraAccountMeta {
      discriminator: 0,
      address_config: approve_account.to_bytes(),
      is_signer: false.into(),
      is_writable: true.into(),
    }];
  }
  vec![]
}

pub fn get_meta_list_size(approve_account: Option<Pubkey>) -> usize {
  // safe because it's either 0 or 1
  ExtraAccountMetaList::size_of(get_meta_list(approve_account).len()).unwrap()
}

pub fn deserialize_ata(account_info: &AccountInfo) -> Result<AssociatedTokenAccount> {
  let account_data = &account_info.try_borrow_data()?[0..AssociatedTokenAccount::LEN];
  
  match AssociatedTokenAccount::unpack(&account_data) {
    Ok(token_account) => Ok(token_account),
    Err(_) => Err(ProgramError::InvalidAccountData.into()),
  }
}

pub fn deserialize_mint(account_info: &AccountInfo) -> Result<Mint> {
  let account_data = account_info.try_borrow_data()?;
  Mint::unpack(&account_data).map_err(|_| ProgramError::InvalidAccountData.into())
}

pub fn extract_name_and_uri(data: &AccountInfo) -> Result<(String, String)> {
  let mint_data = data.try_borrow_data()?;
  let collection_account = Collection::from_bytes(&mint_data)?;

  Ok((
    collection_account.base.name.to_string(),
    collection_account.base.uri.to_string(),
  ))
}