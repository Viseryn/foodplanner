import Button from "@/components/ui/Buttons/Button"
import Heading from "@/components/ui/Heading"
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
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { RecipeImageCard } from "@/pages/Recipes/components/RecipeImageCard"
import { RecipesGrid } from "@/pages/Recipes/components/RecipesGrid"
import { RecipeTranslations } from "@/pages/Recipes/RecipeTranslations"
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
    const t: TranslationFunction = useTranslation(RecipeTranslations)
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

    const nonSideDishes: Recipe[] = recipesFiltered.filter(recipe => !recipe.sideDish)
    const sideDishes: Recipe[] = recipesFiltered.filter(recipe => recipe.sideDish)

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
                  .title(t("topbar.title.recipes"))
                  .mainViewWidth("md:max-w-[900px]")
                  .rebuild()
            return
        }

        topbar.configuration
              .title(t("topbar.title.recipes"))
              .actionButtons([
                  { icon: ViewMode.getIcon(settings.data.recipeListViewMode), onClick: handleViewMode },
              ])
              .dropdownMenuItems([
                  { icon: "upload", label: t("dropdown.import.recipe"), onClick: () => navigate(`/recipe/import`) },
                  { icon: "restore_from_trash", label: t("dropdown.restore"), onClick: () => navigate(`/recipes/restore`) },
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
                   label: t("sab.label.new"),
               })
               .rebuild()
    }, [])

    return (
        <StandardContentWrapper>
            <div className="flex items-center gap-1">
                <SearchWidget
                    inputValue={searchWidgetInput}
                    setInputValue={setSearchWidgetInput}
                    placeholder={t("placeholder.search")}
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

            {nonSideDishes.length === 0 && !recipes.isLoading
                ? <Notification color="red" title={t("no.recipes.found.notification")} />
                : <RecipesGrid viewMode={settings.data?.recipeListViewMode}>
                    {recipes.isLoading || isLoading === ComponentLoadingState.LOADING
                        ? <RecipeListSkeleton />
                        : nonSideDishes.map(recipe => <RecipeImageCard key={recipe.id} recipe={recipe} />)
                    }
                </RecipesGrid>
            }

            {sideDishes.length > 0 && (
                <>
                    <Spacer height="10" />

                    <Heading size={"xl"}>{t("heading.sideDishes")}</Heading>

                    <Spacer height="4" />

                    <RecipesGrid viewMode={settings.data?.recipeListViewMode}>
                        {recipes.isLoading || isLoading === ComponentLoadingState.LOADING
                            ? <RecipeListSkeleton />
                            : sideDishes.map(recipe => <RecipeImageCard key={recipe.id} recipe={recipe} />)
                        }
                    </RecipesGrid>
                </>
            )}

            <div className="mb-[5.5rem] md:mb-0"></div>
        </StandardContentWrapper>
    )
}
