/******************************
 * ./assets/types/DayModel.ts *
 ******************************/

import EntityWithSelectOption from './EntityWithSelectOption'
import MealModel from './MealModel'

/**
 * Type specifications for Day objects returned by APIs
 */
type DayModel = EntityWithSelectOption & {
    /** The entity id of the Day object. */
    id: number

    /** The timestamp of the Day object. */
    timestamp: number

    /** The (German) weekday of the Day object. */
    weekday: string

    /** The date of the Day object in the format 'dd.mm.yyyy'. */
    date: string

    /** The array of Meal objects belonging to the Day object. */
    meals: Array<MealModel>
}

export default DayModel
