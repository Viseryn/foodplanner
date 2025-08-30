import { Ingredient } from "@/types/api/Ingredient"
import { getFullIngredientName } from "@/util/ingredients/getFullIngredientName"
import { StringBuilder } from "@/util/StringBuilder"

/**
 * Given an array of Ingredients, e.g. as ingredients property of a Recipe from the Recipe API,
 * returns a string of the format "quantityValue quantityUnit ingredientName". If one or more of
 * those three are empty, the whitespaces are not added accordingly. Ingredients are separated
 * by a linebreak. The return value can be for example used as defaultValue for a textarea field.
 *
 * @param ingredients An array of ingredients, e.g. received from the Recipe API.
 * @returns A list of all ingredients, separated by linebreaks.
 */
export default function getIngredients(ingredients: Ingredient[]): string {
    return new StringBuilder()
        .forEach(ingredients, (sb, ingredient, i) => sb
            .append(getFullIngredientName(ingredient))
            .when(ingredients.length != i + 1)
            .newLine())
        .build()
}
