/************************************
 * ./assets/pages/Recipes/Recipe.js *
 ************************************/

import React, { useEffect, useState }       from 'react'
import { useNavigate, useParams }           from 'react-router-dom'
import axios                                from 'axios'

import TextParagraph                        from '../../components/skeleton/TextParagraph'
import Button                               from '../../components/ui/Buttons/Button'
import Card                                 from '../../components/ui/Card'
import { SecondHeading }                    from '../../components/ui/Heading'
import Spacer                               from '../../components/ui/Spacer'
import { floatToFraction, fractionToFloat } from '../../util/fractions'
import generateDisplayName                  from '../../util/generateDisplayName'
import loadPantry                           from '../../util/loadPantry'
import loadShoppingList                     from '../../util/loadShoppingList'

/**
 * Recipe
 * 
 * A component that shows a single recipe in detail.
 * 
 * @todo Change the color of the select arrow.
 * 
 * @component
 * @param {object} props
 * @param {function} props.setSidebar
 * @param {function} props.setTopbar
 * @param {object} props.recipes 
 */
export default function Recipe({ recipes, ...props }) {
    /**
     * The id parameter of the route '/recipe/:id'.
     * 
     * @property {string} id
     */
    const { id } = useParams()

    /**
     * A function that can change location.
     * Needed for the edit topbar action button.
     * 
     * @type {NavigateFunction}
     */
    const navigate = useNavigate()

    /**
     * The currently selected recipe.
     * Will be updated whenever id changes.
     * 
     * @type {[object, function]}
     */
    const [recipe, setRecipe] = useState({})

    /**
     * A temporary state variable for the recipe.
     * This object changes whenever recipe or 
     * portionSize change.
     * 
     * @type {[object, function]}
     */
    const [tmpRecipe, setTmpRecipe] = useState([])

    /**
     * The portion size. Can be selected in an 
     * input field in the ingredients section.
     * Whenever this value is changed, tmpRecipe
     * will be updated.
     * 
     * @type {[number, function]}
     */
    const [portionSize, setPortionSize] = useState(0)

    /**
     * Counts how often the SAB was pressed.
     * Will update the SAB on change.
     * 
     * @type {[number, function]}
     */
    const [countSabClicks, setCountSabClicks] = useState(0)

    /**
     * Whether the SidebarActionButton should
     * display "Done!" on click.
     * 
     * @type {[boolean, function]}
     */
    const [showSabDone, setShowSabDone] = useState(false)

    /**
     * Whether the "Add to Pantry" button should
     * display "Done!" on click.
     * 
     * @type {[boolean, function]}
     */
    const [showPantryDone, setShowPantryDone] = useState(false)

    /**
     * handleAddShoppingList
     * 
     * Handles adding the whole recipe to the 
     * ShoppingList. Is invoked by the SAB.
     */
    const handleAddShoppingList = (argRecipe) => {
        // Call API
        axios
            .post('/api/shoppinglist/add', JSON.stringify([argRecipe]))
            .then(() => props.shoppingList.setLoading(true))
        
        // Refresh Data Timestamp
        axios.get('/api/refresh-data-timestamp/set')
        
        // Update parameters for SAB
        setShowSabDone(false)
        setCountSabClicks(count => {
            return count + 1
        })
    }
    
    /**
     * handleAddSingleToShoppingList
     * 
     * Handles adding a single ingredient to 
     * the ShoppingList. Can be invoked by the 
     * IconButtons next to each ingredient.
     */
    const handleAddSingleToShoppingList = (ingredient) => {
        // Generate a name for the API
        const newItem = { 
            name: generateDisplayName(
                ingredient.quantity_value,
                ingredient.quantity_unit,
                ingredient.name,
            ),
        }

        // Call API
        axios
            .post('/api/shoppinglist/ingredients', newItem)
            .then(() => {
                loadShoppingList(props.shoppingList.setData)
            })
        
                
        // Refresh Data Timestamp
        axios.get('/api/refresh-data-timestamp/set')
    }

    /**
     * handleAddPantry
     * 
     * Handles adding the whole recipe to the
     * Pantry. Is invoked by a button under the 
     * ingredient list.
     */
    const handleAddPantry = (argRecipe) => {
        // Call API
        axios
            .post('/api/pantry/add', JSON.stringify([argRecipe]))
            .then(() => props.pantry.setLoading(true))

        // Refresh Data Timestamp
        axios.get('/api/refresh-data-timestamp/set')
        
        // Update the button parameter
        setShowPantryDone(false)
    }

    /**
     * handleAddSingleToPantry
     * 
     * Handles adding a single ingredient to 
     * the Pantry. Can be invoked by the 
     * IconButtons next to each ingredient.
     */
    const handleAddSingleToPantry = (ingredient) => {
        // Generate a name for the API
        const newItem = { 
            name: generateDisplayName(
                ingredient.quantity_value,
                ingredient.quantity_unit,
                ingredient.name,
            ),
        }

        // Call API
        axios
            .post('/api/pantry/ingredients', newItem)
            .then(() => {
                loadPantry(props.pantry.setData)
            })
        
                
        // Refresh Data Timestamp
        axios.get('/api/refresh-data-timestamp/set')
    }
    
    /**
     * Initializes the recipe state variable.
     * Each time the id parameter changes, the 
     * recipe state is updated. When the recipes 
     * are reloaded, recipe is also updated.
     */
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        // Find correct recipe
        const queryResult = recipes.data?.filter(recipe => recipe?.id == id)
        setRecipe(queryResult[0])

        // If recipe does not exist, redirect to 404 page
        if (queryResult.length === 0) {
            navigate('/error/404')
        }
    }, [id, recipes.isLoading])

    /**
     * Put a copy of selected recipe in a local state 
     * variable tmpRecipe and save the original portion
     * size of the recipe in portionSize.
     * 
     * These will be updated whenever the global
     * recipes state variable changes, e.g. on recipe edit.
     */
    useEffect(() => {
        // Set temporary copy of recipe
        setTmpRecipe(recipe)
        
        // Set initial portion size
        setPortionSize(recipe?.portion_size)
    }, [recipe, recipes.data])

    /**
     * Calculate the ingredient quantities 
     * depending on selected portionSize
     */
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }
            
        let newRecipe = {...recipe}
        newRecipe.ingredients = []
        newRecipe.portion_size = portionSize

        recipe?.ingredients?.forEach(ingredient => {
            let newIngredient = {...ingredient}

            newIngredient['quantity_value'] = 
                fractionToFloat(ingredient.quantity_value) 
                / recipe.portion_size * portionSize

            newRecipe.ingredients.push(newIngredient)
        })

        // Set the new calculated recipe in tmpRecipe.
        // This does NOT trigger a reassignment of portionSize.
        setTmpRecipe(newRecipe)
    }, [portionSize])

    /**
     * Update SidebarActionButton when recipe or tmpRecipe changes
     * or button is clicked (i.e., showButton is set to false).
     */
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        props.setSidebar('recipes', {
            visible: true, 
            icon: showSabDone ? 'done' : 'add_shopping_cart', 
            label: showSabDone 
                ? 'Erledigt!' + (countSabClicks > 1 && ' (' + countSabClicks + ')')
                : 'Zur Einkaufsliste' ,
            onClickHandler: () => handleAddShoppingList(tmpRecipe),
        })
    }, [recipe, tmpRecipe, showSabDone, countSabClicks])

    /** 
     * Load layout
     */
    useEffect(() => {
        // Load topbar
        props.setTopbar({
            title: recipe?.title,
            showBackButton: true,
            backButtonPath: '/recipes',
            actionButtons: [
                { icon: 'edit', onClick: () => navigate('/recipe/' + id + '/edit') },
            ],
            truncate: true,
            style: 'max-w-[700px] md:pr-4',
            isLoading: recipes.isLoading,
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [recipe])

    /**
     * Render Recipe
     */
    return (
        <div className="pb-24 md:pb-4 md:max-w-[700px]">
            {/* Image */}
            <div className="mx-4 md:ml-0">
                <Spacer height="6" />
                {recipes.isLoading
                    ? /* Recipe Skeleton */ <img className="animate-pulse rounded-3xl h-80 w-full object-cover" src='/img/default.jpg' />
                    : (recipe?.image != null &&
                        <img 
                            className="rounded-3xl h-80 object-cover transition duration-300 w-full" 
                            src={recipe?.image.directory + recipe?.image.filename}
                            alt={recipe}
                        />
                    )
                }
            </div>

            {/* Ingredients, instructions and buttons */}
            {recipes.isLoading
                ? <>
                    {/* Recipe Skeleton */}
                    <Spacer height="6" />

                    <div className="animate-pulse p-4 md:px-0 lg:pl-4 md:pt-9">
                        <div className="h-10 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4 md:w-1/2"></div>
                    </div>

                    <Card style="mx-4 md:ml-0 lg:ml-4">
                        <TextParagraph />
                        <Spacer height="2" />
                        <TextParagraph />
                    </Card>
                </>
                : <>
                    {/* Ingredients */}
                    {recipe?.ingredients?.length > 0 &&
                        <div className="mx-4 md:ml-0">
                            <Spacer height="10" />

                            <SecondHeading style="ml-2">
                                Zutaten für 
                                <select
                                    value={portionSize}
                                    onChange={e => setPortionSize(e.target.value)}
                                    className={
                                        'dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 '
                                        + 'border border-gray-300 dark:border-none rounded-md h-10 w-20 px-6 mx-4 '
                                        + 'transition duration-300 focus:border-primary-100 dark:after:bg-red-500'
                                    }
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
                            </SecondHeading>

                            <Spacer height="4" />

                            <Card>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                    {tmpRecipe?.ingredients?.map(ingredient =>
                                        <div key={ingredient.id} className="flex items-center justify-between">
                                            <span>
                                                {generateDisplayName(floatToFraction(ingredient.quantity_value), ingredient.quantity_unit, ingredient.name)}
                                            </span>

                                            <div className="flex flex-row">
                                                <Button 
                                                    style={'shoppinglist-' + ingredient.id} 
                                                    onClick={() => { 
                                                        handleAddSingleToShoppingList(ingredient) 
                                                        document.getElementsByClassName('shoppinglist-' + ingredient.id)[0].firstChild.innerHTML = "done" 
                                                    }}
                                                    icon="add_shopping_cart"
                                                    outlined={true}
                                                    role="tertiary"
                                                />
                                                {props.settings.data?.showPantry &&
                                                    <Button
                                                        style={'pantry-' + ingredient.id} 
                                                        onClick={() => { 
                                                            handleAddSingleToPantry(ingredient) 
                                                            document.getElementsByClassName('pantry-' + ingredient.id)[0].firstChild.innerHTML = "done" 
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

                                {props.settings.data?.showPantry &&
                                    <div className="flex justify-end mt-4">
                                        <Button
                                            icon={showPantryDone ? 'done' : 'add_home'}
                                            outlined={true}
                                            label={showPantryDone ? 'Erledigt!' : 'Alle Zutaten zum Vorrat'}
                                            onClick={() => handleAddPantry(tmpRecipe)}
                                            role="secondary"
                                            small={true}
                                        />
                                    </div>
                                }
                            </Card>
                        </div>
                    }

                    {/* Instructions */}
                    {recipe?.instructions?.length > 0 &&
                        <div className="mx-4 md:ml-0">
                            <Spacer height="10" />

                            <SecondHeading style="ml-2">Zubereitung</SecondHeading>

                            <Spacer height="4" />

                            <Card style="space-y-2">
                                {recipe?.instructions?.map((instruction, index) =>
                                    <div key={instruction.id} className="flex">
                                        <span className="mr-2">{index + 1}.</span>
                                        {instruction.instruction}
                                    </div>
                                )}
                            </Card>
                        </div>
                    }

                    {/* Show empty card if there is no image, no ingredients and no instructions */}
                    {recipe?.image === undefined && recipe?.ingredients?.length === 0 && recipe?.instructions?.length === 0 &&
                        <Card style="mx-4 md:ml-0 flex items-center">
                            <span className="material-symbols-rounded outlined mr-4">info</span>
                            Hier gibt es noch nichts zu sehen.
                        </Card>
                    }

                    <div className="mb-[5.5rem]"></div>
                </>
            }
        </div>
    )
}
