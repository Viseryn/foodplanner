import React, { ReactElement, useEffect, useState } from 'react'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import RecipeModel from '@/types/RecipeModel'
import { RecipeListSkeleton } from './components/RecipeListSkeleton'
import SearchWidget from './components/SearchWidget'
import { RecipeImageCard } from '@/pages/Recipes/components/RecipeImageCard'
import { RecipesGrid } from '@/pages/Recipes/components/RecipesGrid'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'

export function Recipes({ recipes, setSidebar, setTopbar }: {
    recipes: EntityState<Array<RecipeModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): ReactElement {
    const [searchWidgetInput, setSearchWidgetInput] = useState<string>('')

    /** @todo [Issue #101] Implement a more intelligent search with more filters. */
    const recipesFiltered: Array<RecipeModel> = recipes.isLoading
        ? []
        : recipes.data.filter(recipe => {
            if (searchWidgetInput === '' || recipe.title.toLowerCase().includes(searchWidgetInput.toLowerCase())) {
                return true
            }

            let returnValue: boolean = false

            recipe.ingredients.forEach(ingredient => {
                if (ingredient.name.toLowerCase().includes(searchWidgetInput.toLowerCase())) {
                    returnValue = true
                }
            })

            return returnValue
        })

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

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper className="md:max-w-[900px]">
            <SearchWidget
                inputValue={searchWidgetInput}
                setInputValue={setSearchWidgetInput}
                placeholder="Suche nach Rezepten ..."
            />

            <Spacer height="10" />

            {recipesFiltered.length === 0 && !recipes.isLoading
                ? <Notification color="red" title="Keine Rezepte gefunden." />
                : <RecipesGrid>
                    {recipes.isLoading
                        ? <RecipeListSkeleton />
                        : recipesFiltered.map(recipe => <RecipeImageCard key={recipe.id} recipe={recipe} />)
                    }
                </RecipesGrid>
            }

            <div className="mb-[5.5rem] md:mb-0"></div>
        </StandardContentWrapper>
    )
}
