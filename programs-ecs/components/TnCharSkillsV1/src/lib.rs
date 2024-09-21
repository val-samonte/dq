use bolt_lang::*;

declare_id!("Bx1yYFTaYmjmvaQ3ep7iPqeutTjYSsZauzAQcUChvjQA");

#[component]
#[derive(Default)]
pub struct TnCharSkillsV1 {

    /// The character PDA.
    pub character: Pubkey,

    /// character skill instruction code.
    pub character_skill_code: [u8; 32],

    /// weapon skill instruction code.
    pub weapon_skill_code: [u8; 32],

    /// armor skill instruction code.
    pub armor_skill_code: [u8; 32],
    
    /// extra skill instruction code 1.
    pub extra1_skill_code: [u8; 32],
    
    /// extra skill instruction code 2.
    pub extra2_skill_code: [u8; 32],
    
    /// extra skill instruction code 3.
    pub extra3_skill_code: [u8; 32],
}
