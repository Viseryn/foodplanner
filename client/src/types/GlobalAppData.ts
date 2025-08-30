import { Meal } from "@/types/api/Meal"
import { MealCategory } from "@/types/api/MealCategory"
import { Recipe } from "@/types/api/Recipe"
import { UserGroup } from "@/types/api/UserGroup"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { StorageIngredient } from "@/types/StorageIngredient"

export type GlobalAppData = {
    meals: ManagedResourceCollection<Meal>
    recipes: ManagedResourceCollection<Recipe>
    shoppingList: ManagedResourceCollection<StorageIngredient>
    pantry: ManagedResourceCollection<StorageIngredient>
    mealCategories: ManagedResourceCollection<MealCategory>
    userGroups: ManagedResourceCollection<UserGroup>
    visibleUserGroups: ManagedResourceCollection<UserGroup>
}
