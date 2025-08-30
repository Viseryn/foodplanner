import Button from "@/components/ui/Buttons/Button"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SettingsContext } from "@/context/SettingsContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { UserContext } from "@/context/UserContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { useScrollCache } from "@/hooks/useScrollCache"
import { stateCacheStore, useStateCache } from "@/hooks/useStateCache"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { RecipeImageCard } from "@/pages/Recipes/components/RecipeImageCard"
import { RecipesGrid } from "@/pages/Recipes/components/RecipesGrid"
import * as ViewMode from "@/pages/Recipes/types/ViewMode"
import { Recipe } from "@/types/api/Recipe"
import { Settings } from "@/types/api/Settings"
import { User } from "@/types/api/User"
import { ComponentLoadingState } from "@/types/enums/ComponentLoadingState"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResource } from "@/types/ManagedResource"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement, useCallback, useEffect, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { RecipeListSkeleton } from "./components/RecipeListSkeleton"
import SearchWidget from "./components/SearchWidget"

export const RecipeListPage = (): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const settings: ManagedResource<Settings> = useNullishContext(SettingsContext)
    const user: ManagedResource<User> = useNullishContext(UserContext)
    const { recipes }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)

    const [isLoading, setLoading] = useState<ComponentLoadingState>(ComponentLoadingState.WAITING)

    const [searchWidgetInput, setSearchWidgetInput] = useState<string>("")

    const navigate: NavigateFunction = useNavigate()

    const onlyFavorites: boolean = useStateCache(state => state.onlyShowFavoriteRecipes)
    const toggleFavorites = useCallback((): void => {
        stateCacheStore.getState().toggle("onlyShowFavoriteRecipes")
    }, [])

    /** @todo [Issue #101] Implement a more intelligent search with more filters. */
    const recipesFiltered: Recipe[] = recipes.isLoading
        ? []
        : recipes.data.filter(recipe => {
            if (onlyFavorites && !user.data?.recipeFavorites.includes(recipe["@id"])) {
                return false
            }

            if (searchWidgetInput === "" || recipe.title.toLowerCase().includes(searchWidgetInput.toLowerCase())) {
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

        setLoading(ComponentLoadingState.LOADING)

        settings.setData({
            ...settings.data,
            recipeListViewMode: ViewMode.getSuccessor(settings.data.recipeListViewMode),
        })

        await ApiRequest
            .patch<Settings>(`/api/users/me/settings`, {
                recipeListViewMode: ViewMode.getSuccessor(settings.data.recipeListViewMode),
            })
            .ifSuccessful(settings.setData)
            .execute()

        setLoading(ComponentLoadingState.WAITING)
    }

    useEffect(() => {
        if (settings.isLoading) {
            topbar.configuration
                  .title("Rezepte")
                  .mainViewWidth("md:max-w-[900px]")
                  .rebuild()
            return
        }

        topbar.configuration
              .title("Rezepte")
              .actionButtons([
                  { icon: ViewMode.getIcon(settings.data.recipeListViewMode), onClick: handleViewMode },
              ])
              .dropdownMenuItems([
                  { icon: "upload", label: "Rezepte importieren", onClick: () => navigate(`/recipe/import`) },
                  { icon: "restore_from_trash", label: "Gelöschte Rezepte ansehen", onClick: () => navigate(`/recipes/restore`) },
              ])
              .mainViewWidth("md:max-w-[700px]")
              .rebuild()
    }, [settings.data?.recipeListViewMode])

    useScrollCache("recipes")

    useEffect(() => {
        sidebar.configuration
               .activeItem("recipes")
               .actionButton({
                   isVisible: true,
                   icon: "add",
                   path: "/recipe/add",
                   label: "Neues Rezept",
               })
               .rebuild()
    }, [])

    return (
        <StandardContentWrapper>
            <div className="flex items-center gap-1">
                <SearchWidget
                    inputValue={searchWidgetInput}
                    setInputValue={setSearchWidgetInput}
                    placeholder="Suche nach Rezepten ..."
                />

                <Button
                    icon="cards_star"
                    role={onlyFavorites ? "primary" : "secondary"}
                    roundedLeft={onlyFavorites}
                    onClick={toggleFavorites}
                    className={"h-14 w-14 flex justify-center rounded-full transition-all duration-300"}
                />
            </div>

            <Spacer height="6" />

            {recipesFiltered.length === 0 && !recipes.isLoading
                ? <Notification color="red" title="Keine Rezepte gefunden." />
                : <RecipesGrid viewMode={settings.data?.recipeListViewMode}>
                    {recipes.isLoading || isLoading === ComponentLoadingState.LOADING
                        ? <RecipeListSkeleton />
                        : recipesFiltered.map(recipe => <RecipeImageCard key={recipe.id} recipe={recipe} />)
                    }
                </RecipesGrid>
            }

            <div className="mb-[5.5rem] md:mb-0"></div>
        </StandardContentWrapper>
    )
}
