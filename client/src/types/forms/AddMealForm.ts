import { Iri } from "@/types/api/Iri"
import { MealCategory } from "@/types/api/MealCategory"
import { Recipe } from "@/types/api/Recipe"
import { UserGroup } from "@/types/api/UserGroup"
import { DateKey } from "@/types/DateKey"
import { Form } from "@/types/forms/Form"

export type AddMealForm = Form & {
    date: DateKey
    mealCategory: Iri<MealCategory>
    userGroup: Iri<UserGroup>
    recipe: Iri<Recipe>
    sideDishes: Iri<Recipe>[]
}
