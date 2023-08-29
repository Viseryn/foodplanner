import IngredientModel from '@/types/IngredientModel'
import getFullIngredientName from '@/util/getFullIngredientName'

/**
 * Given an array of Ingredients, e.g. as ingredients property of a Recipe from the Recipe API,
 * returns a string of the format "quantityValue quantityUnit ingredientName". If one or more of
 * those three are empty, the whitespaces are not added accordingly. Ingredients are separated
 * by a linebreak. The return value can be for example used as defaultValue for a textarea field.
 *
 * @param arr An array of ingredients, e.g. received from the Recipe API.
 * @returns A list of all ingredients, separated by linebreaks.
 */
export default function getIngredients(arr: IngredientModel[]): string {
    let ingredients: string = ''
    let l: number = arr?.length

    arr?.map((ingredient, i) => {
        ingredients += getFullIngredientName(ingredient)

        if (l != i + 1) {
            ingredients += "\r\n"
        }
    })

    return ingredients
}
