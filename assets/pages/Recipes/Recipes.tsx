import React, { ReactElement, useEffect, useState } from 'react'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import RecipeModel from '@/types/RecipeModel'
import { RecipeListSkeleton } from './components/RecipeListSkeleton'
import SearchWidget from './components/SearchWidget'
import { RecipeImageCard } from '@/pages/Recipes/components/RecipeImageCard'
import { RecipesGrid } from '@/pages/Recipes/components/RecipesGrid'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import * as ViewMode from '@/pages/Recipes/constants/ViewMode'
import SettingsModel from '@/types/SettingsModel'
import axios from 'axios'

export function Recipes({ recipes, settings, setSidebar, setTopbar }: {
    recipes: EntityState<Array<RecipeModel>>
    settings: EntityState<SettingsModel>
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

    const handleViewMode = async (): Promise<void> => {
        const response = await axios.patch(`/api/settings/${settings.data.id}`, {
            recipeListViewMode: ViewMode.toString(ViewMode.getSuccessor(ViewMode.parse(settings.data.recipeListViewMode)))
        })

        settings.setData(response.data)
    }

    useEffect(() => {
        if (settings.isLoading) {
            setTopbar({ title: 'Rezepte' })
            return
        }

        setTopbar({
            title: 'Rezepte',
            actionButtons: [{
                icon: ViewMode.getIcon(ViewMode.parse(settings.data.recipeListViewMode)),
                onClick: handleViewMode,
            }],
            style: 'md:max-w-[900px]',
        })
    }, [settings.data.recipeListViewMode])

    useEffect(() => {
        setSidebar('recipes', {
            visible: true,
            icon: 'add',
            path: '/recipe/add',
            label: 'Neues Rezept',
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
                : <RecipesGrid viewMode={ViewMode.parse(settings.data.recipeListViewMode)}>
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
