import { Detached } from "@/types/api/Detached"
import { Ingredient } from "@/types/api/Ingredient"
import { Instruction } from "@/types/api/Instruction"
import { Recipe } from "@/types/api/Recipe"
import { SwitchValue } from "@/types/enums/SwitchValue"
import { RecipeForm } from "@/types/forms/RecipeForm"
import { createIngredient } from "@/util/ingredients/createIngredient"
import { createInstruction } from "@/util/instructions/createInstruction"

export function createRecipe(recipeForm: RecipeForm): Detached<Recipe> {
    const ingredients: Detached<Ingredient>[] = recipeForm.ingredients === ''
        ? []
        : recipeForm.ingredients
                    .split(/[\r\n]+/)
                    .filter((ingredientString: string) => !!ingredientString)
                    .map((ingredientString: string) => createIngredient(ingredientString))

    const instructions: Detached<Instruction>[] = recipeForm.instructions === ''
        ? []
        : recipeForm.instructions
                    .split(/[\r\n]+/)
                    .filter((instructionString: string) => !!instructionString)
                    .map((instructionString: string) => createInstruction(instructionString))

    return {
        ...recipeForm,
        "@type": "Recipe",
        ingredients: ingredients,
        instructions: instructions,
        image: undefined,
        sideDish: recipeForm.sideDish === SwitchValue.ON,
    }
}
