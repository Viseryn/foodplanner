/*********************************************
 * ./assets/pages/Pantry/components/Item.tsx *
 *********************************************/

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
 * @param {object} props
 * @param {object} props.pantry The pantry state variable.
 * @param {object} props.item An Ingredient object from the pantry.
 */
export default function Item({ pantry, item }: {
    pantry: EntityState<Array<IngredientModel>>
    item: IngredientModel
}): ReactElement {
    /**
     * Handles clicks on an item of the list.
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
                }
            }, 200)
        }
    }

    let preventSingleClick: boolean = false

    /**
     * Changes an item's editability. Is performed on double clicks. 
     * Does not trigger a reload or replacement of the pantry.
     */
    const handleItemSetEditability = (item: IngredientModel): void => {
        if (pantry.isLoading) {
            return
        }

        const copyOfPantry: IngredientModel[] = [...pantry.data]
        if (!copyOfPantry.includes(item)) {
            return
        }

        const index: number = copyOfPantry.indexOf(item)
        copyOfPantry.forEach(item => item.editable = false)
        copyOfPantry[index].editable = copyOfPantry[index].checked ? false : !copyOfPantry[index].editable
        pantry.setData(copyOfPantry)
    }

    /**
     * Changes the data of the given item and makes it non-editable after. 
     * Is called onBlur or onKeyDown when the Enter key was pressed.
     */
    const handleEditItem = async (
        event: React.FocusEvent<HTMLInputElement, Element> | React.KeyboardEvent<HTMLInputElement>, 
        item: IngredientModel
    ): Promise<void> => {
        if (pantry.isLoading) {
            return
        }

        const copyOfList: IngredientModel[] = [...pantry.data]
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

        pantry.setData(copyOfList)
        await axios.patch(`/api/ingredients/${item.id}`, {
            name: copyOfList[index].name,
            quantityValue: copyOfList[index].quantityValue,
            quantityUnit: copyOfList[index].quantityUnit,
        })
    }

    /**
     * Deletes an item.
     */
    const handleDeleteItem = async (item: IngredientModel): Promise<void> => {
        if (pantry.isLoading) {
            return
        }

        const copyOfList: IngredientModel[] = [...pantry.data]
        const index: number = copyOfList.indexOf(item)

        copyOfList.splice(index, 1)
        pantry.setData(copyOfList)
        
        await axios.delete(`/api/ingredients/${item.id}`)
    }

    /**
     * Moves the given item up or down in the Pantry.
     *
     * @param item A list item.
     * @param direction Possible values are -1 (up) and 1 (down).
     */
    const handleChangePosition = async (item: IngredientModel, direction: -1 | 1): Promise<void> => {
        if (pantry.isLoading) {
            return
        }

        // Make a copy of pantry.data and find item
        const copyOfList: IngredientModel[] = [...pantry.data]
        const index: number = copyOfList.indexOf(item)
        const itemCopy: IngredientModel = {...copyOfList[index]}

        const oldPosition: number = copyOfList[index].position!
        const newPosition: number = copyOfList[index + direction].position!

        // Move item up only when it is not the first item and move item down only when it is not the last item.
        if ((direction === -1 && index !== 0) || (direction === 1 && index !== pantry.data?.length - 1)) {
            itemCopy.position = newPosition
            copyOfList[index].position = newPosition
            copyOfList[index + direction].position = oldPosition

            copyOfList[index] = copyOfList[index + direction]
            copyOfList[index + direction] = itemCopy

            pantry.setData(copyOfList)

            await axios.patch('/api/ingredients/' + copyOfList[index].id, { position: copyOfList[index].position })
            await axios.patch('/api/ingredients/' + copyOfList[index + direction].id, { position: copyOfList[index + direction].position })
        }
    }
    
    // Render Item
    return <div className="flex justify-between items-center gap-4" >
        <div className="flex items-center grow gap-4" >
            <div className="mr-2">
                <IconButton 
                    onClick={() => handleDeleteItem(item)} 
                    outlined={true}
                >
                    delete_sweep
                </IconButton>
            </div>

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
                                handleEditItem(event, item);
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
