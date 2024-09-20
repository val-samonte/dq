use anchor_lang::prelude::*;

declare_id!("9FQ8ck9nj6z8Gs9q6iF75HySuF1KXyazKrQKb5kCYv2E");

#[program]
pub mod dq {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}


// dao token mint
// treasury
// authority