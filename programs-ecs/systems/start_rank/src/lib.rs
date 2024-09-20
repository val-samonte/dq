use bolt_lang::*;
use position::Position;

declare_id!("AWdmUJiP39vCGeudvCZCpHNmnHMxM1nZmDqvPFH8xd3J");

#[system]
pub mod start_rank {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        let position = &mut ctx.accounts.position;
        position.x += 1;
        position.y += 1;
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub position: Position,
    }

}
