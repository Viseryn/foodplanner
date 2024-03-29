/*********************************
 * ./assets/types/RecipeModel.ts *
 *********************************/

import IngredientModel from './IngredientModel'
import InstructionModel from './InstructionModel'
import ImageModel from './ImageModel'

/**
 * Type specifications for Recipe objects returned by APIs
 */
type RecipeModel = {
    /** The entity id of the Recipe object. */
    id: number

    /** The title of the Recipe object. */
    title: string

    /** The portion size of the Recipe object. */
    portionSize: number

    /** The array of Ingredient objects belonging to the Recipe object. */
    ingredients: Array<IngredientModel>

    /** The array of Instruction objects belonging to the Recipe object. */
    instructions: Array<InstructionModel>

    /** The Image object belonging to the Recipe object. */
    image?: ImageModel
}

export default RecipeModel
