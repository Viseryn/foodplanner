/**************************************************
 * ./assets/pages/ShoppingList/components/Item.js *
 **************************************************/

import React                    from 'react'
import axios                    from 'axios'

import IconButton               from '../../../components/ui/Buttons/IconButton'
import getFullIngredientName    from '../../../util/getFullIngredientName'

/**
 * Item
 * 
 * Renders an item of the ShoppingList and 
 * handles events related to that item.
 * 
 * @component
 * @param {object} props
 * @param {object} props.item
 */
export default function Item({ shoppingList, item }) {
    /**
     * handleClickOnItem
     * 
     * Handles clicks on an item of the list.
     * 
     * @param {any} event
     * @param {object} item A list item.
     */
    const handleClickOnItem = (event, item) => {
        if (event.detail === 2) {
            // Double click action
            handleItemSetEditability(item)

            // When a double click is registered, the 
            // actions for a single click should be prevented.
            preventSingleClick = true

            // After a certain delay, allow registering single clicks again.
            setTimeout(() => preventSingleClick = false, 200)
        } else {
            // Only do the single click action if after a short 
            // delay no double click was registered. Also, do not 
            // do the single click action if the item is editable.
            setTimeout(() => {
                if (!preventSingleClick && !item.editable) {
                    // Single click action
                    handleCheckboxChange(item)
                }
            }, 200)
        }
    }

    let preventSingleClick = false

    /**
     * handleCheckboxChange
     * 
     * Checks or unchecks an item. Is performed on single clicks 
     * on the item or the checkboxes.
     * 
     * @param {object} item A list item.
     */
    const handleCheckboxChange = (item) => {
        // Make a copy of shoppingList.data and find item
        let newItemList = [...shoppingList.data]
        const index = newItemList.indexOf(item)

        // Check or uncheck the item and make it non-editable
        newItemList[index].checked = !newItemList[index].checked
        newItemList[index].editable = false
        shoppingList.setData(newItemList)
        
        // API call
        axios.post('/api/shoppinglist/check-ingredient', item.id)
    }

    /**
     * handleItemSetEditability
     * 
     * Changes an item's editability. Is performed on double clicks.
     * Does not trigger a reload or replacement of the shoppingList.
     * 
     * @param {object} item A list item.
     */
    const handleItemSetEditability = (item) => {
        // Make a copy of shoppingList.data and find item
        let newItemList = [...shoppingList.data]
        const index = newItemList.indexOf(item)

        // Make all items non-editable
        newItemList.forEach(item => {
            item.editable = false
        })

        // Change editability of argument item if it is not checked
        newItemList[index].editable = newItemList[index].checked ? false : !newItemList[index].editable
        shoppingList.setData(newItemList)
    }

    /**
     * handleEditItem
     * 
     * Changes the data of the given item and makes
     * it non-editable after. Is called onBlur or 
     * onKeyDown when the Enter key was pressed.
     * 
     * @param {any} event
     * @param {object} item A list item.
     */
    const handleEditItem = (event, item) => {
        // Make a copy of shoppingList.data and find item
        let newItemList = [...shoppingList.data]
        const index = newItemList.indexOf(item)

        // Return early if the value of the new item is empty
        const newItem = event.target.value.replace(/(\s+)/g, ' ').trim()

        if (newItem.length === 0) {
            return
        }

        // Change data of the item.
        // Note that the change to the state is only temporary
        // so that the edit effect is visible immediately.
        // The item will be updated in the database via the API
        // and the list will refresh without loading screen.
        newItemList[index].quantity_unit = ''
        newItemList[index].quantity_value = ''
        newItemList[index].name = newItem
        newItemList[index].editable = false

        // Set new list
        shoppingList.setData(newItemList)

        // API call
        axios.post('/api/shoppinglist/edit-ingredient', newItemList[index])
    }

    /**
     * handlePositionChange
     * 
     * Moves the given item up or down in the ShoppingList.
     * 
     * @param {number} id The id of the given item.
     * @param {number} direction Possible values are -1 (up) and 1 (down).
     */
    const handlePositionChange = (item, direction) => {
        // Make a copy of shoppingList.data and find item
        let newItemList = [...shoppingList.data]
        const index = newItemList.indexOf(item)

        const oldPosition = newItemList[index].position
        const newPosition = newItemList[index + direction]?.position

        // Move item up only when it is not the first item and 
        // move item down only when it is not the last item.
        if (
            (direction === -1 && index !== 0)
            || (direction === 1 && index !== shoppingList.data?.length - 1)
        ) {
            newItemList[index].position = newPosition
            newItemList[index + direction].position = oldPosition

            [newItemList[index], newItemList[index + direction]] = [newItemList[index + direction], newItemList[index]]

            // Set new list
            shoppingList.setData(newItemList)

            // API call
            /** @todo */
            axios.get('/api/shoppinglist/position-change')
        }
    }
    
    /**
     * Render Item
     */
    return (
        <div className="flex justify-between items-center gap-4" >
            <div className="flex items-center grow gap-4" >
                <input 
                    id={item.id} 
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
                <IconButton onClick={() => handlePositionChange(item, -1)}>expand_less</IconButton>
                <IconButton onClick={() => handlePositionChange(item, 1)}>expand_more</IconButton>
            </div>
        </div>
    )
}
