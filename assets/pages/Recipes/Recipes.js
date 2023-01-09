/*************************************
 * ./assets/pages/Recipes/Recipes.js *
 *************************************/

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import Notification from '../../components/ui/Notification';
import Recipe from './Recipe';
import RecipeListSkeleton from './components/RecipeListSkeleton';
import Heading from '../../components/ui/Heading';

/**
 * Recipes
 * 
 * A Component for showing a list of all Recipes.
 * Collects the Recipe data from the Recipe List API
 * in the /src/Controller/RecipeController.php.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} recipes 
 * @property {function} setRecipes
 * @property {boolean} isLoadingRecipes
 * @property {function} setLoadingRecipes
 * @property {number} recipeIndex
 * @property {function} setRecipeIndex
 * @property {arr} shoppingList 
 * @property {function} setShoppingList
 * @property {boolean} isLoadingShoppingList
 * @property {function} setLoadingShoppingList
 */
export default function Recipes(props) {
    /**
     * State variables
     */
    const { id } = useParams();
    const location = useLocation();

    const [searchValue, setSearchValue] = useState('');
    const [isTwoColumns, setTwoColumns] = useState(id > 0);
    
    /**
     * Search for user input in recipe list
     */
    const recipesFiltered = props.recipes.filter(recipe => {
        if (searchValue === '') {
            return true;
        } else {
            // Return true if recipe includes the search input value.
            // Put both to lowercase so that the searchValue is not case-sensitive.
            if (recipe.title.toLowerCase().includes(searchValue.toLowerCase())) {
                return true;
            }

            // If the block above did not return:
            let returnValue = false;

            // Return true if the search input value appears in ingredients.
            // Put both to lowercase so that the searchValue is not case-sensitive.
            recipe.ingredients.forEach(ingredient => {
                if (ingredient.name.toLowerCase().includes(searchValue.toLowerCase())) {
                    returnValue = true;
                }
            });

            // Return true if searchValue appeared in an ingredient
            return returnValue;
        }
    });

    /**
     * resetSAB
     * 
     * A function for resetting the standard SAB for this page.
     */
    const resetSAB = () => {
        props.setSidebarActionButton({
            visible: true, 
            icon: 'add', 
            path: '/recipe/add',
            label: 'Neues Rezept',
        }); 
    };
 
    /**
     * When route changes to /recipes, close currently opened recipe
     */
    useEffect(() => {
        if (location.pathname === '/recipes') {
            setTwoColumns(false);
            resetSAB();
        } 
    }, [location]);

    /**
     * On first render, load sidebar and 
     * reset SAB if no recipe is chosen.
     */
    useEffect(() => {
        // Load Sidebar
        props.setSidebarActiveItem('recipes');

        // Only load SAB if no Recipe is chosen
        if (!id) { 
            resetSAB();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }, []);

    /**
     * When recipes are loaded, on each re-render, 
     * check if there is a recipe with the id parameter.
     * If yes, set the index of that recipe to the 
     * global state variable recipeIndex, which is 
     * passed to <Recipe />. If no, redirect to an
     * Error 404 page.
     */
    useEffect(() => {
        if (!props.isLoadingRecipes) {
            let returnVal;

            props.recipes.forEach((recipe, index) => {
                if (recipe.id == id) {
                    returnVal = index;
                }
            });

            if (returnVal >= 0) {
                props.setRecipeIndex(returnVal);
            } else if (id) {
                window.location = "/error/404";
            }
        }
    }, [props.isLoadingRecipes, id]);
    
    /**
     * Render
     */
    return (
        <>
            {/* The first column is always shown when no Recipe is chosen.
                If a Recipe is chosen, it is only shown on lg-screens or larger. */}
            <div className={
                'pb-[11.5rem] md:pb-4 px-4 md:pl-0 lg:mr-2 w-full min-h-screen '
                + (isTwoColumns
                    ? 'hidden lg:block max-w-[400px] md:pr-0'
                    : 'max-w-[900px]'
                )
            }>
                {/* Heading on smaller screens */}
                <div className="md:hidden px-2 pt-4 pb-6">
                    <Heading>Rezepte</Heading>
                </div>

                {/* Search bar */}
                <div className="mb-4 md:mt-7 rounded-full font-semibold bg-secondary-100 dark:bg-secondary-dark-100 h-14 flex items-center pl-6 pr-4">
                    <span className="material-symbols-rounded mr-2 cursor-default">search</span>
                    <input 
                        className="bg-secondary-100 dark:bg-secondary-dark-100 dark:placeholder-secondary-dark-300 w-full border-transparent focus:border-transparent focus:ring-0"
                        placeholder='Suche nach Rezepten ...'
                        id='search'
                        name='search'
                        type='text'
                        value={searchValue}
                        onChange={e => {
                            setSearchValue(e.target.value);
                        }} 
                    />
                    {searchValue !== '' &&
                        <span 
                            className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 p-2 rounded-full"
                            onClick={() => setSearchValue('')}
                        >close</span>
                    }
                </div>

                {/* Recipe List */}
                {props.isLoadingRecipes
                    ? <RecipeListSkeleton isTwoColumns={isTwoColumns} />
                    : <>
                        {recipesFiltered.length === 0 &&
                            <Notification color="red" title="Keine Rezepte gefunden." />
                        }

                        <div className={
                            'grid grid-cols-1 gap-2 ' 
                            + (!isTwoColumns && 'sm:grid-cols-3 md:grid-cols-3')
                        }>
                            {recipesFiltered.map(recipe => 
                                <div key={recipe.id} className="h-36 w-full rounded-xl transition duration-300">
                                    <div className="relative group cursor-pointer" onClick={() => {
                                        setTwoColumns(true);
                                    }}>
                                        <Link to={'/recipe/' + recipe.id}>
                                            <img 
                                                className="rounded-xl h-36 w-full object-cover brightness-[.7]" 
                                                src={recipe.image?.filename != null 
                                                    ? recipe.image?.directory + recipe.image?.filename
                                                    : '/img/default.jpg'
                                                } 
                                                alt={recipe.title}
                                            />
                                            <div className="absolute w-full bottom-4 px-6 text-white font-semibold text-xl">
                                                {recipe.title}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                }
            </div>

            {/* Second column is always shown when a Recipe is chosen. */}
            {isTwoColumns && 
                // <div className="flex flex-col px-6 pb-[6.5rem] pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-secondary-100 dark:bg-[#29353f] md:rounded-xl md:max-w-[900px]"></div>
                <div className="flex flex-col pb-[11.5rem] w-full min-h-screen md:min-h-fit md:max-w-[900px]">
                    {/* Pass a function setTwoColumns to the Recipe, so that it 
                        can deactive the two-column mode. Resets the SAB afterwards. */}
                    <Recipe 
                        key={id}
                        id={id} 
                        setTwoColumns={() => {
                            setTwoColumns(false);
                            resetSAB();
                        }} 
                        {...props}
                    />
                </div>
            }
        </>
    );
}
