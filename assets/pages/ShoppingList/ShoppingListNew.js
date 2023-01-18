/***********************************************
 * ./assets/pages/ShoppingList/ShoppingList.js *
 ***********************************************/

import React, { useEffect, useState }   from 'react'
import axios                            from 'axios'
import Fraction                         from 'fraction.js'

import AddItemInputWidget               from '../../components/ui/AddItemInputWidget'
import Button                           from '../../components/ui/Buttons/Button'
import IconButton                       from '../../components/ui/Buttons/IconButton'
import Card                             from '../../components/ui/Card'
import Spacer                           from '../../components/ui/Spacer'
import Spinner                          from '../../components/ui/Spinner'

import getFullIngredientName            from '../../util/getFullIngredientName'

/**
 * ShoppingList
 * 
 * @todo
 * 
 * @component
 * @param {object} props
 * @param {object} props.shoppingList
 * 
 * @todo
 */
export default function ShoppingList({ shoppingList, ...props }) {
    /**
     * The input value of the Add Item Widget at the top.
     * Will be passed to the AddItemInputWidget component
     * together with its setter method.
     * 
     * @type {[string, function]}
     */
    const [inputValue, setInputValue] = useState('')

    /**
     * handleEnterKeyDown
     * 
     * A function that is called when the enter key is 
     * pressed with the trimmed inputValue as argument.
     * Adds the argument to the ShoppingList via the 
     * ShoppingList Add API and reloads the list afterwards.
     * The reload is required because the API generates
     * IDs and other fields.
     * 
     * @param {string} value A trimmed string that describes an Ingredient object.
     */
    const handleEnterKeyDown = (value) => {
        // Clear input field
        setInputValue('')

        // Load new shopping list
        shoppingList.setLoading(true)

        // API call
        axios.post('/api/shoppinglist/add', [value])
    }

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

    let preventSingleClick = false;

    /**
     * handleItemSetEditability
     * 
     * Changes an item's editability. Is performed on double clicks.
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
        /** @todo */
    }

    /**
     * handleCheckboxChange
     * 
     * Checks or unchecks an item.
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
     * handleAddUpIngredients
     * 
     * Combines items with the same name and same 
     * quantity_unit to a single item and adds up
     * the quantity_values. Since the items can contain
     * fractions, the Fraction class is imported and 
     * used. The resulting item list will be sent 
     * to the ShoppingList Replace API and a reload 
     * is done.
     */
    const handleAddUpIngredients = () => {
        // Make a copy of the shoppingList.data
        const copyOfList = [...shoppingList.data]

        // Create temporary map for ingredients.
        /** @type {Map<string, object>} */
        let ingredientMap = new Map()

        // Go through each ingredient
        copyOfList.forEach(ingredient => {
            // Check if the ingredient has been added to the ingredientMap yet
            if (ingredientMap.has(ingredient.name)) {
                // Get the ingredient from the map
                let currentIngredient = ingredientMap.get(ingredient.name);

                // Check if the quantity units match and the value is a number
                if (currentIngredient.quantity_unit === ingredient.quantity_unit
                    && ingredient.quantity_value) {
                    // Calculate the new quantity value.
                    // Note that the values may be fractions.
                    let currentVal = new Fraction(currentIngredient.quantity_value)
                    let newVal = new Fraction(ingredient.quantity_value)
                    let totalVal = currentVal.add(newVal)

                    // Save new quantity value in currentIngredient
                    currentIngredient.quantity_value = totalVal.toFraction(true)
                    ingredientMap.set(ingredient.name, currentIngredient)
                } else {
                    // If quantity units do not match or the value is not 
                    // a number, add the ingredient to the map with a unique key
                    ingredientMap.set(ingredient.name + Math.random(), ingredient)
                }
            } else {
                // If ingredient is not in the ingredientMap, add it
                ingredientMap.set(ingredient.name, ingredient)
            }
        })

        // Create a new shoppingList from the ingredientMap
        const newItemList = Array.from(ingredientMap.values())

        // Create array of strings of ingredients for API
        const ingredients = []

        newItemList?.forEach(ingredient => {
            ingredients.push(getFullIngredientName(ingredient))
        })

        // API call
        axios.post('/api/shoppinglist/replace', JSON.stringify(ingredients))
        shoppingList.setLoading(true)
    }

    /**
     * handleDeleteAll
     * 
     * Deletes all items on the list after confirming
     * a SweetAlert.
     */
    const handleDeleteAll = () => {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Wirklich alle Zutaten löschen?',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then((confirm) => {
            if (confirm) {
                axios.get('/api/shoppinglist/delete-all')
                shoppingList.setLoading(true)
            }
        })
    }

    /**
     * handleDeleteChecked
     * 
     * Deletes all checked items.
     */
    const handleDeleteChecked = () => {
        // Make a copy of shoppingList.data and
        // filter out all items that are checked
        const newItemList = [...shoppingList.data].filter(item => !item.checked)
        shoppingList.setData(newItemList)

        // API call
        axios.get('/api/shoppinglist/delete-checked')
    }

    /**
     * Load layout
     */ 
    useEffect(() => {
        // Load sidebar
        props.setSidebar('shoppinglist')

        // Load topbar
        props.setTopbar({
            title: 'Einkaufsliste',
            actionButtons: [
                { icon: 'delete_forever', onClick: handleDeleteAll },
            ],
            style: 'md:w-[450px]',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    /**
     * Update SidebarActionButton when 
     * shoppingList.data changes
     */
    useEffect(() => {
        props.setSidebar('shoppinglist', {
            visible: true, 
            icon: 'remove_done', 
            label: 'Erledigte löschen',
            onClick: handleDeleteChecked,
        })
    }, [shoppingList.data])

    /**
     * Render ShoppingList
     */
    return (
        <div className="pb-24 md:pb-4 w-full md:w-[450px]">
            <Spacer height="6" />
            
            <div className="mx-4 md:mx-0">
                <AddItemInputWidget
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleEnterKeyDown={handleEnterKeyDown}
                />
            </div>

            <Spacer height="10" />

            {shoppingList.isLoading ? (
                <Spinner />
            ) : (
                <>
                    <Card style="mx-4 md:mx-0">
                        <div className="space-y-2 justify-center">
                            {shoppingList.data?.length === 0 &&
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span className="material-symbols-rounded outlined mr-4">info</span>
                                        Die Einkaufsliste ist leer.
                                    </div>
                                </div>
                            }

                            {shoppingList.data?.map(item =>
                                <div key={item.id} className="flex justify-between items-center" >
                                    <div className="flex items-center" >
                                        <input 
                                            id={item.id} 
                                            type="checkbox" 
                                            className="w-4 h-4 mr-4 text-primary-100 bg-[#e0e4d6] rounded-sm border-[#c3c8bb] dark:bg-[#43483e] dark:border-[#8d9286] focus:ring-primary-100 focus:ring-2 peer"
                                            onChange={() => handleCheckboxChange(item)} 
                                            checked={item.checked}
                                        />

                                        <div 
                                            className={'break-words' + (item.checked ? ' line-through text-[#74796d]' : '')} 
                                        >
                                            {item.editable ? (
                                                <input 
                                                    className="bg-transparent border rounded-md"
                                                />
                                            ) : (
                                                getFullIngredientName(item)
                                            )}
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </Card>

                    {shoppingList.data?.length >= 1 &&
                        <div className="flex flex-col items-end justify-end gap-4 mt-4 mx-4 md:mx-0 pb-[5.5rem] md:pb-0">
                            <Button
                                onClick={handleAddUpIngredients}
                                icon="low_priority"
                                label="Zutaten zusammenfassen"
                                role="tertiary"
                                small={true}
                            />
                        </div>
                    }
                </>
            )}
        </div>
    )
}
