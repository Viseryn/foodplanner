/**************************************
 * ./assets/pages/Recipes/Recipes.tsx *
 **************************************/

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import RecipeListSkeleton from './components/RecipeListSkeleton'
import SearchWidget from './components/SearchWidget'
import RecipeModel from '@/types/RecipeModel'

/**
 * Recipes
 * 
 * A component that renders a list of all recipes. At the top, a search bar 
 * can be used to filter the list by recipe title and ingredient names.
 * 
 * @component
 */
export default function Recipes({ recipes, setSidebar, setTopbar }: {
    recipes: FetchableEntity<Array<RecipeModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // The current input in the search input field.
    const [searchValue, setSearchValue] = useState<string>('')
    
    /**
     * The list of recipes filtered by the searchValue. Currently, the filter
     * looks for the title of the recipe and the ingredient names of a recipe.
     * 
     * @todo Implement a more intelligent search with more filters.
     */
    const recipesFiltered: Array<RecipeModel> = recipes.isLoading 
        ? []
        : recipes.data.filter(recipe => {
            // Return true if there is no search input
            if (searchValue === '') {
                return true
            }
            
            // Return true if recipe includes the search input value.
            // Put both to lowercase so that the searchValue is not case-sensitive.
            if (recipe.title.toLowerCase().includes(searchValue.toLowerCase())) {
                return true
            }

            // If the block above did not return, check for ingredients
            let returnValue: boolean = false

            // Return true if the search input value appears in ingredients.
            // Put both to lowercase so that the searchValue is not case-sensitive.
            recipe.ingredients.forEach(ingredient => {
                if (ingredient.name.toLowerCase().includes(searchValue.toLowerCase())) {
                    returnValue = true
                }
            })

            // Return true if searchValue appeared in an ingredient
            return returnValue
        })

    // Load layout
    useEffect(() => {
        setSidebar('recipes', {
            visible: true,
            icon: 'add',
            path: '/recipe/add',
            label: 'Neues Rezept',
        })

        setTopbar({
            title: 'Rezepte',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])
    
    // Render Recipes
    return <div className="pb-24 md:pb-4 max-w-[900px]">
        <div className="mx-4 md:ml-0">
            <Spacer height="6" />

            {/* Search bar */}
            <SearchWidget
                inputValue={searchValue}
                setInputValue={setSearchValue}
                placeholder="Suche nach Rezepten ..."
            />
            
            <Spacer height="10" />

            {/* Recipe List */}
            {recipes.isLoading
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
                                            src={recipe.image
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
}
