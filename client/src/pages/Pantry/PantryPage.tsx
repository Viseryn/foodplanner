import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { AddIngredientField } from "@/components/ui/storage/AddIngredientField"
import { DraggableItemList } from "@/components/ui/storage/DraggableItemList"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { useScrollCache } from "@/hooks/useScrollCache"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { Detached } from "@/types/api/Detached"
import { StorageOrdering } from "@/types/api/StorageOrdering"
import { PANTRY_IRI } from "@/types/constants/PANTRY_IRI"
import { ComponentLoadingState } from "@/types/enums/ComponentLoadingState"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { StorageIngredient } from "@/types/StorageIngredient"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import { createDeleteRequests } from "@/util/storages/createDeleteRequests"
import { handleGroupIngredients } from "@/util/storages/handleGroupIngredients"
import { toIri } from "@/util/toIri"
import { ReactElement, useEffect, useState } from "react"

export const PantryPage = (): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const pantry: ManagedResourceCollection<StorageIngredient> = useNullishContext(GlobalAppDataContext).pantry

    useScrollCache("pantry")

    const [state, setState] = useState<ComponentLoadingState>(ComponentLoadingState.WAITING)
    const [sortingOrder, setSortingOrder] = useState<"ASC" | "DESC">("ASC")

    /**
     * Sorts all items by alphabet (or reverse alphabet).
     */
    const handleSort = async (): Promise<void> => {
        if (pantry.isLoading) {
            return
        }

        const modifiedList: StorageIngredient[] = [...pantry.data]
        modifiedList.sort((a, b) => {
            switch (sortingOrder) {
                case "ASC": return a.name.localeCompare(b.name)
                case "DESC": return -1 * a.name.localeCompare(b.name)
            }
        })
        modifiedList.forEach((ingredient: StorageIngredient, index: number) => {
            ingredient.position = index + 1
        })

        setSortingOrder(sortingOrder === "ASC" ? "DESC" : "ASC")

        pantry.setData(modifiedList)

        const storageOrdering: Detached<StorageOrdering> = {
            "@type": "StorageOrdering",
            ingredients: modifiedList.map(toIri)
        }

        await ApiRequest.patch<StorageOrdering>(`${PANTRY_IRI}/ordering`, storageOrdering).execute()
    }

    /**
     * Deletes all items in the storage.
     */
    const handleDeleteAll = async (): Promise<void> => {
        if (pantry.isLoading) {
            return
        }

        const swalResponse = await swal({
            dangerMode: true,
            icon: "error",
            title: "Wirklich alle Zutaten löschen?",
            buttons: ["Abbrechen", "Löschen"],
        })

        if (swalResponse) {
            setState(ComponentLoadingState.LOADING)

            const deleteRequests: Promise<void>[] = createDeleteRequests(pantry.data)
            pantry.setData([])
            await Promise.all(deleteRequests)

            setState(ComponentLoadingState.WAITING)
        }
    }

    useEffect(() => {
        sidebar.configuration
               .activeItem("pantry")
               .rebuild()

        topbar.configuration
              .title("Vorratskammer")
              .mainViewWidth("md:w-[450px]")
              .dropdownMenuItems([
                  { icon: "delete_forever", label: "Alle Zutaten löschen", onClick: handleDeleteAll }
              ])
              .rebuild()
    }, [])

    return (
        <StandardContentWrapper>
            <div className="flex justify-between items-center gap-1">
                <AddIngredientField storage={pantry} storageIri={PANTRY_IRI} roundedRight={false} />

                <Button
                    icon="sort_by_alpha"
                    role="secondary"
                    roundedLeft={false}
                    onClick={handleSort}
                    className={"h-14 w-14 flex justify-center rounded-full transition-all duration-300"}
                />
            </div>

            <Spacer height="6" />

            {pantry.isLoading || state === ComponentLoadingState.LOADING ? (
                <Spinner />
            ) : (
                <OuterCard>
                    <DraggableItemList storage={pantry} storageIri={PANTRY_IRI} mode={"DELETABLE"} />

                    {pantry.data.length > 0 &&
                        <div className="flex justify-center mt-4">
                            <Button
                                onClick={() => handleGroupIngredients(pantry, setState)}
                                label="Zutaten bündeln"
                                icon="low_priority"
                                role="tertiary"
                                isSmall={true}
                            />
                        </div>
                    }
                </OuterCard>
            )}
        </StandardContentWrapper>
    )
}
