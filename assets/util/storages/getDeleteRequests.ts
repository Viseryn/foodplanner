import { tryApiRequest } from "@/util/tryApiRequest"
import axios from 'axios'
import IngredientModel from '@/types/IngredientModel'

export function getDeleteRequests(ingredientsToDelete: IngredientModel[]): Promise<void>[] {
    return ingredientsToDelete.map(async (ingredient: IngredientModel): Promise<void> => {
        await tryApiRequest("DELETE", `/api/ingredients/${ingredient.id}`, async (apiUrl) => {
            return await axios.delete(apiUrl)
        })
    })
}
