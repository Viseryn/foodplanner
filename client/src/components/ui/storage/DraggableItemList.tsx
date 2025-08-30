import { InnerCard } from "@/components/ui/Cards/InnerCard"
import { EmptyStorageInfo } from "@/components/ui/storage/EmptyStorageInfo"
import { StorageItem } from "@/components/ui/storage/StorageItem"
import { Detached } from "@/types/api/Detached"
import { StorageOrdering } from "@/types/api/StorageOrdering"
import { PANTRY_IRI } from "@/types/constants/PANTRY_IRI"
import { SHOPPINGLIST_IRI } from "@/types/constants/SHOPPINGLIST_IRI"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { StorageIngredient } from "@/types/StorageIngredient"
import { ApiRequest } from "@/util/ApiRequest"
import { StringBuilder } from "@/util/StringBuilder"
import { swap } from "@/util/swap"
import { toIri } from "@/util/toIri"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { ReactElement } from "react"

type DraggableItemListProps = {
    storage: ManagedResourceCollection<StorageIngredient>
    storageIri: typeof SHOPPINGLIST_IRI | typeof PANTRY_IRI
    mode: "CHECKABLE" | "DELETABLE"
}

export const DraggableItemList = (props: DraggableItemListProps): ReactElement => {
    const { storage, storageIri, mode }: DraggableItemListProps = props

    if (storage.isLoading) {
        return <></>
    }

    const handleDragEnd = async (dropResult: DropResult): Promise<void> => {
        if (!dropResult.destination) {
            return
        }

        const swappedList: StorageIngredient[] = swap(storage.data, dropResult.source.index, dropResult.destination.index)

        storage.setData(swappedList)

        const storageOrdering: Detached<StorageOrdering> = {
            "@type": "StorageOrdering",
            ingredients: swappedList.map(toIri),
        }

        void ApiRequest.patch<StorageOrdering>(`${storageIri}/ordering`, storageOrdering).execute()
    }

    return (
        <InnerCard>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={"droppable"}>
                    {provided => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={"space-y-2"}>
                            {storage.data.filter(ingredient => !ingredient.checked).length === 0 &&
                                <EmptyStorageInfo />
                            }

                            {storage.data.filter(ingredient => !ingredient.checked).map((ingredient, index) => (
                                <Draggable key={ingredient.id} draggableId={ingredient.id.toString()} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={StringBuilder.cn([snapshot.isDragging, "bg-secondary-200/40 dark:bg-secondary-dark-200/40 rounded-xl"])}
                                        >
                                            <StorageItem
                                                dragHandleProps={provided.dragHandleProps}
                                                item={ingredient}
                                                mode={mode}
                                                storage={storage}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </InnerCard>
    )
}
