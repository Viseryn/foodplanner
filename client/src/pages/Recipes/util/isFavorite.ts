import { Recipe } from "@/types/api/Recipe"
import { User } from "@/types/api/User"

export const isFavorite = (recipe: Recipe, user: User) => {
    return user.recipeFavorites.includes(recipe["@id"])
}
