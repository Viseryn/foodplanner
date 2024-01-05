import IngredientModel from '@/types/IngredientModel'
import getIngredientModel from '@/util/ingredients/getIngredientModel'
import InstructionModel from '@/types/InstructionModel'
import getInstructionModel from '@/util/instructions/getInstructionModel'
import RecipeModel from '@/types/RecipeModel'
import { RecipeForm } from '@/types/RecipeForm'

export default function getRecipeModel(recipeForm: RecipeForm): RecipeModel {
    const ingredients: IngredientModel[] = recipeForm.ingredients === ''
        ? []
        : recipeForm.ingredients
            .split(/[\r\n]+/)
            .map((ingredientString: string) => getIngredientModel(ingredientString, 0))

    const instructions: InstructionModel[] = recipeForm.instructions === ''
        ? []
        : recipeForm.instructions
            .split(/[\r\n]+/)
            .map((instructionString: string) => getInstructionModel(instructionString))

    return {
        ...recipeForm,
        id: -1,
        ingredients: ingredients,
        instructions: instructions,
        image: undefined,
    }
}
