/******************************************
 * ./assets/util/getFullIngredientName.ts *
 ******************************************/

/**
 * getFullIngredientName
 * 
 * Given an Ingredient object, e.g. recipe.ingredients[someIndex],
 * will return the full name of the ingredient with quantity value and 
 * quantity unit.
 * 
 * @param ingredient An Ingredient object, e.g. from a recipe.
 * @returns The full name of the ingredient with quantity value and quantity unit.
 */
const getFullIngredientName = (ingredient: Ingredient): string => {
    let quantity: string = ingredient.quantity_value

    if (quantity && ingredient.quantity_unit) {
        quantity += ' ' + ingredient.quantity_unit
    } else if (ingredient.quantity_unit) {
        quantity += ingredient.quantity_unit
    }

    const displayName: string = (quantity ? quantity + ' ' : '') + ingredient.name

    return displayName
}

export default getFullIngredientName
