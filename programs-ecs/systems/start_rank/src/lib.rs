use bolt_lang::*;
use tn_ranked_elo_v1::TnRankedEloV1;

declare_id!("AWdmUJiP39vCGeudvCZCpHNmnHMxM1nZmDqvPFH8xd3J");

#[system]
pub mod start_rank {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub ranked: TnRankedEloV1,
    }

}
