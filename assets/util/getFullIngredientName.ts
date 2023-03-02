/******************************************
 * ./assets/util/getFullIngredientName.ts *
 ******************************************/

import IngredientModel from '@/types/IngredientModel'

/**
 * Given an IngredientModel, e.g. recipe.ingredients[someIndex], will return the full name of the 
 * ingredient with quantity value and quantity unit.
 * 
 * @param ingredient An IngredientModel, e.g. from a recipe.
 * @returns The full name of the ingredient with quantity value and quantity unit.
 */
const getFullIngredientName = (ingredient: IngredientModel): string => {
    let quantity: string = ingredient.quantityValue

    if (quantity && ingredient.quantityUnit) {
        quantity += ' ' + ingredient.quantityUnit
    } else if (ingredient.quantityUnit) {
        quantity += ingredient.quantityUnit
    }

    const displayName: string = (quantity ? quantity + ' ' : '') + ingredient.name
    return displayName
}

export default getFullIngredientName
