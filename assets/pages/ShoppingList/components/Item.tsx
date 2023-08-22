/***************************************************
 * ./assets/pages/ShoppingList/components/Item.tsx *
 ***************************************************/

import axios from 'axios'
import React from 'react'

import IconButton from '@/components/ui/Buttons/IconButton'
import IngredientModel from '@/types/IngredientModel'
import getFullIngredientName from '@/util/getFullIngredientName'

/**
 * Renders an item of the ShoppingList and handles events related to that item.
 * 
 * @component
 */
export default function Item({ shoppingList, item }: {
    shoppingList: EntityState<Array<IngredientModel>>
    item: IngredientModel
}): JSX.Element {
    /**
     * Handles a click event on a list item.
     * 
     * @param event A mouse event.
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
                    handleCheckboxChange(item)
                }
            }, 200)
        }
    }

    let preventSingleClick: boolean = false

    /**
     * Checks or unchecks an item. Is performed on single clicks on the item or the checkboxes.
     * 
     * @param item A list item.
     */
    const handleCheckboxChange = (item: IngredientModel): void => {
        // Make a copy of shoppingList.data and find item
        let newItemList: Array<IngredientModel> = [...shoppingList.data]
        const index: number = newItemList.indexOf(item)

        // Check or uncheck the item and make it non-editable
        newItemList[index].checked = !newItemList[index].checked
        newItemList[index].editable = false
        shoppingList.setData(newItemList)
        
        // API call
        axios.patch('/api/ingredients/' + item.id, {
            checked: newItemList[index].checked
        })
    }

    /**
     * Changes an item's editability. Is performed on double clicks.
     * Does not trigger a reload or replacement of the shoppingList.
     * 
     * @param item A list item.
     */
    const handleItemSetEditability = (item: IngredientModel): void => {
        // Make a copy of shoppingList.data and find item
        let newItemList: Array<IngredientModel> = [...shoppingList.data]
        const index: number = newItemList.indexOf(item)

        // Make all items non-editable
        newItemList.forEach(item => {
            item.editable = false
        })

        // Change editability of argument item if it is not checked
        newItemList[index].editable = newItemList[index].checked ? false : !newItemList[index].editable
        shoppingList.setData(newItemList)
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
        // Make a copy of shoppingList.data and find item
        let newItemList: Array<IngredientModel> = [...shoppingList.data]
        const index: number = newItemList.indexOf(item)

        // Return early if the value of the new item is empty
        const newItem: string = (event.target as HTMLInputElement).value.replace(/(\s+)/g, ' ').trim()

        if (newItem.length === 0) {
            return
        }

        // Change data of the item. Note that the change to the state is only temporary so that the 
        // edit effect is visible immediately. The item will be updated in the database via the API and 
        // the list will refresh without loading screen.
        newItemList[index].quantityUnit = ''
        newItemList[index].quantityValue = ''
        newItemList[index].name = newItem
        newItemList[index].editable = false

        // Set new list
        shoppingList.setData(newItemList)

        // API call
        // axios.post('/api/shoppinglist/edit-ingredient', newItemList[index])
        axios.patch('/api/ingredients/' + item.id, {
            name: newItem,
            quantityUnit: '', // TODO: Compute this on the client side
            quantityValue: '',
        })
    }

    /**
     * Moves the given item up or down in the ShoppingList.
     * 
     * @param item A list item.
     * @param direction Possible values are -1 (up) and 1 (down).
     */
    const handleChangePosition = (item: IngredientModel, direction: -1 | 1): void => {
        // Make a copy of shoppingList.data and find item
        let newItemList: Array<IngredientModel> = [...shoppingList.data]
        const index: number = newItemList.indexOf(item)
        const itemCopy: IngredientModel = {...newItemList[index]}

        const oldPosition: number = newItemList[index].position!
        const newPosition: number = newItemList[index + direction].position!

        // Move item up only when it is not the first item and move item down only when it is not the last item.
        if (
            (direction === -1 && index !== 0)
            || (direction === 1 && index !== shoppingList.data!.length - 1)
        ) {
            itemCopy.position = newPosition
            newItemList[index].position = newPosition
            newItemList[index + direction].position = oldPosition

            newItemList[index] = newItemList[index + direction]
            newItemList[index + direction] = itemCopy

            // Set new list
            shoppingList.setData(newItemList)

            // API call
            // axios.post('/api/shoppinglist/change-position', [
            //     newItemList[index].id,
            //     newItemList[index + direction].id,
            // ])
            axios.patch('/api/ingredients/' + newItemList[index].id, { position: newItemList[index].position })
            axios.patch('/api/ingredients/' + newItemList[index + direction].id, { position: newItemList[index + direction].position })
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
