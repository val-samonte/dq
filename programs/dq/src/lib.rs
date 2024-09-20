use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

pub use instructions::*;

declare_id!("9FQ8ck9nj6z8Gs9q6iF75HySuF1KXyazKrQKb5kCYv2E");

#[program]
pub mod dq {
    use super::*;

    pub fn init(ctx: Context<Init>, params: InitParams) -> Result<()> {
        init_handler(ctx, params)
    }
    
}