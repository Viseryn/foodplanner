/*********************************************
 * ./assets/pages/Pantry/components/Item.tsx *
 *********************************************/

import axios from 'axios'
import React from 'react'

import IconButton from '@/components/ui/Buttons/IconButton'
import IngredientModel from '@/types/IngredientModel'
import getFullIngredientName from '@/util/getFullIngredientName'

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
}): JSX.Element {
    /**
     * Handles clicks on an item of the list.
     * 
     * @param event A click event.
     * @param item A list item.
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
     * 
     * @param item A list item.
     */
    const handleItemSetEditability = (item: IngredientModel): void => {
        // Make a copy of pantry.data and find item
        let newItemList: Array<IngredientModel> = [...pantry.data]
        const index: number = newItemList.indexOf(item)

        // Make all items non-editable
        newItemList.forEach(item => {
            item.editable = false
        })

        // Change editability of argument item if it is not checked
        newItemList[index].editable = newItemList[index].checked ? false : !newItemList[index].editable
        pantry.setData(newItemList)
    }

    /**
     * Changes the data of the given item and makes it non-editable after. 
     * Is called onBlur or onKeyDown when the Enter key was pressed.
     * 
     * @param event A focus or keyboard event.
     * @param item A list item.
     */
    const handleEditItem = (
        event: React.FocusEvent<HTMLInputElement, Element> | React.KeyboardEvent<HTMLInputElement>, 
        item: IngredientModel
    ): void => {
        // Make a copy of pantry.data and find item
        let newItemList: Array<IngredientModel> = [...pantry.data]
        const index: number = newItemList.indexOf(item)

        // Return early if the value of the new item is empty
        const newItem: string = event.currentTarget.value.replace(/(\s+)/g, ' ').trim()

        if (newItem.length === 0) {
            return
        }

        // Change data of the item. Note that the change to the state is only temporary so that the 
        // edit effect is visible immediately. The item will be updated in the database via the API 
        // and the list will refresh without loading screen.
        newItemList[index].quantityUnit = ''
        newItemList[index].quantityValue = ''
        newItemList[index].name = newItem
        newItemList[index].editable = false

        // Set new list
        pantry.setData(newItemList)

        // API call
        axios.post('/api/pantry/edit-ingredient', newItemList[index])
    }

    /**
     * Checks or unchecks an item. Is performed on single clicks on the item or the checkboxes.
     * 
     * @param item A list item.
     */
    const handleDeleteItem = (item: IngredientModel): void => {
        let newItemList: Array<IngredientModel> = [...pantry.data]
        const index: number = newItemList.indexOf(item)

        // Remove item from list
        newItemList.splice(index, 1)
        pantry.setData(newItemList)
        
        // API call
        axios.delete('/api/ingredients/' + item.id)
    }

    /**
     * Moves the given item up or down in the Pantry.
     * 
     * @param item A list item.
     * @param direction Possible values are -1 (up) and 1 (down).
     */
    const handleChangePosition = (item: IngredientModel, direction: -1 | 1): void => {
        // Make a copy of pantry.data and find item
        let newItemList: Array<IngredientModel> = [...pantry.data]
        const index: number = newItemList.indexOf(item)
        const itemCopy: IngredientModel = {...newItemList[index]}

        const oldPosition: number = newItemList[index].position!
        const newPosition: number = newItemList[index + direction].position!

        // Move item up only when it is not the first item and move item down only when it is not the last item.
        if ((direction === -1 && index !== 0) || (direction === 1 && index !== pantry.data?.length - 1)) {
            itemCopy.position = newPosition
            newItemList[index].position = newPosition
            newItemList[index + direction].position = oldPosition

            newItemList[index] = newItemList[index + direction]
            newItemList[index + direction] = itemCopy

            // Set new list
            pantry.setData(newItemList)

            // API call
            axios.post('/api/pantry/change-position', [
                newItemList[index].id, 
                newItemList[index + direction].id,
            ])
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
