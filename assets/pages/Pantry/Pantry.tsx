/************************************
 * ./assets/pages/Pantry/Pantry.tsx *
 ************************************/

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
import Item from './components/Item'
import getLastIngredientPosition from '@/util/ingredients/getLastIngredientPosition'
import getIngredientModel from '@/util/ingredients/getIngredientModel'
import InfoPantryEmpty from '@/pages/Pantry/components/InfoPantryEmpty'

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
}): ReactElement {
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
     * afterward. The reload is required because the API generates IDs and other fields.
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
     * Combines items with the same name and same quantityUnit to a single item and adds up the
     * quantityValues. Since the items can contain fractions, the Fraction class is imported and
     * used. All modified ingredients are either patched or deleted via the Ingredients API.
     */
    const handleSumUpIngredients = async (): Promise<void> => {
        setLoading(true)

        const groupedIngredients: Map<string, IngredientModel> = new Map<string, IngredientModel>()
        const ingredientsToDelete: IngredientModel[] = []

        // Find ingredient groups
        pantry.data.forEach((ingredient: IngredientModel) => {
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
                = pantry.data.find(item => item.id === ingredient.id)

            if (originalIngredient && originalIngredient.quantityValue !== ingredient.quantityValue) {
                patchRequests.push(axios.patch(`/api/ingredients/${ingredient.id}`, {
                    quantityValue: ingredient.quantityValue
                }))
            }
        })

        // Send requests and update ingredient list
        pantry.setData(Array.from(groupedIngredients.values()))
        await Promise.all([...deleteRequests, ...patchRequests])

        setLoading(false)
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
                            <InfoPantryEmpty />
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
                            onClick={handleSumUpIngredients}
                            label="Zutaten zusammenfassen"
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
