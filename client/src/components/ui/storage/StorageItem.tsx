import IconButton from "@/components/ui/Buttons/IconButton"
import { Detached } from "@/types/api/Detached"
import { Ingredient } from "@/types/api/Ingredient"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Nullish } from "@/types/Nullish"
import { StorageIngredient } from "@/types/StorageIngredient"
import { ApiRequest } from "@/util/ApiRequest"
import { byValue } from "@/util/byValue"
import { createIngredient } from "@/util/ingredients/createIngredient"
import { getFullIngredientName } from "@/util/ingredients/getFullIngredientName"
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd"
import React, { ReactElement } from "react"

type StorageItemProps = {
    dragHandleProps: Nullish<DraggableProvidedDragHandleProps>
    storage: ManagedResourceCollection<StorageIngredient>
    item: StorageIngredient
    mode: "CHECKABLE" | "DELETABLE"
}

export const StorageItem = (props: StorageItemProps): ReactElement => {
    const { dragHandleProps, storage, item, mode }: StorageItemProps = props

    if (storage.isLoading) {
        return <></>
    }

    /**
     * Checks or unchecks a `StorageIngredient` in the storage.
     * When checking, the Ingredient will receive a negative position (the lowest).
     * When unchecking, the Ingredient will receive a positive position (the highest).
     */
    const handleCheckboxChange = async (ingredient: StorageIngredient): Promise<void> => {
        if (!storage.data.includes(ingredient)) {
            return
        }

        const highestPosition: number = storage.data.map(item => item.position).filter(i => i >= 0).sort(byValue).at(-1) ?? 0
        const lowestPosition: number = storage.data.map(item => item.position).filter(i => i < 0).sort(byValue).at(0) ?? 0

        const index: number = storage.data.indexOf(ingredient)
        const ingredientCopy: StorageIngredient = storage.data[index]
        ingredientCopy.editMode = false
        ingredientCopy.checked = !ingredientCopy.checked
        ingredientCopy.position = ingredientCopy.checked ? lowestPosition - 1 : highestPosition + 1

        const modifiedList: StorageIngredient[] = [...storage.data]
        modifiedList.splice(index, 1)
        if (ingredientCopy.checked) {
            modifiedList.push(ingredientCopy)
        } else {
            modifiedList.splice(0, 0, ingredientCopy)
        }

        storage.setData(modifiedList)

        void ApiRequest.patch<StorageIngredient>(ingredientCopy["@id"], {
            checked: ingredientCopy.checked,
            position: ingredientCopy.position,
        }).execute()
    }

    /**
     * Deletes an item permanently from the storage.
     */
    const handleDeleteItem = async (item: StorageIngredient): Promise<void> => {
        const listCopy: StorageIngredient[] = [...storage.data]
        listCopy.splice(listCopy.indexOf(item), 1)

        storage.setData(listCopy)

        void ApiRequest.delete(item["@id"]).execute()
    }

    /** If set to true, the single click event handler will not be called upon a click event. */
    let preventSingleClickAction: boolean = false

    /**
     * Handles a click event on a list item. Differentiates between single and double clicks.
     */
    const handleClickOnItem = (event: React.MouseEvent, item: StorageIngredient): void => {
        if (event.detail === 2) { // This is a double click!
            handleItemSetEditability(item)
            preventSingleClickAction = true
            setTimeout(() => preventSingleClickAction = false, 200)
        } else {
            // Only do the single click action if after a short delay no double click was registered.
            // Also, do not do the single click action if the item is editable.
            setTimeout(() => {
                if (!preventSingleClickAction && !item.editMode && mode === "CHECKABLE") {
                    // Single click action
                    // void handleCheckboxChange(item)
                }
            }, 200)
        }
    }

    /**
     * Activates an item's `editMode` and deactivates it for all other list items.
     * Checked items will not activate `editMode`.
     *
     * @note Does not trigger a reload or replacement of the storage.
     */
    const handleItemSetEditability = (item: StorageIngredient): void => {
        const listCopy: StorageIngredient[] = [...storage.data]
        if (!listCopy.includes(item)) {
            return
        }

        listCopy.forEach(item => item.editMode = false)

        const itemCopy: StorageIngredient = listCopy[listCopy.indexOf(item)]
        itemCopy.editMode = itemCopy.checked ? false : !itemCopy.editMode

        storage.setData(listCopy)
    }

    /**
     * Changes the data of the given item and ends its `editMode` afterward.
     * Is called by the events `onBlur` or `onKeyDown` (when the `Enter` key was pressed).
     */
    const handleEditItem = async (
        event: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
        item: StorageIngredient,
    ): Promise<void> => {
        const inputValue: string = (event.target as HTMLInputElement)
            .value
            .replace(/(\s+)/g, " ")
            .trim()

        if (inputValue.length === 0) {
            return
        }

        const newIngredient: Detached<Ingredient> = createIngredient(inputValue)

        const listCopy: StorageIngredient[] = [...storage.data]
        const itemCopy: StorageIngredient = listCopy[listCopy.indexOf(item)]

        itemCopy.name = newIngredient.name
        itemCopy.quantityValue = newIngredient.quantityValue
        itemCopy.quantityUnit = newIngredient.quantityUnit
        itemCopy.editMode = false

        storage.setData(listCopy)

        void ApiRequest.patch<StorageIngredient>(itemCopy["@id"]).requestBody({
            name: itemCopy.name,
            quantityValue: itemCopy.quantityValue,
            quantityUnit: itemCopy.quantityUnit,
        }).execute()
    }

    return (
        <div className="flex justify-between items-center gap-4 min-h-10">
            <div className="flex items-center grow gap-4">
                {mode === "CHECKABLE" ? (
                    <input
                        id={item.id.toString()}
                        type="checkbox"
                        className="w-5 h-5 ml-2 mr-3 text-primary-100 rounded-full border-[#c3c8bb] dark:bg-[#43483e] dark:border-[#8d9286] focus:ring-primary-100 focus:ring-2 peer"
                        onChange={() => handleCheckboxChange(item)}
                        checked={item.checked}
                    />
                ) : (
                    <IconButton
                        onClick={() => handleDeleteItem(item)}
                        outlined={true}
                    >
                        delete_sweep
                    </IconButton>
                )}

                <div
                    className={"break-words grow" + (item.checked ? " line-through text-[#74796d]" : "")}
                    onClick={event => handleClickOnItem(event, item)}
                >
                    {item.editMode ? (
                        <input
                            className="bg-white border rounded-md h-10 w-full px-2"
                            defaultValue={getFullIngredientName(item)}
                            onBlur={event => handleEditItem(event, item)}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    void handleEditItem(event, item)
                                }
                            }}
                        />
                    ) : (
                        getFullIngredientName(item)
                    )}
                </div>
            </div>

            {props.dragHandleProps !== undefined && (
                <div {...dragHandleProps} className="flex gap-2">
                    <IconButton>drag_indicator</IconButton>
                </div>
            )}
        </div>
    )
}
