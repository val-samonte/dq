use bolt_lang::*;

declare_id!("4fqrH1Bi33PtjuGyFXwfvNKhnWG1yKLUU2SJUD95FY3P");

#[component]
#[derive(Default)]
pub struct TnRankedPvpV1 {

    /// The character PDA.
    pub character: Pubkey,

    /// The character PDA of the opponent.
    pub opponent: Pubkey,

    /// Not started [0], Initialized [1], In battle [2], Won [3], Lost [4], Draw [5].
    pub status: u8,
    
    /// Number of turns ellapsed.
    pub turns: u8,

    /// Block of the last turn.
    pub turn_timestamp: u64,

    /// Hit points.
    pub hp: u16,

    /// Max hit points.
    pub max_hp: u16,

    /// Mana points.
    pub mp: u8,

    /// Max mana points.
    pub max_mp: u8,

    /// Mana regen per turn.
    pub mp_regen: u8,

    /// Physical damage resistance %.
    pub dmg_res: u8,

    /// Magical damage resistance %.
    pub mag_res: u8,

    /// Intelligence.
    pub int: u8,

    /// Strength.
    pub str: u8,

    /// Dexterity.
    pub dex: u8,

    /// Vitality.
    pub vit: u8,
}
