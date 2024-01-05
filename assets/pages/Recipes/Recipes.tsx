import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import { RecipeImageCard } from '@/pages/Recipes/components/RecipeImageCard'
import { RecipesGrid } from '@/pages/Recipes/components/RecipesGrid'
import * as ViewMode from '@/pages/Recipes/types/ViewMode'
import RecipeModel from '@/types/RecipeModel'
import SettingsModel from '@/types/SettingsModel'
import { tryApiRequest } from "@/util/tryApiRequest"
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { RecipeListSkeleton } from './components/RecipeListSkeleton'
import SearchWidget from './components/SearchWidget'

export const Recipes = ({ recipes, settings, setSidebar, setTopbar }: {
    recipes: EntityState<RecipeModel[]>
    settings: EntityState<SettingsModel>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): ReactElement => {
    const [searchWidgetInput, setSearchWidgetInput] = useState<string>('')

    /** @todo [Issue #101] Implement a more intelligent search with more filters. */
    const recipesFiltered: RecipeModel[] = recipes.isLoading
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
        if (settings.isLoading) {
            return
        }

        await tryApiRequest("PATCH", `/api/settings/${settings.data.id}`, async (apiUrl) => {
            const response: AxiosResponse<SettingsModel> = await axios.patch(apiUrl, {
                recipeListViewMode: ViewMode.getSuccessor(settings.data.recipeListViewMode)
            })

            settings.setData(response.data)
            return response
        })
    }

    useEffect(() => {
        if (settings.isLoading) {
            setTopbar({ title: 'Rezepte' })
            return
        }

        setTopbar({
            title: 'Rezepte',
            actionButtons: [{
                icon: ViewMode.getIcon(settings.data.recipeListViewMode),
                onClick: handleViewMode,
            }],
            style: 'md:max-w-[900px]',
        })
    }, [settings.data?.recipeListViewMode])

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
                : <RecipesGrid viewMode={settings.data?.recipeListViewMode}>
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
