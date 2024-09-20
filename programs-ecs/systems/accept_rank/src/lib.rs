use bolt_lang::*;
use position::Position;

declare_id!("wYG5NKfHqwZEQGVjEkEKSPHvHmtb5gvrHCJhLdfF3HV");

#[system]
pub mod accept_rank {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
    }

    #[system_input]
    pub struct Components {

    }

}
