import { ViewMode } from "@/pages/Recipes/types/ViewMode"
import { ApiResource } from "@/types/api/ApiResource"
import { Iri } from "@/types/api/Iri"
import { MealCategory } from "@/types/api/MealCategory"
import { UserGroup } from "@/types/api/UserGroup"
import { Homepage } from "@/types/enums/Homepage"

/**
 * This type mirrors the ApiResource `Settings`.
 *
 * @see api/src/Entity/Settings.php
 */
export type Settings = ApiResource & {
    "@type": "Settings"
    showPantry?: boolean
    standardUserGroup?: Iri<UserGroup>
    standardMealCategory?: Iri<MealCategory>
    recipeListViewMode: ViewMode
    homepage?: Homepage
}
