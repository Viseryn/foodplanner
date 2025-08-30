import { StorageIngredient } from "@/types/StorageIngredient"
import { parseQuantityValue } from "@/util/storages/parseQuantityValue"
import Fraction from "fraction.js"

type IngredientGroups = {
    groupedIngredients: Map<string, StorageIngredient>
    duplicates: StorageIngredient[]
}

/**
 * Groups all `Ingredient` objects in the given list by `name` and `quantityUnit` and aggregates their `quantityValue`.
 * All duplicate objects that are no longer needed will be collected in the `duplicates` return property.
 */
export const groupIngredients = (ingredientList: StorageIngredient[]): IngredientGroups => {
    const groupedIngredients: Map<string, StorageIngredient> = new Map<string, StorageIngredient>()
    const duplicates: StorageIngredient[] = []

    ingredientList.forEach((ingredient: StorageIngredient) => {
        const key: string = `${ingredient.name}|${ingredient.quantityUnit}`

        if (!groupedIngredients.has(key)) {
            groupedIngredients.set(key, { ...ingredient })
        } else {
            duplicates.push(ingredient)
            const existingIngredient: StorageIngredient = groupedIngredients.get(key)!

            const currentValue: Fraction = new Fraction(parseQuantityValue(existingIngredient))
            const incomingValue: Fraction = new Fraction(parseQuantityValue(ingredient))
            const totalValue: Fraction = currentValue.add(incomingValue)

            existingIngredient.quantityValue = totalValue.toFraction(true)
        }
    })

    return { groupedIngredients, duplicates }
}
