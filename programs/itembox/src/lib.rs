use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;

pub use instructions::*;

declare_id!("C7JFdGAV8HeTnv5zRFfKAXh2vCrUeuZWZeqekrX1RnAf");

#[program]
pub mod dq {
    use super::*;

    pub fn init(ctx: Context<Init>, args: InitArgs) -> Result<()> {
        init_handler(ctx, args)
    }
}