use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;

pub use instructions::*;

declare_id!("C7JFdGAV8HeTnv5zRFfKAXh2vCrUeuZWZeqekrX1RnAf");

#[program]
pub mod itembox {
    use super::*;

    pub fn init(ctx: Context<Init>, args: InitArgs) -> Result<()> {
        init_handler(ctx, args)
    }

    pub fn create_blueprint(ctx: Context<CreateBlueprint>, args: CreateBlueprintArgs) -> Result<()> {
        create_blueprint_handler(ctx, args)
    }

    pub fn create_recipe(ctx: Context<CreateRecipe>, args: CreateRecipeArgs) -> Result<()> {
        create_recipe_handler(ctx, args)
    }
}