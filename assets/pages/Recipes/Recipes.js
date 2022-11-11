/*************************************
 * ./assets/pages/Recipes/Recipes.js *
 *************************************/

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import Notification from '../../components/ui/Notification';
import Recipe from './Recipe';
import RecipeListSkeleton from './components/RecipeListSkeleton';

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
     * Sidebar props for the Recipe component
     */
    const setSidebarProps = {
        'setSidebarActiveItem': props.setSidebarActiveItem, 
        'setSidebarActionButton': props.setSidebarActionButton,
    };

    /**
     * Recipe props 
     */
    const setRecipesProps = {
        'recipes': props.recipes,
        'setRecipes': props.setRecipes,
        'isLoadingRecipes': props.isLoadingRecipes,
        'setLoadingRecipes': props.setLoadingRecipes,
        'recipeIndex': props.recipeIndex,
        'setRecipeIndex': props.setRecipeIndex,
    }
    
    /**
     * Search for user input in recipe list
     */
    const recipesFiltered = props.recipes.filter(recipe => {
        if (searchValue === '') {
            return recipe;
        } else {
            // Return true if recipe includes the search input value.
            // Put both to lowercase, so the searchValue is not case-sensitive.
            return recipe.title.toLowerCase().includes(searchValue.toLowerCase());
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
            icon:'add', 
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
    });
    
    /**
     * Render
     */
    return (
        <>
            {/* The first column is always shown when no Recipe is chosen.
                If a Recipe is chosen, it is only shown on lg-screens or larger. */}
            <div className={
                'mx-6 md:ml-0 pb-16 md:pb-0 my-6 w-full '
                + (isTwoColumns
                    ? 'hidden lg:block max-w-[400px]'
                    : 'max-w-[900px]'
                )
            }>
                {/* Search bar */}
                <div className="mb-4 rounded-full bg-white dark:bg-[#29353f] h-16 flex items-center pl-6 pr-4">
                    <span className="material-symbols-rounded mr-2 cursor-default">search</span>
                    <input 
                        className="dark:bg-[#29353f] dark:placeholder-gray-400 w-full border-transparent focus:border-transparent focus:ring-0"
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
                            className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#232325] p-2 rounded-full"
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
                                <div key={recipe.id} className="h-36 w-full shadow-md rounded-2xl transition duration-300">
                                    <div className="relative group cursor-pointer" onClick={() => {
                                        setTwoColumns(true);
                                    }}>
                                        <Link to={'/recipe/' + recipe.id}>
                                            <img 
                                                className="rounded-2xl h-36 w-full object-cover brightness-[.7]" 
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
                <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:max-w-[900px]">
                    {/* Pass a function setTwoColumns to the Recipe, so that it 
                        can deactive the two-column mode. Resets the SAB afterwards. */}
                    <Recipe 
                        key={id}
                        id={id} 
                        setTwoColumns={() => {
                            setTwoColumns(false);
                            resetSAB();
                        }} 
                        {...setSidebarProps} 
                        {...setRecipesProps}
                    />
                </div>
            }
        </>
    );
}
