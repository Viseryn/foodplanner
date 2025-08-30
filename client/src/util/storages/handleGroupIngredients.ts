import { ComponentLoadingState } from "@/types/enums/ComponentLoadingState"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { StorageIngredient } from "@/types/StorageIngredient"
import { createDeleteRequests } from "@/util/storages/createDeleteRequests"
import { createPatchRequests } from "@/util/storages/createPatchRequests"
import { groupIngredients } from "@/util/storages/groupIngredients"
import React from "react"

/**
 * Sums up all `Ingredient` objects in a storage by grouping them and deleting the duplicates.
 * Sets a `ComponentLoadingState.LOADING` before and `ComponentLoadingState.WAITING` after the
 * requests have been fulfilled via the given `setStateFn`.
 *
 * Does nothing if the storage is not loaded.
 */
export const handleGroupIngredients = async (
    storage: ManagedResourceCollection<StorageIngredient>,
    setStateFn: React.Dispatch<React.SetStateAction<ComponentLoadingState>>,
): Promise<void> => {
    if (storage.isLoading) {
        return
    }

    setStateFn(ComponentLoadingState.LOADING)

    const { groupedIngredients, duplicates } = groupIngredients(storage.data)
    const patchRequests: Promise<boolean>[] = createPatchRequests(groupedIngredients, storage.data)
    const deleteRequests: Promise<void>[] = createDeleteRequests(duplicates)

    storage.setData(Array.from(groupedIngredients.values()))

    await Promise.all([...patchRequests, ...deleteRequests])

    setStateFn(ComponentLoadingState.WAITING)
}
