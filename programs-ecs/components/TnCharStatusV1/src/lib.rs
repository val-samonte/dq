use bolt_lang::*;

declare_id!("5BBS4AUATNTRSyxrgmPRE3gnwYwkW1oZ22Er6aCFjWQz");

#[component]
#[derive(Default)]
pub struct TnCharStatusV1 {

    /// The character PDA.
    pub character: Pubkey,

    /// buff ins code slot 1
    pub buff_code_1: [u8; 32],

    /// buff ins code slot 2
    pub buff_code_2: [u8; 32],

    /// buff ins code slot 3
    pub buff_code_3: [u8; 32],

    /// buff ins code slot 4
    pub buff_code_4: [u8; 32],

    /// debuff ins code slot 1
    pub debuff_code_1: [u8; 32],

    /// debuff ins code slot 2
    pub debuff_code_2: [u8; 32],

    /// debuff ins code slot 3
    pub debuff_code_3: [u8; 32],

    /// debuff ins code slot 4
    pub debuff_code_4: [u8; 32],
}
