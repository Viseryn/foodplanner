/*************************************
 * ./assets/pages/Recipes/Recipes.js *
 *************************************/

import React, { useEffect, useState }   from 'react';
import { Link }                         from 'react-router-dom';

import Notification                     from '../../components/ui/Notification';
import RecipeListSkeleton               from './components/RecipeListSkeleton';
import Spacer                           from '../../components/ui/Spacer';

/**
 * Recipes
 * 
 * A Component for showing a list of all Recipes.
 * Collects the Recipe data from the Recipe List API.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {function} setTopbar
 * @property {arr} recipes 
 * @property {boolean} isLoadingRecipes
 */
export default function Recipes(props) {
    /**
     * State variables
     */
    const [searchValue, setSearchValue] = useState('');
    
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
    })

    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebarActiveItem('recipes')
        props.setSidebarActionButton({
            visible: true,
            icon: 'add',
            path: '/recipe/add',
            label: 'Neues Rezept',
        })

        // Load topbar
        props.setTopbar({
            title: 'Rezepte',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])
    
    /**
     * Render
     */
    return (
        <div className="pb-24 md:pb-4 max-w-[900px]">
            <div className="mx-4 md:ml-0">
                <Spacer height="6" />

                {/* Search bar */}
                <div className="rounded-full flex items-center h-14 pl-6 pr-4 font-semibold bg-secondary-100 dark:bg-secondary-dark-100">
                    <span className="material-symbols-rounded mr-2 cursor-default">search</span>
                    <input 
                        className="bg-secondary-100 dark:bg-secondary-dark-100 placeholder-[#55624c] dark:placeholder-secondary-dark-300 w-full border-transparent focus:border-transparent focus:ring-0"
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
                
                <Spacer height="10" />

                {/* Recipe List */}
                {props.isLoadingRecipes
                    ? <RecipeListSkeleton />
                    : <>
                        {recipesFiltered.length === 0 &&
                            <Notification color="red" title="Keine Rezepte gefunden." />
                        }

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {recipesFiltered.map(recipe => 
                                <div key={recipe.id} className="h-36 w-full rounded-xl transition duration-300">
                                    <div className="relative group cursor-pointer">
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

                <div className="mb-[5.5rem] md:mb-0"></div>
            </div>
        </div>
    )
}
