/************************************************
 * ./assets/pages/ShoppingList/ShoppingList.tsx *
 ************************************************/

import axios, { AxiosResponse } from 'axios'
import Fraction from 'fraction.js'
import React, { ReactElement, useEffect, useState } from 'react'
import swal from 'sweetalert'

import AddIngredientWidget from '@/components/ui/AddIngredientWidget'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import IngredientModel from '@/types/IngredientModel'
import SettingsModel from '@/types/SettingsModel'
import Item from './components/Item'
import getIngredientModel from '@/util/ingredients/getIngredientModel'
import getLastIngredientPosition from '@/util/ingredients/getLastIngredientPosition'
import InfoShoppingListEmpty from '@/pages/ShoppingList/components/InfoShoppingListEmpty'

/**
 * ShoppingList
 * 
 * A component that renders a shopping list that consists of Ingredient objects. An input widget is 
 * rendered at top for adding new items. Items can be checked, repositioned, deleted and edited, as 
 * well as added up together or amounts being reduced by the ingredients that are stored in the pantry.
 * 
 * @component
 * 
 * @todo Add a skeleton for the loading time.
 */
export default function ShoppingList({ shoppingList, pantry, settings, setSidebar, setTopbar }: {
    shoppingList: EntityState<Array<IngredientModel>>
    pantry: EntityState<Array<IngredientModel>>
    settings: EntityState<SettingsModel>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): ReactElement {
    // The input value of the Add Item Widget at the top. 
    // Will be passed to the AddIngredientWidget component together with its setter method.
    const [inputValue, setInputValue] = useState<string>('')

    // Whether the list should be loading, e.g. while summing up.
    const [isLoading, setLoading] = useState<boolean>(false)

    /**
     * A function that is called when the enter key is pressed with the trimmed inputValue as 
     * argument. Adds the argument to the ShoppingList via the Storage POST API and adds the
     * response to the ShoppingList.
     * 
     * @param value A trimmed string that describes an Ingredient object.
     */
    const handleEnterKeyDown = async (value: string): Promise<void> => {
        setInputValue('')

        const lastPosition = getLastIngredientPosition(shoppingList.data)
        const ingredientToAdd = getIngredientModel(value, lastPosition + 1)

        const response: AxiosResponse<IngredientModel[]>
            = await axios.post('/api/storages/shoppinglist/ingredients', [ingredientToAdd])
        shoppingList.setData([...shoppingList.data, ...response.data])
    }

    /**
     * Combines items with the same name and same quantityUnit to a single item and adds up the 
     * quantityValues. Since the items can contain fractions, the Fraction class is imported and 
     * used. All modified ingredients are either patched or deleted via the Ingredients API.
     */
    const handleSumUpIngredients = async (): Promise<void> => {
        setLoading(true)

        const groupedIngredients: Map<string, IngredientModel> = new Map<string, IngredientModel>()
        const ingredientsToDelete: IngredientModel[] = []

        // Find ingredient groups
        shoppingList.data.forEach((ingredient: IngredientModel) => {
            const key: string = `${ingredient.name}|${ingredient.quantityUnit}`

            if (groupedIngredients.has(key)) {
                ingredientsToDelete.push(ingredient)
                const existingIngredient: IngredientModel = groupedIngredients.get(key)!

                const currentValue: Fraction = new Fraction(existingIngredient.quantityValue)
                const incomingValue: Fraction = new Fraction(ingredient.quantityValue)
                const totalValue: Fraction = currentValue.add(incomingValue)

                existingIngredient.quantityValue = totalValue.toFraction(true)
            } else {
                groupedIngredients.set(key, {...ingredient})
            }
        })

        // Set up DELETE requests
        const deleteRequests = ingredientsToDelete.map(ingredient => {
            axios.delete(`/api/ingredients/${ingredient.id}`)
        })

        // Only make PATCH request for ingredients that have changed
        const patchRequests: Array<Promise<AxiosResponse<IngredientModel>>> = []
        groupedIngredients.forEach(ingredient => {
            const originalIngredient: IngredientModel | undefined
                = shoppingList.data.find(item => item.id === ingredient.id)

            if (originalIngredient && originalIngredient.quantityValue !== ingredient.quantityValue) {
                patchRequests.push(axios.patch(`/api/ingredients/${ingredient.id}`, {
                    quantityValue: ingredient.quantityValue
                }))
            }
        })

        // Send requests and update ingredient list
        shoppingList.setData(Array.from(groupedIngredients.values()))
        await Promise.all([...deleteRequests, ...patchRequests])

        setLoading(false)
    }

    /**
     * Does the same as handleAddUpIngredients, but additionally substracts all ingredients that are in the pantry.
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
                    // Calculate the new quantity value. Note that the values may be fractions.
                    let currentVal: Fraction = new Fraction(currentIngredient.quantityValue == '' ? 0 : currentIngredient.quantityValue)
                    let newVal: Fraction = new Fraction(ingredient.quantityValue == '' ? 0 : ingredient.quantityValue)
                    let totalVal: Fraction = currentVal.add(newVal)

                    // Save new quantity value in currentIngredient
                    currentIngredient.quantityValue = totalVal.toFraction(true)
                    ingredientMap.set(ingredient.name, currentIngredient)
                } else {
                    // If quantity units do not match or the value is not a number, 
                    // add the ingredient to the map with another key
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
        // axios.post('/api/shoppinglist/replace', JSON.stringify(ingredients))
        axios.delete('/api/storages/shoppinglist/ingredients')
        axios.post('/api/storages/shoppinglist/ingredients', JSON.stringify(ingredients))
        shoppingList.load()
    }

    /**
     * Deletes all items on the list after confirming a SweetAlert.
     */
    const handleDeleteAll = (): void => {
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
                axios.delete('/api/storages/shoppinglist/ingredients')
                shoppingList.load()
            }
        })
    }

    /**
     * Deletes all checked items.
     */
    const handleDeleteChecked = async (): Promise<void> => {
        const uncheckedIngredients: IngredientModel[] = [...shoppingList.data].filter(item => !item.checked)
        shoppingList.setData(uncheckedIngredients)

        await axios.delete('/api/storages/shoppinglist/ingredients?checked=true')
    }

    // Load layout 
    useEffect(() => {
        setSidebar('shoppinglist')
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

    // Update SidebarActionButton when shoppingList.data changes
    useEffect(() => {
        setSidebar('shoppinglist', {
            visible: true, 
            icon: 'remove_done', 
            label: 'Erledigte löschen',
            onClick: handleDeleteChecked,
        })
    }, [shoppingList.data])

    // Render ShoppingList
    return <div className="pb-24 md:pb-4 md:w-[450px]">
        <Spacer height="6" />
        
        <div className="mx-4 md:mx-0">
            <AddIngredientWidget
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleEnterKeyDown={handleEnterKeyDown}
            />
        </div>

        <Spacer height="10" />

        {shoppingList.isLoading || isLoading ? (
            <Spinner />
        ) : (
            <>
                <Card style="mx-4 md:mx-0">
                    <div className="space-y-2 justify-center">
                        {shoppingList.data?.length === 0 &&
                            <InfoShoppingListEmpty />
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
                            onClick={handleSumUpIngredients}
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
}
