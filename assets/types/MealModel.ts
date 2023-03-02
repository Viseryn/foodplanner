/*******************************
 * ./assets/types/MealModel.ts *
 *******************************/

import MealCategoryModel from './MealCategoryModel'
import RecipeModel from './RecipeModel'
import UserGroupModel from './UserGroupModel'

/**
 * Type specifications for Meal objects returned by APIs
 */
type MealModel = {
    /** The entity id of the Meal object. */
    id: number

    /** The Recipe object that belongs to the Meal object. */
    recipe: RecipeModel

    /** The MealCategory object that belongs to the Meal object. */
    mealCategory: MealCategoryModel

    /** The UserGroup object that belongs to the Meal object. */
    userGroup: UserGroupModel
}

export default MealModel
