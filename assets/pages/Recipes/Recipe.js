/************************************
 * ./assets/pages/Recipes/Recipe.js *
 ************************************/

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Heading, { SubHeading, SecondHeading } from '../../components/ui/Heading';
import HeadingAndBackButton from '../../components/ui/HeadingAndBackButton';
import TextParagraph from '../../components/skeleton/TextParagraph';
import IconButton from '../../components/ui/Buttons/IconButton';
import Button from '../../components/ui/Buttons/Button';
import loadShoppingList from '../../util/loadShoppingList';
import generateDisplayName from '../../util/generateDisplayName';
import loadPantry from '../../util/loadPantry';
import { floatToFraction, fractionToFloat } from '../../util/fractions';
import Spacer from '../../components/ui/Spacer';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

/**
 * Recipe
 * 
 * A component for showing a Recipe.
 * Collects the data from the Recipe Show API 
 * in /src/Controller/RecipeController.php.
 * 
 * This component is used in the Recipes component
 * and may not be used as standalone.
 * 
 * @component
 * @property {number} id The id of the recipe.
 * @property {function} setTwoColumns A function that sets the state isTwoColumns to false and resets the SAB.
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} recipes 
 * @property {boolean} isLoadingRecipes
 * @property {function} setLoadingRecipes
 * @property {number} recipeIndex
 * @property {function} setLoadingShoppingList
 */
