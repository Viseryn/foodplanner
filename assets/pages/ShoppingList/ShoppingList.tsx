/************************************************
 * ./assets/pages/ShoppingList/ShoppingList.tsx *
 ************************************************/

import React, { useEffect, useState }   from 'react'
import axios                            from 'axios'
import Fraction                         from 'fraction.js'
import swal                             from 'sweetalert'

import Item                             from './components/Item'
import AddItemInputWidget               from '@/components/ui/AddItemInputWidget'
import Button                           from '@/components/ui/Buttons/Button'
import Card                             from '@/components/ui/Card'
import Spacer                           from '@/components/ui/Spacer'
import Spinner                          from '@/components/ui/Spinner'

import getFullIngredientName            from '@/util/getFullIngredientName'
import IngredientModel from '@/types/IngredientModel'

/**
 * ShoppingList
 * 
 * A component that renders a shopping list that consists 
 * of Ingredient objects. An input widget is rendered at 
 * top for adding new items. Items can be checked, 
 * repositioned, deleted and edited, as well as added up 
 * together or amounts being reduced by the ingredients 
 * that are stored in the pantry.
 * 
 * @component
 * @param props
 * @param props.shoppingList
 */
export default function ShoppingList({ shoppingList, pantry, settings, setSidebar, setTopbar }: {
    shoppingList: FetchableEntity<Array<IngredientModel>>
    pantry: FetchableEntity<Array<IngredientModel>>
    settings: FetchableEntity<Settings>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    /**
     * The input value of the Add Item Widget at the top.
     * Will be passed to the AddItemInputWidget component
     * together with its setter method.
     */
    const [inputValue, setInputValue] = useState<string>('')

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
     * @param value A trimmed string that describes an Ingredient object.
     */
    const handleEnterKeyDown = (value: string) => {
        // Clear input field
        setInputValue('')

        // Load new shopping list
        shoppingList.setLoading(true)

        // API call
        axios.post('/api/shoppinglist/add', [value])
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
    const handleAddUpIngredients = (): void => {
        // Make a copy of the shoppingList.data
        const copyOfList: Array<IngredientModel> = [...shoppingList.data]

        // Create temporary map for ingredients.
        let ingredientMap: Map<string, IngredientModel> = new Map()

        // Go through each ingredient
        copyOfList.forEach(ingredient => {
            // Check if the ingredient has been added to the ingredientMap yet
            if (ingredientMap.has(ingredient.name)) {
                // Get the ingredient from the map
                let currentIngredient: IngredientModel = ingredientMap.get(ingredient.name)!

                // Check if the quantity units match and the value is a number
                if (currentIngredient.quantityUnit === ingredient.quantityUnit
                    && ingredient.quantityValue) {
                    // Calculate the new quantity value.
                    // Note that the values may be fractions.
                    let currentVal: Fraction = new Fraction(currentIngredient.quantityValue)
                    let newVal: Fraction = new Fraction(ingredient.quantityValue)
                    let totalVal: Fraction = currentVal.add(newVal)

                    // Save new quantity value in currentIngredient
                    currentIngredient.quantityValue = totalVal.toFraction(true)
                    ingredientMap.set(ingredient.name, currentIngredient)
                } else {
                    // If quantity units do not match or the value is not 
                    // a number, add the ingredient to the map with another key
                    ingredientMap.set(ingredient.name + ingredient.quantityUnit, ingredient)
                }
            } else {
                // If ingredient is not in the ingredientMap, add it
                ingredientMap.set(ingredient.name, ingredient)
            }
        })

        // Create a new shoppingList from the ingredientMap
        const newItemList: Array<IngredientModel> = Array.from(ingredientMap.values())

        // Create array of strings of ingredients for API
        const ingredients: Array<string> = []

        newItemList?.forEach(ingredient => {
            ingredients.push(getFullIngredientName(ingredient))
        })

        // API call
        axios.post('/api/shoppinglist/replace', JSON.stringify(ingredients))
        shoppingList.setLoading(true)
    }

    /**
     * handleSubstractPantry
     * 
     * Does the same as handleAddUpIngredients,
     * but additionally substracts all ingredients 
     * that are in the pantry.
     */
    const handleSubstractPantry = (): void => {
        // Make a copy of the shoppingList.data and pantry.data
        const copyOfList: Array<IngredientModel> = [...shoppingList.data]
        const copyOfPantry: Array<IngredientModel> = JSON.parse(JSON.stringify(pantry.data))

        // Each pantry ingredient should have negative value
        copyOfPantry.forEach(item => {
            item.quantityValue = '-' + item.quantityValue
        })

        // Create temporary map for ingredients.
        let ingredientMap: Map<string, IngredientModel> = new Map();

        // Go through each ingredient
        ([...copyOfList, ...copyOfPantry]).forEach(ingredient => {
            // Check if the ingredient has been added to the ingredientMap yet
            if (ingredientMap.has(ingredient.name)) {
                // Get the ingredient from the map
                let currentIngredient: IngredientModel = ingredientMap.get(ingredient.name)!

                // Check if the quantity units match and the value is a number
                if (currentIngredient.quantityUnit === ingredient.quantityUnit
                    && ingredient.quantityValue) {
                    // Calculate the new quantity value.
                    // Note that the values may be fractions.
                    let currentVal: Fraction = new Fraction(currentIngredient.quantityValue == '' ? 0 : currentIngredient.quantityValue)
                    let newVal: Fraction = new Fraction(ingredient.quantityValue == '' ? 0 : ingredient.quantityValue)
                    let totalVal: Fraction = currentVal.add(newVal)

                    // Save new quantity value in currentIngredient
                    currentIngredient.quantityValue = totalVal.toFraction(true)
                    ingredientMap.set(ingredient.name, currentIngredient)
                } else {
                    // If quantity units do not match or the value is not 
                    // a number, add the ingredient to the map with another key
                    ingredientMap.set(ingredient.name + ingredient.quantityUnit, ingredient)
                }
            } else {
                // If ingredient is not in the ingredientMap, add it
                ingredientMap.set(ingredient.name, ingredient)
            }
        })

        // Create a new shoppingList from the ingredientMap
        let newItemList: Array<IngredientModel> = Array.from(ingredientMap.values())

        // Filter non-positive quantity values out
        newItemList = newItemList.filter(item => {
            let quantityValue: Fraction = new Fraction(item.quantityValue == '' ? 0 : item.quantityValue)
            // quantityValue = quantityValue.valueOf()
            return quantityValue.valueOf() > 0 || !quantityValue && quantityValue !== 0
        })

        // Create array of strings of ingredients for API
        const ingredients: Array<string> = []

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
                cancel: { text: 'Abbrechen' },
                confirm: { text: 'Löschen' },
            },
        }).then(confirm => {
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
        const newItemList: Array<IngredientModel> = [...shoppingList.data].filter(item => !item.checked)
        shoppingList.setData(newItemList)

        // API call
        axios.get('/api/shoppinglist/delete-checked')
    }

    /**
     * Load layout
     */ 
    useEffect(() => {
        // Load sidebar
        setSidebar('shoppinglist')

        // Load topbar
        setTopbar({
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
        setSidebar('shoppinglist', {
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
        <div className="pb-24 md:pb-4 md:w-[450px]">
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
                <Spinner /> /** @todo Add Skeleton here */
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
                                <Item  
                                    key={item.id}
                                    shoppingList={shoppingList}
                                    item={item}
                                />
                            )}
                        </div>
                    </Card>

                    {shoppingList.data !== undefined && shoppingList.data.length >= 1 &&
                        <div className="flex flex-col items-end justify-end gap-4 mt-4 mx-4 md:mx-0 pb-[5.5rem] md:pb-0">
                            {settings.data?.showPantry && pantry.data != undefined && pantry.data.length > 0 &&
                                <Button
                                    onClick={handleSubstractPantry}
                                    label="Vorräte verrechnen"
                                    icon="cell_merge"
                                    role="tertiary"
                                    isSmall={true}
                                />
                            }
                            <Button
                                onClick={handleAddUpIngredients}
                                icon="low_priority"
                                label="Zutaten zusammenfassen"
                                role="tertiary"
                                isSmall={true}
                            />
                        </div>
                    }
                </>
            )}
        </div>
    )
}
