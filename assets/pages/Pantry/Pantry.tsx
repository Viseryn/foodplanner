import AddIngredientWidget from '@/components/ui/AddIngredientWidget'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { StandardContentWrapper } from "@/components/ui/StandardContentWrapper"
import InfoPantryEmpty from '@/pages/Pantry/components/InfoPantryEmpty'
import IngredientModel from '@/types/IngredientModel'
import getIngredientModel from '@/util/ingredients/getIngredientModel'
import getLastIngredientPosition from '@/util/ingredients/getLastIngredientPosition'
import { getDeleteRequests } from '@/util/storages/getDeleteRequests'
import { getIngredientGroups } from '@/util/storages/getIngredientGroups'
import { getPatchRequests } from '@/util/storages/getPatchRequests'
import { tryApiRequest } from "@/util/tryApiRequest"
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import swal from 'sweetalert'
import { Item } from './components/Item'

type PantryProps = {
    pantry: EntityState<Array<IngredientModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}

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
export const Pantry = ({ pantry, setSidebar, setTopbar }: PantryProps): ReactElement => {
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
        if (pantry.isLoading) {
            return
        }

        setInputValue('')

        const lastPosition: number = getLastIngredientPosition(pantry.data)
        const ingredientToAdd: IngredientModel = getIngredientModel(value, lastPosition + 1)

        await tryApiRequest("POST", "/api/storages/pantry/ingredients", async (apiUrl) => {
            const response: AxiosResponse<IngredientModel[]> = await axios.post(apiUrl, [ingredientToAdd])
            pantry.setData([...pantry.data, ...response.data])
            return response
        })
    }

    /**
     * Combines items with the same name and same quantityUnit to a single item and adds up the
     * quantityValues. Since the items can contain fractions, the Fraction class is imported and
     * used. All modified ingredients are either patched or deleted via the Ingredients API.
     */
    const handleSumUpIngredients = async (): Promise<void> => {
        if (pantry.isLoading) {
            return
        }

        setLoading(true)

        const { groupedIngredients, ingredientsToDelete } = getIngredientGroups(pantry.data)
        const deleteRequests: Promise<void>[] = getDeleteRequests(ingredientsToDelete)
        const patchRequests: Promise<boolean>[] = getPatchRequests(groupedIngredients, pantry.data)

        pantry.setData(Array.from(groupedIngredients.values()))
        await Promise.all([...deleteRequests, ...patchRequests])

        setLoading(false)
    }

    /**
     * Sorts all items by alphabet.
     */
    const handleSort = async (): Promise<void> => {
        if (pantry.isLoading) {
            return
        }

        const sortedIngredients: IngredientModel[] = [...pantry.data]
        sortedIngredients.sort((a, b) => sortingOrder * a.name.localeCompare(b.name))
        sortedIngredients.forEach((ingredient, index) => {
            ingredient.position = index + 1;
        })

        setSortingOrder(sortingOrder => -1 * sortingOrder)
        setLoading(true)

        const patchRequests: Array<Promise<boolean>> = sortedIngredients.map(ingredient =>
            tryApiRequest("PATCH", `/api/ingredients/${ingredient.id}`, async (apiUrl) => {
                return await axios.patch(apiUrl, { position: ingredient.position })
            })
        )

        pantry.setData(sortedIngredients)
        await Promise.all(patchRequests)
        setLoading(false)
    }

    /**
     * Deletes all items on the list after confirming a SweetAlert.
     */
    const handleDeleteAll = async (): Promise<void> => {
        const swalResponse = await swal({
            dangerMode: true,
            icon: 'error',
            title: 'Wirklich alle Zutaten löschen?',
            buttons: ["Abbrechen", "Löschen"],
        })

        if (swalResponse) {
            void tryApiRequest("DELETE", "/api/storages/pantry/ingredients", async (apiUrl) => {
                const response = await axios.delete(apiUrl)
                pantry.load()
                return response
            })
        }
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
    return (
        <StandardContentWrapper className="md:w-[450px]">
            {pantry.isLoading || isLoading ? (
                <Spinner />
            ) : (
                <>
                    <AddIngredientWidget
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleEnterKeyDown={handleEnterKeyDown}
                    />

                    <Spacer height="10" />

                    <Card>
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
                        <div className="flex justify-end mt-4">
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
        </StandardContentWrapper>
    )
}
