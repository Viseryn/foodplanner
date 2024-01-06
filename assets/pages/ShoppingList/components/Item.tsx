/***************************************************
 * ./assets/pages/ShoppingList/components/Item.tsx *
 ***************************************************/

import { tryApiRequest } from "@/util/tryApiRequest"
import axios from 'axios'
import React, { ReactElement } from 'react'

import IconButton from '@/components/ui/Buttons/IconButton'
import IngredientModel from '@/types/IngredientModel'
import getFullIngredientName from '@/util/getFullIngredientName'
import getIngredientModel from '@/util/ingredients/getIngredientModel'

/**
 * Renders an item of the ShoppingList and handles events related to that item.
 * 
 * @component
 */
export const Item = ({ shoppingList, item }: {
    shoppingList: EntityState<Array<IngredientModel>>
    item: IngredientModel
}): ReactElement => {
    /**
     * Handles a click event on a list item.
     */
    const handleClickOnItem = (event: React.MouseEvent, item: IngredientModel): void => {
        if (event.detail === 2) {
            // Double click action
            handleItemSetEditability(item)

            // When a double click is registered, the actions for a single click should be prevented.
            preventSingleClick = true

            // After a certain delay, allow registering single clicks again.
            setTimeout(() => preventSingleClick = false, 200)
        } else {
            // Only do the single click action if after a short delay no double click was registered. 
            // Also, do not do the single click action if the item is editable.
            setTimeout(() => {
                if (!preventSingleClick && !item.editable) {
                    // Single click action
                    handleCheckboxChange(item)
                }
            }, 200)
        }
    }

    let preventSingleClick: boolean = false

    /**
     * Checks or unchecks an item. Is performed on single clicks on the item or the checkboxes.
     */
    const handleCheckboxChange = async (item: IngredientModel): Promise<void> => {
        if (shoppingList.isLoading) {
            return
        }

        const copyOfShoppingList: IngredientModel[] = [...shoppingList.data]
        if (!copyOfShoppingList.includes(item)) {
            return
        }

        const index: number = copyOfShoppingList.indexOf(item)
        copyOfShoppingList[index].checked = !copyOfShoppingList[index].checked
        copyOfShoppingList[index].editable = false
        shoppingList.setData(copyOfShoppingList)

        await tryApiRequest("PATCH", `/api/ingredients/${item.id}`, async apiUrl => {
            return await axios.patch(apiUrl, { checked: copyOfShoppingList[index].checked })
        })
    }

    /**
     * Changes an item's editability. Is performed on double clicks.
     * Does not trigger a reload or replacement of the shoppingList.
     */
    const handleItemSetEditability = (item: IngredientModel): void => {
        if (shoppingList.isLoading) {
            return
        }

        const copyOfShoppingList: IngredientModel[] = [...shoppingList.data]
        if (!copyOfShoppingList.includes(item)) {
            return
        }

        const index: number = copyOfShoppingList.indexOf(item)
        copyOfShoppingList.forEach(item => item.editable = false)
        copyOfShoppingList[index].editable = copyOfShoppingList[index].checked ? false : !copyOfShoppingList[index].editable
        shoppingList.setData(copyOfShoppingList)
    }

    /**
     * Changes the data of the given item and makes it non-editable after. 
     * Is called onBlur or onKeyDown when the Enter key was pressed.
     */
    const handleEditItem = async (
        event: React.FocusEvent<HTMLInputElement, Element> | React.KeyboardEvent<HTMLInputElement>, 
        item: IngredientModel
    ): Promise<void> => {
        if (shoppingList.isLoading) {
            return
        }

        const copyOfList: IngredientModel[] = [...shoppingList.data]
        const index: number = copyOfList.indexOf(item)
        const newIngredient: string = (event.target as HTMLInputElement).value
            .replace(/(\s+)/g, ' ')
            .trim()

        if (newIngredient.length === 0) {
            return
        }

        const newIngredientModel = getIngredientModel(newIngredient, copyOfList[index].position)
        copyOfList[index].name = newIngredientModel.name
        copyOfList[index].quantityValue = newIngredientModel.quantityValue
        copyOfList[index].quantityUnit = newIngredientModel.quantityUnit
        copyOfList[index].editable = false

        shoppingList.setData(copyOfList)
        await tryApiRequest("PATCH", `/api/ingredients/${item.id}`, async apiUrl => {
            return await axios.patch(apiUrl, {
                name: copyOfList[index].name,
                quantityValue: copyOfList[index].quantityValue,
                quantityUnit: copyOfList[index].quantityUnit,
            })
        })
    }

    /**
     * Moves the given item up or down in the ShoppingList.
     * 
     * @param item A list item.
     * @param direction Possible values are -1 (up) and 1 (down).
     */
    const handleChangePosition = async (item: IngredientModel, direction: -1 | 1): Promise<void> => {
        if (shoppingList.isLoading) {
            return
        }

        // Make a copy of pantry.data and find item
        const copyOfList: IngredientModel[] = [...shoppingList.data]
        const index: number = copyOfList.indexOf(item)
        const itemCopy: IngredientModel = {...copyOfList[index]}

        // Move item up only when it is not the first item and move item down only when it is not the last item.
        if ((direction === -1 && index !== 0) || (direction === 1 && index !== shoppingList.data?.length - 1)) {
            const oldPosition: number = copyOfList[index].position!
            const newPosition: number = copyOfList[index + direction].position!

            itemCopy.position = newPosition
            copyOfList[index].position = newPosition
            copyOfList[index + direction].position = oldPosition

            copyOfList[index] = copyOfList[index + direction]
            copyOfList[index + direction] = itemCopy

            shoppingList.setData(copyOfList)

            const response: boolean = await tryApiRequest(
                "PATCH", `/api/ingredients/${copyOfList[index].id}`, async apiUrl => {
                    return await axios.patch(apiUrl, { position: copyOfList[index].position })
                }
            )

            if (response) {
                await tryApiRequest(
                    "PATCH", `/api/ingredients/${copyOfList[index + direction].id}`, async apiUrl => {
                        return await axios.patch(apiUrl, { position: copyOfList[index + direction].position })
                    }
                )
            }
        }
    }
    
    // Render Item
    return <div className="flex justify-between items-center gap-4" >
        <div className="flex items-center grow gap-4" >
            <input 
                id={item.id.toString()} 
                type="checkbox" 
                className="w-4 h-4 text-primary-100 bg-[#e0e4d6] rounded-sm border-[#c3c8bb] dark:bg-[#43483e] dark:border-[#8d9286] focus:ring-primary-100 focus:ring-2 peer"
                onChange={() => handleCheckboxChange(item)} 
                checked={item.checked}
            />

            <div 
                className={'break-words grow' + (item.checked ? ' line-through text-[#74796d]' : '')} 
                onClick={event => handleClickOnItem(event, item)}
            >
                {item.editable ? (
                    <input 
                        className="bg-white border rounded-md h-10 w-full px-2"
                        defaultValue={getFullIngredientName(item)}
                        onBlur={event => handleEditItem(event, item)}
                        onKeyDown={event => { 
                            if (event.key === 'Enter') {
                                handleEditItem(event, item)
                            }
                        }}
                    />
                ) : (
                    getFullIngredientName(item)
                )}
            </div>
        </div>

        <div className="flex gap-2">
            <IconButton onClick={() => handleChangePosition(item, -1)}>expand_less</IconButton>
            <IconButton onClick={() => handleChangePosition(item, 1)}>expand_more</IconButton>
        </div>
    </div>
}
