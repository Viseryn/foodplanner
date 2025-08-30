import { SidebarContext } from "@/context/SidebarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { StorageIngredient } from "@/types/StorageIngredient"
import { useEffect } from "react"

export const useShoppingListNotificationDot = (shoppingList: ManagedResourceCollection<StorageIngredient>): void => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)

    useEffect(() => {
        if (shoppingList.isLoading) {
            return
        }

        sidebar.configuration.updateNotificationDot(
            "shoppinglist",
            shoppingList.data
                        .filter(ingredient => !ingredient.checked)
                        .length,
        )
    }, [shoppingList.isLoading, shoppingList.data])
}
