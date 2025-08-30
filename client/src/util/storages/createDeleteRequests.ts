import { Ingredient } from "@/types/api/Ingredient"
import { ApiRequest } from "@/util/ApiRequest"

export const createDeleteRequests = (ingredientsToDelete: Ingredient[]): Promise<void>[] => {
    return ingredientsToDelete.map(async (ingredient: Ingredient): Promise<void> => {
        await ApiRequest.delete(ingredient["@id"]).execute()
    })
}
