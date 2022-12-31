/************************************
 * ./assets/pages/Recipes/Recipe.js *
 ************************************/

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Heading from '../../components/ui/Heading';
import HeadingAndBackButton from '../../components/ui/HeadingAndBackButton';
import TextParagraph from '../../components/skeleton/TextParagraph';
import IconButton from '../../components/ui/Buttons/IconButton';
import Button from '../../components/ui/Buttons/Button';
import loadShoppingList from '../../util/loadShoppingList';
import generateDisplayName from '../../util/generateDisplayName';
import loadPantry from '../../util/loadPantry';

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

            newIngredient['quantity_value'] = (ingredient.quantity_value === '1/2' ? 0.5 : ingredient.quantity_value) / recipe.portion_size * portionSize;

            if (newIngredient.quantity_value === 0.5) {
                newIngredient.quantity_value = '1/2';
            } else if (newIngredient.quantity_value === 0) {
                newIngredient.quantity_value = '';
            }

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
     */
    return (
        <>
            {/* Title and close button */}
            {props.isLoadingRecipes || props.recipeIndex < 0
                ? <div className="animate-pulse mb-10">
                    <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded-full w-1/2"></div>
                </div>
                : <div className="flex justify-between items-start">
                    <div className="hidden lg:block">
                        <Heading>{recipe?.title}</Heading>
                    </div>
                    <div className="lg:hidden">
                        <HeadingAndBackButton location="/recipes">{recipe?.title}</HeadingAndBackButton>
                    </div>

                    <div className="flex justify-between">
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
                </div>
            }

            {/* Image */}
            {props.isLoadingRecipes || props.recipeIndex < 0
                ? <img className="animate-pulse rounded-3xl h-80 w-full mb-10 object-cover" src='/img/default.jpg' />
                : <>
                    {recipe?.image != null &&
                        <img 
                            className="rounded-3xl h-80 object-cover mb-10 shadow-md hover:shadow-xl transition duration-300 w-full" 
                            src={recipe?.image.directory + recipe?.image.filename}
                            alt={recipe}
                        />
                    }
                </>
            }

            {/* Ingredients, instructions and buttons */}
            {props.isLoadingRecipes || props.recipeIndex < 0
                ? <>
                    <div className="flex bg-gray-100 dark:bg-[#1D252C] shadow-md h-12 font-bold px-6 py-3 mb-6 rounded-xl">
                        <div className="animate-pulse self-center bg-gray-300 dark:bg-gray-700 w-48 h-2.5 rounded-full"></div>
                    </div>

                    <TextParagraph />
                </>
                : <>
                    {recipe?.ingredients?.length > 0 &&
                        <div className="mb-10">
                            <div className="bg-gray-100 dark:bg-[#1D252C] shadow-md font-bold px-6 py-3 mb-3 rounded-xl">
                                Zutaten für 
                                <select
                                    className="dark:placeholder-gray-400 dark:bg-[#323a41] border border-gray-400 dark:border-none rounded-full h-10 w-20 mx-4 px-6 shadow-sm dark:shadow-md transition duration-300 focus:border-blue-600"
                                    value={portionSize}
                                    onChange={e => setPortionSize(e.target.value)}
                                >
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
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                {tmpRecipe?.ingredients.map(ingredient =>
                                    <div key={ingredient.id} className="pl-6 pt-2 flex items-center justify-between">
                                        <span>
                                            {generateDisplayName(ingredient.quantity_value, ingredient.quantity_unit, ingredient.name)}
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
                        </div>
                    }

                    {recipe?.instructions?.length > 0 &&
                        <div className="mb-10">
                            <div className="bg-gray-100 dark:bg-[#1D252C] shadow-md font-bold px-6 py-3 mb-5 rounded-xl">
                                Zubereitung
                            </div>
                            <div className="space-y-2">
                                {recipe?.instructions.map((instruction, index) =>
                                    <div key={instruction.id} className="flex px-6">
                                        <span className="mr-2">{index + 1}.</span>
                                        {instruction.instruction}
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    {recipe?.image === undefined && recipe?.ingredients?.length === 0 && recipe?.instructions?.length === 0 &&
                        <div className="text-gray-400 mb-6">
                            Hier gibt es noch nichts zu sehen.
                        </div>
                    }

                    <div className="flex flex-col md:flex-row items-start justify-end gap-4 mt-auto ">
                        {props.settings.showPantry &&
                            <Button
                                icon={showPantryButton ? 'add_home' : 'done'}
                                outlined={true}
                                label={showPantryButton ? 'Zum Vorrat' : 'Erledigt!'}
                                onClick={() => handleAddPantry(tmpRecipe)}
                                role="tertiary"
                                small={true}
                            />
                        }
                        <Button
                            location={`/recipe/${recipe?.id}/edit`}
                            icon="edit"
                            outlined={true}
                            label="Bearbeiten"
                            role="tertiary"
                            small={true}
                        />
                    </div>
                </>
            }
        </>
    );
}
