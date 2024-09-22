use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;

pub use instructions::*;

declare_id!("9FQ8ck9nj6z8Gs9q6iF75HySuF1KXyazKrQKb5kCYv2E");

#[program]
pub mod dq {
    use super::*;

    pub fn init(ctx: Context<Init>, args: InitArgs) -> Result<()> {
        init_handler(ctx, args)
    }
    
    pub fn create_character(ctx: Context<CreateCharacter>, args: CreateCharacterArgs) -> Result<()> {
        create_character_handler(ctx, args)
    }
}