import IngredientModel from '@/types/IngredientModel'

function getLastIngredientPosition(ingredients: Array<IngredientModel>): number {
    let ingredientsCopy = [...ingredients]
    ingredientsCopy.sort((a, b) => {
        if (!a.position || !b.position) {
            return 0
        }

        return a.position - b.position
    })
    return ingredientsCopy?.at(-1)?.position ?? 0
}

export default getLastIngredientPosition
