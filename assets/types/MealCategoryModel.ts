/***************************************
 * ./assets/types/MealCategoryModel.ts *
 ***************************************/

import EntityWithOption from './EntityWithOption'
import RadioOption from './RadioOption'

/**
 * Type specifications for MealCategory objects returned by APIs
 */
type MealCategoryModel = EntityWithOption<RadioOption> & {
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
