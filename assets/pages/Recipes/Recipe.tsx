import TextParagraph from '@/components/skeleton/TextParagraph'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import Spacer from '@/components/ui/Spacer'
import { StandardContentWrapper } from "@/components/ui/StandardContentWrapper"
import useTimeout from '@/hooks/useTimeout'
import DayModel from '@/types/DayModel'
import IngredientModel from '@/types/IngredientModel'
import RecipeModel from '@/types/RecipeModel'
import SettingsModel from '@/types/SettingsModel'
import getFullIngredientName from '@/util/getFullIngredientName'
import getLastIngredientPosition from '@/util/ingredients/getLastIngredientPosition'
import { tryApiRequest } from "@/util/tryApiRequest"
import axios, { AxiosResponse } from 'axios'
import Fraction from 'fraction.js'
import React, { ReactElement, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'

type RecipeProps = {
    days: EntityState<Array<DayModel>>
    recipes: EntityState<Array<RecipeModel>>
    shoppingList: EntityState<Array<IngredientModel>>
    pantry: EntityState<Array<IngredientModel>>
    settings: EntityState<SettingsModel>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}

/**
 * @todo Change the color of the select arrow.
 * @todo Write an easier to read skeleton.
 */
export const Recipe = ({ days, recipes, shoppingList, pantry, settings, setSidebar, setTopbar }: RecipeProps): ReactElement => {
    // Type for route parameters
    type RecipeRouteParams = {
        id?: string
    }

    // The id parameter of the route '/recipe/:id'.
    const { id }: RecipeRouteParams = useParams()

    // A function that can change location. Needed for the edit topbar action button.
    const navigate: NavigateFunction = useNavigate()

    // The currently selected recipe. Will be updated whenever id changes.
    const [recipe, setRecipe] = useState<RecipeModel>({} as RecipeModel)

    // A temporary state variable for the recipe. This object changes whenever recipe or portionSize change.
    const [tmpRecipe, setTmpRecipe] = useState<RecipeModel>({} as RecipeModel)

    // The portion size. Can be selected in an input field in the ingredients section.
    // Whenever this value is changed, tmpRecipe will be updated.
    const [portionSize, setPortionSize] = useState<number>(0)

    // Whether the SidebarActionButton should display "Done!" on click.
    const [showShoppingListDone, setShowShoppingListDone] = useState<boolean>(false)

    // Whether the "Add to Pantry" button should display "Done!" on click.
    const [showPantryDone, setShowPantryDone] = useState<boolean>(false)

    // Timeouts for Done-info
    const { clearTimeout: clearShoppingListTimeout, startTimeout: startShoppingListTimeout }
        = useTimeout(() => {
            setShowShoppingListDone(false)
        }, 5000)
    const { clearTimeout: clearPantryTimeout, startTimeout: startPantryTimeout }
        = useTimeout(() => {
            setShowPantryDone(false)
        }, 5000)

    /**
     * Handles adding the whole recipe to the ShoppingList. Is invoked by the SAB.
     */
    const handleAddShoppingList = async (argRecipe: RecipeModel): Promise<void> => {
        clearShoppingListTimeout()

        if (shoppingList.isLoading) {
            return
        }

        const lastPosition = getLastIngredientPosition(shoppingList.data)
        const ingredientsToAdd: IngredientModel[] = argRecipe.ingredients?.map((ingredient, index) => ({
            ...ingredient,
            position: lastPosition + index + 1,
            checked: false,
        }))

        if (ingredientsToAdd?.length) {
            void tryApiRequest("POST", "/api/storages/shoppinglist/ingredients", async (apiUrl) => {
                const response: AxiosResponse<IngredientModel[]> = await axios.post(apiUrl, ingredientsToAdd)
                shoppingList.setData([...shoppingList.data, ...response.data])
                return response
            })
        }

        // Update parameters for SAB
        setShowShoppingListDone(true)
        startShoppingListTimeout()
    }

    /**
     * Handles adding a single ingredient to the ShoppingList.
     * Can be invoked by the IconButtons next to each ingredient.
     */
    const handleAddSingleToShoppingList = async (ingredient: IngredientModel): Promise<void> => {
        if (shoppingList.isLoading) {
            return
        }

        const ingredientToAdd: IngredientModel = {
            ...ingredient,
            position: getLastIngredientPosition(shoppingList.data) + 1,
            checked: false,
        }

        void tryApiRequest("POST", "/api/storages/shoppinglist/ingredients", async (apiUrl) => {
            const response: AxiosResponse<IngredientModel[]> = await axios.post(apiUrl, [ingredientToAdd])
            shoppingList.setData([...shoppingList.data, ...response.data])
            return response
        })
    }

    /**
     * Handles adding the whole recipe to the Pantry. Is invoked by a button under the ingredient list.
     */
    const handleAddPantry = async (argRecipe: RecipeModel): Promise<void> => {
        clearPantryTimeout()

        if (pantry.isLoading) {
            return
        }

        const lastPosition = getLastIngredientPosition(pantry.data)
        const ingredientsToAdd: IngredientModel[] = argRecipe.ingredients?.map((ingredient, index) => ({
            ...ingredient,
            position: lastPosition + index + 1,
        }))

        if (ingredientsToAdd?.length) {
            void tryApiRequest("POST", "/api/storages/pantry/ingredients", async (apiUrl) => {
                const response: AxiosResponse<IngredientModel[]> = await axios.post(apiUrl, ingredientsToAdd)
                pantry.setData([...pantry.data, ...response.data])
                return response
            })
        }

        // Update parameter for button
        setShowPantryDone(true)
        startPantryTimeout()
    }

    /**
     * Handles adding a single ingredient to the Pantry.
     * Can be invoked by the IconButtons next to each ingredient.
     */
    const handleAddSingleToPantry = async (ingredient: IngredientModel): Promise<void> => {
        if (pantry.isLoading) {
            return
        }

        const ingredientToAdd: IngredientModel = {
            ...ingredient,
            position: getLastIngredientPosition(pantry.data) + 1,
            checked: false,
        }

        void tryApiRequest("POST", "/api/storages/pantry/ingredients", async (apiUrl) => {
            const response: AxiosResponse<IngredientModel[]> = await axios.post(apiUrl, [ingredientToAdd])
            pantry.setData([...pantry.data, ...response.data])
            return response
        })
    }

    // Initializes the recipe state variable. Each time the id parameter changes, the 
    // recipe state is updated. When the recipes are reloaded, recipe is also updated.
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        // Find correct recipe
        const queryResult: Array<RecipeModel> = recipes.data.filter(recipe => recipe.id.toString() == id)
        setRecipe(queryResult[0])

        // If recipe does not exist, redirect to 404 page
        if (queryResult.length === 0) {
            navigate('/error/404')
        }
    }, [id, recipes.isLoading])

    // Put a copy of selected recipe in a local state variable tmpRecipe and save 
    // the original portion size of the recipe in portionSize.
    // These will only be updated on initialization, not when the recipe changes!
    useEffect(() => {
        if (portionSize == 0 || portionSize == undefined) {
            // Set temporary copy of recipe
            setTmpRecipe(recipe)

            // Set initial portion size
            setPortionSize(recipe.portionSize)
        }
    }, [recipe, recipes.data])

    // Calculate the ingredient quantities depending on selected portionSize
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        let newRecipe: RecipeModel = { ...recipe }
        newRecipe.ingredients = []
        newRecipe.portionSize = portionSize

        recipe.ingredients?.forEach(ingredient => {
            let newIngredient: IngredientModel = { ...ingredient }

            let newQuantityValue: Fraction = new Fraction(ingredient.quantityValue ? ingredient.quantityValue : '0')

            newIngredient['quantityValue'] = newQuantityValue
                .div(new Fraction(recipe.portionSize))
                .mul(new Fraction(portionSize))
                .toFraction(true)

            if (newIngredient['quantityValue'] === '0') {
                newIngredient['quantityValue'] = ''
            }

            newRecipe.ingredients.push(newIngredient)
        })

        // Set the new calculated recipe in tmpRecipe. This does NOT trigger a reassignment of portionSize.
        setTmpRecipe(newRecipe)
    }, [portionSize])

    useEffect(() => {
        if (!days.isLoading) {
            setSidebar('recipes', {
                visible: true,
                icon: 'calendar_add_on',
                label: 'Mahlzeit planen',
                path: `/planner/add/${days.data[0].id}?recipe=${recipe.id}`,
            })
        }

        setTopbar({
            title: recipe.title,
            showBackButton: true,
            backButtonPath: '/recipes',
            actionButtons: [
                {
                    icon: 'refresh', onClick: () => {
                        setPortionSize(0)
                        recipes.load()
                    }
                },
                { icon: 'contract_edit', onClick: () => navigate('/recipe/' + id + '/edit') },
            ],
            truncate: true,
            style: 'max-w-[700px] md:pr-4',
            isLoading: recipes.isLoading,
        })

        window.scrollTo(0, 0)
    }, [recipe, days.isLoading])

    return <StandardContentWrapper className="md:max-w-[700px]">
        {/* Image */}
        {recipes.isLoading
            ? /* Recipe Skeleton */ <img className="animate-pulse rounded-3xl h-80 w-full object-cover" src='/img/default.jpg' alt='' />
            : (recipe.image &&
                <img
                    className="rounded-3xl h-80 object-cover transition duration-300 w-full"
                    src={recipe.image.directory + recipe.image.filename}
                    alt={recipe.title}
                />
            )
        }

        {/* Ingredients, instructions and buttons */}
        {recipes.isLoading
            ? <>
                {/* Recipe Skeleton */}
                <div className="animate-pulse pb-4 pt-10">
                    <div className="h-10 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4 md:w-1/2" />
                </div>

                <Card>
                    <TextParagraph />
                    <Spacer height="2" />
                    <TextParagraph />
                </Card>
            </>
            : <>
                {/* Ingredients */}
                {tmpRecipe.ingredients?.length > 0 &&
                    <>
                        <Spacer height="10" />

                        <Heading size="xl" style="ml-2">
                            Zutaten für
                            <select
                                value={portionSize}
                                onChange={e => setPortionSize(+e.target.value)}
                                className="dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 border border-gray-300 dark:border-none rounded-md h-10 w-20 px-6 mx-4 transition duration-300 focus:border-primary-100 dark:after:bg-red-500"
                            >
                                {[...Array(10)].map((value, index) =>
                                    <option
                                        key={index + 1}
                                        value={index + 1}
                                    >
                                        {index + 1}
                                    </option>
                                )}
                            </select>
                            {portionSize == 1 ? 'Portion' : 'Portionen'}
                        </Heading>

                        <Spacer height="4" />

                        <Card>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                {tmpRecipe.ingredients.map(ingredient =>
                                    <div key={ingredient.id} className="flex items-center justify-between">
                                        <span>
                                            {getFullIngredientName(ingredient)}
                                        </span>

                                        <div className="flex flex-row">
                                            <Button
                                                style={'shoppinglist-' + ingredient.id}
                                                onClick={async () => {
                                                    let element = document.getElementsByClassName('shoppinglist-' + ingredient.id)[0].firstChild! as HTMLElement
                                                    setTimeout(() => {
                                                        element.innerHTML = "add_shopping_cart"
                                                    }, 5000)
                                                    await handleAddSingleToShoppingList(ingredient)
                                                    element.innerHTML = "done"
                                                }}
                                                icon="add_shopping_cart"
                                                outlined={true}
                                                role="tertiary"
                                            />
                                            {settings.data?.showPantry &&
                                                <Button
                                                    style={'pantry-' + ingredient.id}
                                                    onClick={async () => {
                                                        let element = document.getElementsByClassName('pantry-' + ingredient.id)[0].firstChild! as HTMLElement
                                                        setTimeout(() => {
                                                            element.innerHTML = "add_home"
                                                        }, 5000)
                                                        await handleAddSingleToPantry(ingredient)
                                                        element.innerHTML = "done"
                                                    }}
                                                    icon="add_home"
                                                    outlined={true}
                                                    role="tertiary"
                                                />
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end justify-end gap-4 mt-4">
                                <Button
                                    icon={showShoppingListDone ? 'done' : 'add_shopping_cart'}
                                    outlined={true}
                                    label={showShoppingListDone ? 'Erledigt!' : 'Alle Zutaten zur Einkaufsliste'}
                                    onClick={() => handleAddShoppingList(tmpRecipe)}
                                    role="tertiary"
                                    isSmall={true}
                                />

                                {settings.data?.showPantry &&
                                    <Button
                                        icon={showPantryDone ? 'done' : 'add_home'}
                                        outlined={true}
                                        label={showPantryDone ? 'Erledigt!' : 'Alle Zutaten zum Vorrat'}
                                        onClick={() => handleAddPantry(tmpRecipe)}
                                        role="tertiary"
                                        isSmall={true}
                                    />
                                }
                            </div>
                        </Card>
                    </>
                }

                {/* Instructions */}
                {tmpRecipe.instructions?.length > 0 &&
                    <>
                        <Spacer height="10" />

                        <Heading size="xl" style="ml-2">Zubereitung</Heading>

                        <Spacer height="4" />

                        <Card style="space-y-2">
                            {recipe.instructions.map((instruction, index) =>
                                <div key={instruction.id} className="flex">
                                    <span className="mr-2">{index + 1}.</span>
                                    {instruction.instruction}
                                </div>
                            )}
                        </Card>
                    </>
                }

                {/* Show empty card if there is no image, no ingredients and no instructions */}
                {recipe.image == undefined && tmpRecipe.ingredients?.length === 0 && tmpRecipe.instructions?.length === 0 &&
                    <Card style="mx-4 md:ml-0 flex items-center">
                        <span className="material-symbols-rounded outlined mr-4">info</span>
                        Hier gibt es noch nichts zu sehen.
                    </Card>
                }

                <div className="mb-[5.5rem]"></div>
            </>
        }
    </StandardContentWrapper>
}
