use anchor_lang::prelude::*;

declare_id!("C7JFdGAV8HeTnv5zRFfKAXh2vCrUeuZWZeqekrX1RnAf");

#[program]
pub mod itembox {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
