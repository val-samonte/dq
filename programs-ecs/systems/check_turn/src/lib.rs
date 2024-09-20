use bolt_lang::*;
use tn_ranked_pvp_v1::TnRankedPvpV1;

declare_id!("6D31googQLKy3edozYYLtws1m9Nnf9fdLzbAg2DpvWLR");

// called to:
// see if mana can be replenished
// see if player status needs to be triggered
#[system]
pub mod check_turn {

    pub fn execute(ctx: Context<Components>, _args_p: Vec<u8>) -> Result<Components> {
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub player_state: TnRankedPvpV1,
    }

}
