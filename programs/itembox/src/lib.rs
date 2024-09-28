use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;
pub mod utils;

pub use instructions::*;
pub use utils::*;

declare_id!("C7JFdGAV8HeTnv5zRFfKAXh2vCrUeuZWZeqekrX1RnAf");

#[program]
pub mod itembox {
    use super::*;

    pub fn init(ctx: Context<Init>, args: InitArgs) -> Result<()> {
        init_handler(ctx, args)
    }

    pub fn create_nonfungible_blueprint(
        ctx: Context<CreateNonFungibleBlueprint>, 
        args: CreateNonFungibleBlueprintArgs
    ) -> Result<()> {
        create_nonfungible_blueprint_handler(ctx, args)
    }

    pub fn create_fungible_blueprint(
        ctx: Context<CreateFungibleBlueprint>, 
        args: CreateFungibleBlueprintArgs
    ) -> Result<()> {
        create_fungible_blueprint_handler(ctx, args)
    }

    pub fn create_recipe(ctx: Context<CreateRecipe>, args: CreateRecipeArgs) -> Result<()> {
        create_recipe_handler(ctx, args)
    }
}