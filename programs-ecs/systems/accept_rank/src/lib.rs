use bolt_lang::*;
use tn_ranked_elo_v1::TnRankedEloV1;

declare_id!("wYG5NKfHqwZEQGVjEkEKSPHvHmtb5gvrHCJhLdfF3HV");

#[system]
pub mod accept_rank {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub ranked: TnRankedEloV1,
    }

}
