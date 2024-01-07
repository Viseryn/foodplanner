import IngredientModel from '@/types/IngredientModel'
import Fraction from 'fraction.js'

type IngredientGroups = {
    groupedIngredients: Map<string, IngredientModel>
    ingredientsToDelete: IngredientModel[]
}

export function getIngredientGroups(ingredientList: IngredientModel[]): IngredientGroups {
    const groupedIngredients: Map<string, IngredientModel> = new Map<string, IngredientModel>()
    const ingredientsToDelete: IngredientModel[] = []

    ingredientList.forEach((ingredient: IngredientModel) => {
        const key: string = `${ingredient.name}|${ingredient.quantityUnit}`

        if (groupedIngredients.has(key)) {
            ingredientsToDelete.push(ingredient)
            const existingIngredient: IngredientModel = groupedIngredients.get(key)!

            const currentValue: Fraction = new Fraction(existingIngredient.quantityValue === '' ? 0 : existingIngredient.quantityValue)
            const incomingValue: Fraction = new Fraction(ingredient.quantityValue === '' ? 0 : ingredient.quantityValue)
            const totalValue: Fraction = currentValue.add(incomingValue)

            existingIngredient.quantityValue = totalValue.toFraction(true)
        } else {
            groupedIngredients.set(key, { ...ingredient })
        }
    })

    return { groupedIngredients, ingredientsToDelete }
}
