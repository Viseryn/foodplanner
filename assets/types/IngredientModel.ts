/**************************************
 * ./assets/types/IngredientModel.ts *
 **************************************/

import RecipeModel from './RecipeModel'

/**
 * Type specifications for Ingredient objects returned by APIs
 */
type IngredientModel = {
    /** The entity id of the Ingredient object. */
    id: number

    /** The name of the Ingredient object. */
    name: string

    /** The quantity value of the Ingredient object. */
    quantityValue: string

    /** The quantity unit of the Ingredient object. */
    quantityUnit: string

    /** The position of the Ingredient object in a storage. */
    position?: number

    /** Whether the Ingredient object is checked. */
    checked?: boolean

    /** Whether the Ingredient object is editable. */
    editable?: boolean
}

export default IngredientModel
