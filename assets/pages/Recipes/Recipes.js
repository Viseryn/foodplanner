/*************************************
 * ./assets/pages/Recipes/Recipes.js *
 *************************************/

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

import Notification from '../../components/ui/Notification';
import Recipe from './Recipe';

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
 */
export default function Recipes(props) {
    /**
     * State variables
     */
    const { id } = useParams();
    const location = useLocation();
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [isTwoColumns, setTwoColumns] = useState(id > 0);
    const [recipeId, setRecipeId] = useState(id);

    /**
     * Sidebar props for the Recipe component
     */
    const setSidebarProps = {
        'setSidebarActiveItem': props.setSidebarActiveItem, 
        'setSidebarActionButton': props.setSidebarActionButton,
    };
    
    /**
     * Search for user input in recipe list
     */
    const recipesFiltered = recipes.filter(recipe => {
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
     * On render, do the following:
     */
    useEffect(() => {
        // Load Sidebar
        props.setSidebarActiveItem('recipes');

        // Only load SAB if no Recipe is chosen
        if (! recipeId > 0) { 
            resetSAB();
        }

        // Call the Recipe List API and load the Recipe
        // data into the state variable.
        axios
            .get('/api/recipes')
            .then(response => {
                setRecipes(JSON.parse(response.data));
                setLoading(false);
            });
    }, []);
    
    /**
     * Render
     */
    return (
        <>
            {/* The first column is always shown when no Recipe is chosen.
                If a Recipe is chosen, it is only shown on lg-screens or larger. */}
            <div className={
                'mx-6 md:ml-0 pb-24 md:pb-0 my-6 w-full '
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
                {isLoading
                    ? <RecipeListSkeleton isTwoColumns={isTwoColumns} />
                    : <>
                        {recipesFiltered.length === 0 &&
                            <Notification color="red">Keine Rezepte gefunden.</Notification>
                        }

                        <div className={
                            'grid grid-cols-1 gap-2 ' 
                            + (!isTwoColumns && 'sm:grid-cols-3 md:grid-cols-3')
                        }>
                            {recipesFiltered.map(recipe => 
                                <div key={recipe.id} className="h-36 w-full shadow-md rounded-2xl transition duration-300">
                                    <div className="relative group cursor-pointer" onClick={() => {
                                        setTwoColumns(true);
                                        setRecipeId(recipe.id);
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
                        key={recipeId}
                        id={recipeId} 
                        setTwoColumns={() => {
                            setTwoColumns(false);
                            resetSAB();
                        }} 
                        {...setSidebarProps} 
                    />
                </div>
            }
        </>
    );
}

/**
 * RecipeListSkeleton
 * 
 * A component that renders a skeleton for the recipe list
 * when it is still loading. 
 * 
 * @todo Make this a (partly) reusable component.
 * 
 * @component
 * @property {boolean} isTwoColumn Whether two-column mode is active.
 */
function RecipeListSkeleton(props) {
    return (
        <div className={
            'grid grid-cols-1 gap-2 animate-pulse ' 
            + (!props.isTwoColumns && 'sm:grid-cols-3 md:grid-cols-3')
        }>
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/50 dark:bg-gray-700/50" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/50 dark:bg-gray-700/50" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/50 dark:bg-gray-700/50" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
        </div>
    );
}
