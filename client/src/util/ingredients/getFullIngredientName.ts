import { Ingredient } from "@/types/api/Ingredient"
import { StringBuilder } from "@/util/StringBuilder"

/**
 * @returns The full name of the ingredient with quantity value and quantity unit.
 */
export const getFullIngredientName = (ingredient: Ingredient): string => {
    return new StringBuilder()
        .append(ingredient.quantityValue)
        .append(ingredient.quantityUnit)
        .append(ingredient.name)
        .build(" ")
}
