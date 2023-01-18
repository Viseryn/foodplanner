/******************************************
 * ./assets/util/getFullIngredientName.js *
 ******************************************/

/**
 * getFullIngredientName
 * 
 * Given an ingredient object, e.g. recipe?.ingredients?.[someIndex],
 * will return the full name of the ingredient with quantity value and 
 * quantity unit.
 * 
 * @param {object} ingredient An ingredient object, e.g. from a recipe.
 * @return {string} The full name of the ingredient with quantity value and quantity unit.
 */
const getFullIngredientName = (ingredient) => {
    let quantity = ingredient?.quantity_value

    if (quantity && ingredient?.quantity_unit) {
        quantity += ' ' + ingredient?.quantity_unit
    } else if (ingredient?.quantity_unit) {
        quantity += ingredient?.quantity_unit
    }

    const displayName = (quantity ? quantity + ' ' : '') + ingredient?.name

    return displayName
}

export default getFullIngredientName
