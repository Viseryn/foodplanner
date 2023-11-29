/***********************************
 * ./assets/types/SettingsModel.ts *
 ***********************************/

import UserModel from "@/types/UserModel";
import { UserGroupModel } from "@/types/UserGroupModel";
import MealCategoryModel from "@/types/MealCategoryModel";

/**
 * Type specifications for Settings objects returned by APIs
 */
type SettingsModel = {
    /** The entity id of the Settings object. */
    id: number

    /** The User object that this Settings object belongs to. */
    user: UserModel

    /** Whether the Pantry should be activated or not. */
    showPantry?: boolean

    /** The user's set standard UserGroup. */
    standardUserGroup?: UserGroupModel

    /** The user's set standard MealCategory. */
    standardMealCategory?: MealCategoryModel

    recipeListViewMode: string
}

export default SettingsModel
