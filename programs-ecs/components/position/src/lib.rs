use bolt_lang::*;

declare_id!("9C8tuSrKjNoVNkC5tLvbDhsnnf5vNPTW64NdHMfZCFsg");

#[component]
#[derive(Default)]
pub struct Position {
    pub x: i64,
    pub y: i64,
    pub z: i64,
    #[max_len(20)]
    pub description: String,
}
