/*********************************
 * ./assets/types/RecipeModel.ts *
 *********************************/

import EntityWithSelectOption from './EntityWithSelectOption'
import FileModel from './FileModel'
import IngredientModel from './IngredientModel'
import InstructionModel from './InstructionModel'

/**
 * Type specifications for Recipe objects returned by APIs
 */
type RecipeModel = EntityWithSelectOption & {
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
    image: FileModel
}

export default RecipeModel
