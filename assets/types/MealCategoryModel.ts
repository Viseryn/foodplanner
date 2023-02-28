/***************************************
 * ./assets/types/MealCategoryModel.ts *
 ***************************************/

import EntityWithRadioOption from './EntityWithRadioOption'

/**
 * Type specifications for MealCategory objects returned by APIs
 */
type MealCategoryModel = EntityWithRadioOption & {
    /** The entity id of the MealCategory object. */
    id: number

    /** The name of the MealCategory object. */
    name: string

    /** The icon of the MealCategory object. */
    icon: string

    /** Whether the MealCategory object is the standard option. */
    standard: boolean
}

export default MealCategoryModel
