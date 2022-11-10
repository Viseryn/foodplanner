/************************************
 * ./assets/pages/Recipes/Recipe.js *
 ************************************/

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Heading from '../../components/ui/Heading';
import TextParagraph from '../../components/skeleton/TextParagraph';

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
 * @property {function} setRecipes
 * @property {boolean} isLoadingRecipes
 * @property {function} setLoadingRecipes
 * @property {number} recipeIndex
 * @property {function} setRecipeIndex
 */
export default function Recipe(props) {
    /**
     * State variables
     */
    const [buttonCounter, setButtonCounter] = useState(0);
    const [showButton, setShowButton] = useState(true);
    const [recipe, setRecipe] = useState([]);

    /**
     * handleAddShoppingList
     * 
     * Handles a click on the "Add to Shopping List" button.
     */
    const handleAddShoppingList = () => {
        const recipes = [props.recipes[props.recipeIndex]];
        axios.post('/api/shoppinglist/add', JSON.stringify(recipes));
        setShowButton(false);
        setButtonCounter(buttonCounter => {
            return buttonCounter + 1;
        });
    };

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
                onClickHandler: handleAddShoppingList,
            });
        }
    }, [recipe, showButton, buttonCounter]);

    /**
     * Put the selected recipe in a local state 
     * variable as an abbreviation.
     */
    useEffect(() => {
        setRecipe(props.recipes[props.recipeIndex]);
    });

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
                    <Heading>{recipe?.title}</Heading>

                    <div className="flex justify-between">
                        <Link to={'/recipe/' + recipe?.id + '/edit'}>
                            <span 
                                className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#232325] p-2 rounded-full"
                            >
                                drive_file_rename_outline
                            </span>
                        </Link>
                        <Link to="/recipes">
                            {/* Button for resetting two-column mode */}
                            <span 
                                className="hidden md:block material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#232325] p-2 rounded-full"
                                onClick={() => { props.setTwoColumns(); }}
                            >
                                close
                            </span>
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
                                {recipe?.portion_size == 1 
                                    ? ' eine Portion'
                                    : ' ' + recipe?.portion_size + ' Portionen'
                                }
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {recipe?.ingredients.map(ingredient =>
                                    <div key={ingredient.id} className="px-6 pt-2">
                                        {(ingredient.quantity_value ?? '')
                                            + ' ' + (ingredient.quantity_unit ?? '')
                                            + ' ' + ingredient.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    }

                    {recipe?.instructions?.length > 0 &&
                        <div className="mb-6">
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
                </>
            }
        </>
    );
}
