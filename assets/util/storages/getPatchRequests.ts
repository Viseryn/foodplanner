import axios, { AxiosResponse } from 'axios'
import IngredientModel from '@/types/IngredientModel'

export default function getPatchRequests(
    ingredientsToPatch: Map<string, IngredientModel>,
    originalIngredientList: IngredientModel[],
) {
    const patchRequests: Promise<AxiosResponse<IngredientModel>>[] = []
    ingredientsToPatch.forEach(ingredient => {
        const originalIngredient: IngredientModel | undefined
            = originalIngredientList.find(item => item.id === ingredient.id)

        if (originalIngredient && originalIngredient.quantityValue !== ingredient.quantityValue) {
            patchRequests.push(axios.patch(`/api/ingredients/${ingredient.id}`, {
                quantityValue: ingredient.quantityValue
            }))
        }
    })

    return patchRequests
}
