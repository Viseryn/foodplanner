import { ApiResource } from "@/types/api/ApiResource"
import { Iri } from "@/types/api/Iri"
import { MealCategory } from "@/types/api/MealCategory"
import { Recipe } from "@/types/api/Recipe"
import { UserGroup } from "@/types/api/UserGroup"

/**
 * This type mirrors the ApiResource `Meal`.
 *
 * @see api/src/Entity/Meal.php
 */
export type Meal = ApiResource & {
    "@type": "Meal"
    id: number
    recipe: Iri<Recipe>
    mealCategory: Iri<MealCategory>
    userGroup: Iri<UserGroup>
    date: string
}
