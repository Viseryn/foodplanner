/************************************
 * ./assets/pages/Pantry/Pantry.tsx *
 ************************************/

import axios, { AxiosResponse } from 'axios'
import Fraction from 'fraction.js'
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert'

import AddIngredientWidget from '@/components/ui/AddIngredientWidget'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import IngredientModel from '@/types/IngredientModel'
import getFullIngredientName from '@/util/getFullIngredientName'
import Item from './components/Item'
import getLastIngredientPosition from '@/util/ingredients/getLastIngredientPosition'
import getIngredientModel from '@/util/ingredients/getIngredientModel'

/**
 * Pantry
 * 
 * A component that renders a pantry that consists of Ingredient objects. An input widget is 
 * rendered at top for adding new items. Items can be sorted, repositioned, deleted and edited, as 
 * well as added up together.
 * 
 * The pantry and any functionality that is related to it can be deactivated by a user setting in 
 * Settings.tsx; the settings is stored in settings.data.showPantry.
 * 
 * @component
 * 
 * @todo Add a skeleton for the loading time.
 */
export default function Pantry({ pantry, setSidebar, setTopbar }: {
    pantry: EntityState<Array<IngredientModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // The order of the sorting button. If set to true, items will be sorted ascending, 
    // otherwise descending (alphabetically).
    const [sortingOrder, setSortingOrder] = useState<number>(1)

    // The input value of the Add Item Widget at the top. Will be passed to the 
    // AddIngredientWidget component together with its setter method.
    const [inputValue, setInputValue] = useState<string>('')

    // Whether the list should be loading, e.g. while sorting.
    const [isLoading, setLoading] = useState<boolean>(false)

    /**
     * A function that is called when the enter key is pressed with the trimmed inputValue as 
     * argument. Adds the argument to the Pantry via the Pantry Add API and reloads the list 
     * afterwards. The reload is required because the API generates IDs and other fields.
     * 
     * @param value A trimmed string that describes an Ingredient object.
     */
    const handleEnterKeyDown = async (value: string): Promise<void> => {
        setInputValue('')

        const lastPosition = getLastIngredientPosition(pantry.data)
        const ingredientToAdd = getIngredientModel(value, lastPosition + 1)

        const response: AxiosResponse<IngredientModel[]>
            = await axios.post('/api/storages/pantry/ingredients', [ingredientToAdd])
        pantry.setData([...pantry.data, ...response.data])
    }

    /**
     * Combines items with the same name and same quantity_unit to a single item and adds up the 
     * quantity_values. Since the items can contain fractions, the Fraction class is imported and 
     * used. The resulting item list will be sent to the Pantry Replace API and a reload is done.
     */
    const handleAddUpIngredients = (): void => {
        // Make a copy of the pantry.data
        const copyOfList: Array<IngredientModel> = [...pantry.data]

        // Create temporary map for ingredients.
        let ingredientMap: Map<string, IngredientModel> = new Map()

        // Go through each ingredient
        copyOfList.forEach(ingredient => {
            // Check if the ingredient has been added to the ingredientMap yet
            if (ingredientMap.has(ingredient.name)) {
                // Get the ingredient from the map
                let currentIngredient: IngredientModel = ingredientMap.get(ingredient.name)!

                // Check if the quantity units match and the value is a number
                if (currentIngredient.quantityUnit === ingredient.quantityUnit && ingredient.quantityValue) {
                    // Calculate the new quantity value. Note that the values may be fractions.
                    let currentVal: Fraction = new Fraction(currentIngredient.quantityValue)
                    let newVal: Fraction = new Fraction(ingredient.quantityValue)
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

        // Create a new pantry from the ingredientMap
        const newItemList: Array<IngredientModel> = Array.from(ingredientMap.values())

        // Create array of strings of ingredients for API
        const ingredients: Array<string> = []

        newItemList.forEach(ingredient => {
            ingredients.push(getFullIngredientName(ingredient))
        })

        // API call
        // axios.post('/api/pantry/replace', JSON.stringify(ingredients))
        axios.delete('/api/storages/pantry/ingredients')
        axios.post('/api/storages/pantry/ingredients', JSON.stringify(ingredients))
        pantry.load()
    }

    /**
     * Sorts all items by alphabet.
     */
    const handleSort = async (): Promise<void> => {
        const sortedIngredients: IngredientModel[] = [...pantry.data]
        sortedIngredients.sort((a, b) => sortingOrder * a.name.localeCompare(b.name))
        sortedIngredients.forEach((ingredient, index) => {
            ingredient.position = index + 1;
        })

        setSortingOrder(sortingOrder => -1 * sortingOrder)
        setLoading(true)

        const patchRequests: Array<Promise<AxiosResponse<IngredientModel>>> = sortedIngredients.map(ingredient =>
            axios.patch(`/api/ingredients/${ingredient.id}`, { position: ingredient.position })
        )

        pantry.setData(sortedIngredients)
        await Promise.all(patchRequests)
        setLoading(false)
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
        }).then((confirm) => {
            if (confirm) {
                axios.delete('/api/storages/pantry/ingredients')
                pantry.load()
            }
        })
    }

    // Load layout
    useEffect(() => {
        setSidebar('pantry')
        setTopbar({
            title: 'Vorratskammer',
            actionButtons: [
                { icon: 'delete_forever', onClick: handleDeleteAll },
            ],
            style: 'md:w-[450px]',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    // Render Pantry
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

        {pantry.isLoading || isLoading ? (
            <Spinner />
        ) : (
            <>
                <Card style="mx-4 md:mx-0">
                    <div className="space-y-2 justify-center">
                        {pantry.data.length === 0 &&
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="material-symbols-rounded outlined mr-4">info</span>
                                    Die Vorratskammer ist leer.
                                </div>
                            </div>
                        }

                        {pantry.data.length > 0 &&
                            <>
                                <Button
                                    onClick={handleSort}
                                    label="Sortieren"
                                    icon="sort"
                                    role="secondary"
                                    isSmall={true}
                                />
                                <Spacer height="2" />
                            </>
                        }

                        {pantry.data.map(item =>
                            <Item
                                key={item.id}
                                pantry={pantry}
                                item={item}
                            />
                        )}
                    </div>
                </Card>

                {pantry.data.length > 0 &&
                    <div className="flex justify-end mt-4 mx-4 md:mx-0">
                        <Button
                            onClick={handleAddUpIngredients}
                            label="Zutaten sammenfassen"
                            icon="low_priority"
                            role="tertiary"
                            isSmall={true}
                        />
                    </div>
                }
            </>
        )}
    </div>
}
