import IconButton from "@/components/ui/Buttons/IconButton"
import { CollapsibleCard } from "@/components/ui/Cards/CollapsibleCard"
import { InnerCard } from "@/components/ui/Cards/InnerCard"
import Spacer from "@/components/ui/Spacer"
import { StorageItem } from "@/components/ui/storage/StorageItem"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { stateCacheStore, useStateCache } from "@/hooks/useStateCache"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { StorageIngredient } from "@/types/StorageIngredient"
import { createDeleteRequests } from "@/util/storages/createDeleteRequests"
import React, { ReactElement, useCallback } from "react"

/**
 * @note Checked shopping list items have negative positions. By ordering of the shopping list, a checked item is higher in the list if its absolute
 *       value is closer to zero.
 */
export const CheckedItemList = (): ReactElement => {
    const shoppingList: ManagedResourceCollection<StorageIngredient> = useNullishContext(GlobalAppDataContext).shoppingList
    const checkedItemListCollapsed: boolean = useStateCache(state => state.shoppingListCheckedItemListCollapsed)
    const toggleCheckedItemListCollapsed = useCallback((): void => {
        stateCacheStore.getState().toggle("shoppingListCheckedItemListCollapsed")
    }, [])

    if (shoppingList.isLoading) {
        return <></>
    }

    const handleDeleteChecked = async (): Promise<void> => {
        const checkedItems: StorageIngredient[] = [...shoppingList.data].filter(item => item.checked)
        const uncheckedItems: StorageIngredient[] = [...shoppingList.data].filter(item => !item.checked)

        shoppingList.setData(uncheckedItems)

        const deleteRequests: Promise<void>[] = createDeleteRequests(checkedItems)
        await Promise.all(deleteRequests)
    }

    return (
        <>
            <Spacer height="4" />

            <CollapsibleCard
                cardComponent={InnerCard}
                collapsed={checkedItemListCollapsed}
                onCollapse={toggleCheckedItemListCollapsed}
                heading={(
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-md">
                            Erledigte
                            <div className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-secondary-200 dark:bg-secondary-dark-200 rounded-full font-bold text-xs dark:text-white">
                                {shoppingList.data.filter(ingredient => ingredient.checked).length}
                            </div>
                        </div>
                        <IconButton onClick={handleDeleteChecked}>
                            remove_done
                        </IconButton>
                    </div>
                )}
            >
                {shoppingList.data.filter(ingredient => ingredient.checked).map(item =>
                    <StorageItem
                        key={item.id}
                        item={item}
                        dragHandleProps={undefined}
                        mode={"CHECKABLE"}
                        storage={shoppingList}
                    />
                )}
            </CollapsibleCard>
        </>
    )
}
