import { Maybe } from "@/types/Maybe"
import { StorageIngredient } from "@/types/StorageIngredient"
import { ApiRequest } from "@/util/ApiRequest"

export function createPatchRequests(
    ingredientsToPatch: Map<string, StorageIngredient>,
    originalIngredientList: StorageIngredient[],
): Promise<boolean>[] {
    const patchRequests: Promise<boolean>[] = []

    ingredientsToPatch.forEach(ingredient => {
        const originalIngredient: Maybe<StorageIngredient> = originalIngredientList.find(item => item.id === ingredient.id)

        if (originalIngredient && originalIngredient.quantityValue !== ingredient.quantityValue) {
            patchRequests.push(
                ApiRequest.patch<StorageIngredient>(ingredient["@id"], { quantityValue: ingredient.quantityValue }).execute()
            )
        }
    })

    return patchRequests
}
