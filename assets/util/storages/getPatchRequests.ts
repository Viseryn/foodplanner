import IngredientModel from '@/types/IngredientModel'
import { Optional } from "@/types/Optional"
import { tryApiRequest } from "@/util/tryApiRequest"
import axios from 'axios'

export function getPatchRequests(
    ingredientsToPatch: Map<string, IngredientModel>,
    originalIngredientList: IngredientModel[],
): Promise<boolean>[] {
    const patchRequests: Promise<boolean>[] = []

    ingredientsToPatch.forEach(ingredient => {
        const originalIngredient: Optional<IngredientModel> = originalIngredientList.find(item => item.id === ingredient.id)

        if (originalIngredient && originalIngredient.quantityValue !== ingredient.quantityValue) {
            patchRequests.push(axios.patch(`/api/ingredients/${ingredient.id}`, {
                quantityValue: ingredient.quantityValue
            }))

            patchRequests.push(
                tryApiRequest("PATCH", `/api/ingredients/${ingredient.id}`, async (apiUrl) => {
                    return await axios.patch(apiUrl, { quantityValue: ingredient.quantityValue })
                })
            )
        }
    })

    return patchRequests
}