export default function Recipe(props) {
    /**
     * State variables
     */
    const [buttonCounter, setButtonCounter] = useState(0);
    const [showButton, setShowButton] = useState(true);
    const [showPantryButton, setShowPantryButton] = useState(true);
    const [recipe, setRecipe] = useState([]);
    const [tmpRecipe, setTmpRecipe] = useState([]);
    const [portionSize, setPortionSize] = useState(0);

    /**
     * handleAddShoppingList
     * 
     * Handles a click on the "Add to Shopping List" button.
     */
    const handleAddShoppingList = (argRecipe) => {
        axios
            .post('/api/shoppinglist/add', JSON.stringify([argRecipe]))
            .then(() => props.setLoadingShoppingList(true))
        ;
        
        setShowButton(false);
        setButtonCounter(buttonCounter => {
            return buttonCounter + 1;
        });
    };

    /**
     * handleAddPantry
     * 
     * Handles a click on the "Add to Pantry" button.
     */
    const handleAddPantry = (argRecipe) => {
        axios
            .post('/api/pantry/add', JSON.stringify([argRecipe]))
            .then(() => props.setLoadingPantry(true))
        ;
        
        setShowPantryButton(false);
    };

    /**
     * Calculate the ingredient quantities depending on selected portionSize
     */
    useEffect(() => {
        if(props.isLoadingRecipes) return;

        let newRecipe = {...recipe};
        newRecipe.ingredients = [];
        newRecipe.portion_size = portionSize;

        recipe?.ingredients?.forEach(ingredient => {
            let newIngredient = {...ingredient};

            newIngredient['quantity_value'] = fractionToFloat(ingredient.quantity_value) / recipe.portion_size * portionSize;

            newRecipe.ingredients.push(newIngredient);
        });

        // Set the new calculated recipe in tmpRecipe.
        // This does NOT trigger a reassignment of portionSize.
        setTmpRecipe(newRecipe);
    }, [portionSize]);
    
    /**
     * handleAddSingleToShoppingList
     */
    const handleAddSingleToShoppingList = (ingredient) => {
        const newItem = { 
            name: generateDisplayName(
                ingredient.quantity_value,
                ingredient.quantity_unit,
                ingredient.name,
            ),
        };

        axios
            .post('/api/shoppinglist/ingredients', newItem)
            .then(() => {
                loadShoppingList(props.setShoppingList);
            })
        ;
    }

    /**
     * handleAddSingleToPantry
     */
    const handleAddSingleToPantry = (ingredient) => {
        const newItem = { 
            name: generateDisplayName(
                ingredient.quantity_value,
                ingredient.quantity_unit,
                ingredient.name,
            ),
        };

        axios
            .post('/api/pantry/ingredients', newItem)
            .then(() => {
                loadPantry(props.setPantry);
            })
        ;
    }

    /** 
     * Load sidebar
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebarActiveItem('recipes');

        // Scroll to top
        window.scrollTo(0, 0);
    }, []);

    /**
     * Update SidebarActionButton when recipe changes
     * or button is clicked (i.e., showButton is set to false).
     */
    useEffect(() => {
        if (!props.isLoadingRecipes) {
            props.setSidebarActionButton({
                visible: true, 
                icon: showButton ? 'add_shopping_cart' : 'done', 
                label: showButton 
                    ? 'Zur Einkaufsliste' 
                    : ('Erledigt!' + (buttonCounter > 1 
                        ? ' (' + buttonCounter + ')' 
                        : '')
                    ),
                onClickHandler: () => handleAddShoppingList(tmpRecipe),
            });
        }
    }, [recipe, showButton, buttonCounter, tmpRecipe]);

    /**
     * Put the selected recipe in a local state 
     * variable as an abbreviation. A copy is also 
     * stored in tmpRecipe.
     */
    useEffect(() => {
        setRecipe(props.recipes[props.recipeIndex]);
        setTmpRecipe(props.recipes[props.recipeIndex]);
        
        // Set initial portion size
        setPortionSize(recipe?.portion_size);
    }, [props.recipeIndex, recipe]);

    /**
     * Render
     * 
     * @todo Update skeletons!
     */
    return (
        <div className="">
            {/* Title and close button */}
            {props.isLoadingRecipes || props.recipeIndex < 0
                ? <div className="animate-pulse p-4 md:px-0 md:pt-9">
                    <div className="h-9 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4 md:w-1/2"></div>
                </div>
                : <div className="flex justify-between items-start p-4 md:px-0 md:pt-9 lg:px-4">
                    <div className="hidden lg:block">
                        <Heading>{recipe?.title}</Heading>
                    </div>

                    <div className="lg:hidden">
                        <HeadingAndBackButton location="/recipes">{recipe?.title}</HeadingAndBackButton>
                    </div>

                    <Link to="/recipes">
                        {/* Button for resetting two-column mode */}
                        <IconButton 
                            style="hidden lg:block" 
                            onClick={() => props.setTwoColumns()}
                        >
                            close
                        </IconButton>
                    </Link>
                </div>
            }

            <Spacer height="6" />

            {/* Image */}
            <div className="px-4 md:pl-0 lg:pl-4">
                {props.isLoadingRecipes || props.recipeIndex < 0
                    ? <img className="animate-pulse rounded-3xl h-80 w-full object-cover" src='/img/default.jpg' />
                    : <>
                        {recipe?.image != null &&
                            <img 
                                className="rounded-3xl h-80 object-cover transition duration-300 w-full" 
                                src={recipe?.image.directory + recipe?.image.filename}
                                alt={recipe}
                            />
                        }
                    </>
                }
            </div>

            {/* Ingredients, instructions and buttons */}
            {props.isLoadingRecipes || props.recipeIndex < 0
                ? <>
                    <Spacer height="8" />
                    <div className="animate-pulse p-4 md:px-0 md:pt-9">
                        <div className="h-9 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4 md:w-1/2"></div>
                    </div>
                    <Card style="mx-4 md:ml-0 lg:ml-4">
                        <TextParagraph />
                    </Card>
                </>
                : <>
                    {/* Ingredients */}
                    {recipe?.ingredients?.length > 0 &&
                        <>
                            <div className="mb-4 mx-6 md:ml-2 lg:ml-6 mt-10">
                                <SecondHeading>
                                    Zutaten für 
                                        <select
                                            className="dark:placeholder-gray-400 dark:bg-[#323a41] border border-gray-400 dark:border-none rounded-full h-10 w-20 mx-4 px-6 shadow-sm dark:shadow-md transition duration-300 focus:border-blue-600"
                                            value={portionSize}
                                            onChange={e => setPortionSize(e.target.value)}
                                        > {/** @todo Colors for select widget! */}
                                            {[...Array(10)].map((x, index) => 
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
                            </div>
                            <Card style="mx-4 md:ml-0 lg:ml-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-6">
                                    {tmpRecipe?.ingredients.map(ingredient =>
                                        <div key={ingredient.id} className="flex items-center justify-between">
                                            <span>
                                                {generateDisplayName(floatToFraction(ingredient.quantity_value), ingredient.quantity_unit, ingredient.name)}
                                            </span>

                                            <div className="flex flex-row">
                                                <Button 
                                                    style={'shoppinglist-' + ingredient.id} 
                                                    onClick={() => { 
                                                        handleAddSingleToShoppingList(ingredient); 
                                                        document.getElementsByClassName('shoppinglist-' + ingredient.id)[0].firstChild.innerHTML = "done"; 
                                                    }}
                                                    icon="add_shopping_cart"
                                                    outlined={true}
                                                    role="tertiary"
                                                />
                                                {props.settings.showPantry &&
                                                    <Button
                                                        style={'pantry-' + ingredient.id} 
                                                        onClick={() => { 
                                                            handleAddSingleToPantry(ingredient); 
                                                            document.getElementsByClassName('pantry-' + ingredient.id)[0].firstChild.innerHTML = "done"; 
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

                            {props.settings.showPantry &&
                                <div className="flex justify-end mt-4">
                                    <Button
                                        icon={showPantryButton ? 'add_home' : 'done'}
                                        outlined={true}
                                        label={showPantryButton ? 'Alle Zutaten zum Vorrat' : 'Erledigt!'}
                                        onClick={() => handleAddPantry(tmpRecipe)}
                                        role="secondary"
                                        small={true}
                                    />
                                </div>
                            }
                            </Card>
                        </>
                    }

                    {/* Instructions */}
                    {recipe?.instructions?.length > 0 &&
                        <div className="mt-10">
                            <div className="mb-4 mx-6 md:ml-2 lg:ml-6">
                                <SecondHeading>
                                    Zubereitung
                                </SecondHeading>
                            </div>
                            <Card style="space-y-2 mx-4 md:ml-0 lg:ml-4">
                                {recipe?.instructions.map((instruction, index) =>
                                    <div key={instruction.id} className="flex -px-6">
                                        <span className="mr-2">{index + 1}.</span>
                                        {instruction.instruction}
                                    </div>
                                )}
                            </Card>
                        </div>
                    }

                    {/* Show empty card if there is no image, no ingredients and no instructions */}
                    {recipe?.image === undefined && recipe?.ingredients?.length === 0 && recipe?.instructions?.length === 0 &&
                        <Card style="mx-4 md:ml-0 lg:ml-4">
                            Hier gibt es noch nichts zu sehen.
                        </Card>
                    }

                    {/* Edit Button */}
                    <div className="flex justify-end px-4 pt-6">
                        <Button
                            location={`/recipe/${recipe?.id}/edit`}
                            icon="edit"
                            outlined={true}
                            label="Rezept bearbeiten"
                            role="tertiary"
                            small={true}
                        />
                    </div>
                </>
            }
        </div>
    );
}
