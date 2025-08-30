import { Spinner } from "@/components/ui/Spinner"
import { AppContext } from "@/context/AppContext"
import { AuthenticationContext } from "@/context/AuthenticationContext"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { MainViewWidthContext } from "@/context/MainViewWidthContext"
import { SettingsContext } from "@/context/SettingsContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useApiResourceCollection } from "@/hooks/useApiResourceCollection"
import { useHomepage } from "@/hooks/useHomepage"
import { useNullishContext } from "@/hooks/useNullishContext"
import { useShoppingListNotificationDot } from "@/hooks/useShoppingListNotificationDot"
import { useTopbar } from "@/hooks/useTopbar"
import { AuthChecker } from "@/layouts/AuthChecker/AuthChecker"
import { TopbarComponent } from "@/layouts/Topbar/TopbarComponent"
import { Installation } from "@/pages/Installation/Installation"
import { Meal } from "@/types/api/Meal"
import { MealCategory } from "@/types/api/MealCategory"
import { Recipe } from "@/types/api/Recipe"
import { Settings } from "@/types/api/Settings"
import { UserGroup } from "@/types/api/UserGroup"
import { App } from "@/types/App"
import { Authentication } from "@/types/Authentication"
import { ManagedResource } from "@/types/ManagedResource"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Page } from "@/types/Page"
import { StorageIngredient } from "@/types/StorageIngredient"
import { Topbar } from "@/types/topbar/Topbar"
import { StringBuilder } from "@/util/StringBuilder"
import { ReactElement, useEffect } from "react"
import { Route, Routes } from "react-router-dom"

/**
 * Renders the main view of the application, i.e. the part right to (on bigger screens) or above (on smaller screens) the sidebar component.
 * Caches all data that is necessary for the initial rendering, for example the list of recipes, the shopping list, etc.
 * Defines the routing to each page.
 */
export const MainView = (): ReactElement => {
    const app: App = useNullishContext(AppContext)
    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const settings: ManagedResource<Settings> = useNullishContext(SettingsContext)
    const topbar: Topbar = useTopbar()
    const mainViewWidth: string = useNullishContext(MainViewWidthContext).mainViewWidth

    const meals: ManagedResourceCollection<Meal> = useApiResourceCollection("/api/meals", true, [app.isLoading])
    const recipes: ManagedResourceCollection<Recipe> = useApiResourceCollection("/api/recipes", true, [app.isLoading])
    const pantry: ManagedResourceCollection<StorageIngredient> = useApiResourceCollection("/api/ingredients?storage.name=pantry&order[position]=desc", true, [app.isLoading])
    const shoppingList: ManagedResourceCollection<StorageIngredient> = useApiResourceCollection("/api/ingredients?storage.name=shoppinglist&order[position]=desc", true, [app.isLoading])
    useShoppingListNotificationDot(shoppingList)

    const mealCategories: ManagedResourceCollection<MealCategory> = useApiResourceCollection("/api/meal_categories", true, [app.isLoading])
    const userGroups: ManagedResourceCollection<UserGroup> = useApiResourceCollection("/api/user_groups", true, [app.isLoading])
    const visibleUserGroups: ManagedResourceCollection<UserGroup> = useApiResourceCollection("/api/user_groups?hidden=false", true, [app.isLoading])
    useEffect(() => {
        if (userGroups.isLoading) {
            visibleUserGroups.load()
        }
    }, [userGroups.isLoading])

    const pages: Page[] = [
        ...app.pageConfigs,
        {
            id: "homepage",
            path: "/",
            element: useHomepage(),
            authenticationNeeded: true,
        },
    ]

    return (
        <div className={StringBuilder.cn("flex flex-col w-full md:mr-4", mainViewWidth)}>
            {app.installationData.isAppInstalled && (!settings.isLoading || !authentication.isAuthenticated) ? (
                <TopbarContext.Provider value={topbar}>
                    <TopbarComponent />

                    <div className="md:pt-20">
                        <GlobalAppDataContext.Provider value={{
                            meals: meals,
                            recipes: recipes,
                            shoppingList: shoppingList,
                            pantry: pantry,
                            mealCategories: mealCategories,
                            userGroups: userGroups,
                            visibleUserGroups: visibleUserGroups,
                        }}>
                            <Routes>
                                {pages.map(page => (
                                    <Route
                                        key={page.path}
                                        path={page.path}
                                        element={page.authenticationNeeded ? (<AuthChecker component={page.element} />) : page.element}
                                    />
                                ))}
                            </Routes>
                        </GlobalAppDataContext.Provider>
                    </div>
                </TopbarContext.Provider>
            ) : (
                app.installationData.installation.isLoading || (app.installationData.isAppInstalled && settings.isLoading) ? (
                    <Spinner />
                ) : (
                    <Routes>
                        <Route path="*" element={<Installation />} />
                    </Routes>
                )
            )}
        </div>
    )
}