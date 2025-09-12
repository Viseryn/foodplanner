import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { AddIngredientField } from "@/components/ui/storage/AddIngredientField"
import { DraggableItemList } from "@/components/ui/storage/DraggableItemList"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SettingsContext } from "@/context/SettingsContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { useScrollCache } from "@/hooks/useScrollCache"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { CheckedItemList } from "@/pages/ShoppingList/components/CheckedItemList"
import { Settings } from "@/types/api/Settings"
import { SHOPPINGLIST_IRI } from "@/types/constants/SHOPPINGLIST_IRI"
import { ComponentLoadingState } from "@/types/enums/ComponentLoadingState"
import { ManagedResource } from "@/types/ManagedResource"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { StorageIngredient } from "@/types/StorageIngredient"
import { Topbar } from "@/types/topbar/Topbar"
import { createDeleteRequests } from "@/util/storages/createDeleteRequests"
import { createPatchRequests } from "@/util/storages/createPatchRequests"
import { groupIngredients } from "@/util/storages/groupIngredients"
import { handleGroupIngredients } from "@/util/storages/handleGroupIngredients"
import { parseQuantityValue } from "@/util/storages/parseQuantityValue"
import Fraction from "fraction.js"
import { ReactElement, useEffect, useState } from "react"

export const ShoppingListPage = (): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const { shoppingList, pantry } = useNullishContext(GlobalAppDataContext)
    const settings: ManagedResource<Settings> = useNullishContext(SettingsContext)

    useScrollCache("shoppinglist")

    const [state, setState] = useState<ComponentLoadingState>(ComponentLoadingState.WAITING)

    /**
     * Sums up all `Ingredient` objects in the shopping list by grouping them and deleting the duplicates,
     * and subtracts all pantry ingredients that match. If the `quantityValue` of an `Ingredient` is less
     * or equal to `0`, it will be removed from the shopping list as well.
     *
     * The shopping list will be in a loading state while not all requests are fulfilled. Does nothing if
     * any of the shopping list or pantry are not loaded.
     */
    const handleSubtractPantry = async (): Promise<void> => {
        if (shoppingList.isLoading || pantry.isLoading) {
            return
        }

        setState(ComponentLoadingState.LOADING)

        const { groupedIngredients, duplicates } = groupIngredients(shoppingList.data)

        // Collect relevant pantry ingredients and negate quantityValues
        const relevantPantryIngredients: StorageIngredient[] =
            pantry
                .data
                .filter(pantryIngredient => shoppingList.data.map(ingredient => ingredient.name).includes(pantryIngredient.name))
                .map(pantryIngredient => ({
                    ...pantryIngredient,
                    quantityValue: (pantryIngredient.quantityValue === "") ? "-1" : `-${pantryIngredient.quantityValue}`,
                }))

        // Subtract pantry ingredients
        relevantPantryIngredients.forEach(pantryIngredient => {
            const key: string = `${pantryIngredient.name}|${pantryIngredient.quantityUnit}`

            if (groupedIngredients.has(key)) {
                const existingIngredient: StorageIngredient = groupedIngredients.get(key)!

                const currentValue: Fraction = new Fraction(parseQuantityValue(existingIngredient))
                const incomingValue: Fraction = new Fraction(parseQuantityValue(pantryIngredient))
                const totalValue: Fraction = currentValue.add(incomingValue)

                existingIngredient.quantityValue = totalValue.toFraction(true)

                if (totalValue.valueOf() <= 0) {
                    groupedIngredients.delete(key)
                    duplicates.push(existingIngredient)
                }
            }
        })

        const patchRequests: Promise<boolean>[] = createPatchRequests(groupedIngredients, shoppingList.data)
        const deleteRequests: Promise<void>[] = createDeleteRequests(duplicates)

        shoppingList.setData(Array.from(groupedIngredients.values()))

        await Promise.all([...patchRequests, ...deleteRequests])

        setState(ComponentLoadingState.WAITING)
    }

    useEffect(() => {
        sidebar.configuration
               .activeItem("shoppinglist")
               .rebuild()

        topbar.configuration
              .title("Einkaufsliste")
              .mainViewWidth("md:w-[450px]")
              .rebuild()
    }, [])

    return (
        <StandardContentWrapper>
            <AddIngredientField storage={shoppingList} storageIri={SHOPPINGLIST_IRI} />

            <Spacer height="6" />
            {shoppingList.isLoading || state === ComponentLoadingState.LOADING ? (
                <Spinner />
            ) : (
                <OuterCard>

                    <DraggableItemList storage={shoppingList} storageIri={SHOPPINGLIST_IRI} mode={"CHECKABLE"} />

                    {shoppingList.data.length >= 1 && (
                        <div className="flex flex-row items-stretch justify-center gap-1 mt-4">
                            <div className={"flex-1 flex justify-end"}>
                                {settings.data?.showPantry && !pantry.isLoading && pantry.data.length > 0 &&
                                    <Button
                                        onClick={handleSubtractPantry}
                                        label="Vorräte verrechnen"
                                        icon="cell_merge"
                                        role="secondary"
                                        roundedRight={false}
                                    />
                                }
                            </div>
                            <div className={"flex-1 flex justify-start"}>
                                <Button
                                    onClick={() => handleGroupIngredients(shoppingList, setState)}
                                    icon="low_priority"
                                    label="Zutaten bündeln"
                                    role="secondary"
                                    isIconRight={true}
                                    roundedLeft={!settings.data?.showPantry}
                                />
                            </div>
                        </div>
                    )}

                    {shoppingList.data.filter(ingredient => ingredient.checked).length > 0 && (
                        <CheckedItemList />
                    )}
                </OuterCard>
            )}
        </StandardContentWrapper>
    )
}
