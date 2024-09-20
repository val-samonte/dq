use bolt_lang::*;

declare_id!("AWdmUJiP39vCGeudvCZCpHNmnHMxM1nZmDqvPFH8xd3J");

#[system]
pub mod start_rank {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        
    }

    #[system_input]
    pub struct Components {
        
    }

}
