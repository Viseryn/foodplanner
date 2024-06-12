import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import useAuthentication from '@/hooks/useAuthentication'
import { useEntityState } from '@/hooks/useEntityState'
import { useImageMigration } from '@/hooks/useImageMigration'
import { useRefreshDataTimestamp } from '@/hooks/useRefreshDataTimestamp'
import { BaseLayout } from "@/layouts/BaseLayout"
import { MainContainer } from "@/layouts/MainContainer"
import { Installation } from "@/pages/Installation/Installation"
import { JsonLogin } from '@/pages/Login/JsonLogin'
import { Logout } from '@/pages/Logout/Logout'
import { PageNotFound } from '@/pages/PageNotFound/PageNotFound'
import { Pantry } from '@/pages/Pantry/Pantry'
import { AddMeal } from '@/pages/Planner/AddMeal'
import { Planner } from '@/pages/Planner/Planner'
import { AddRecipe } from '@/pages/Recipes/AddRecipe'
import { EditRecipe } from '@/pages/Recipes/EditRecipe'
import { ImportRecipe } from "@/pages/Recipes/ImportRecipe"
import { Recipe } from '@/pages/Recipes/Recipe'
import { Recipes } from '@/pages/Recipes/Recipes'
import { Registration } from '@/pages/Registration/Registration'
import { AddGroup } from '@/pages/Settings/AddGroup'
import { EditGroup } from "@/pages/Settings/EditGroup"
import { Settings } from '@/pages/Settings/Settings'
import { UserSettings } from '@/pages/Settings/UserSettings'
import { ShoppingList } from '@/pages/ShoppingList/ShoppingList'
import DayModel from '@/types/DayModel'
import IngredientModel from '@/types/IngredientModel'
import InstallationStatusModel from '@/types/InstallationStatusModel'
import MealCategoryModel from '@/types/MealCategoryModel'
import { Optional } from "@/types/Optional"
import RecipeModel from '@/types/RecipeModel'
import SettingsModel from '@/types/SettingsModel'
import { UserGroupModel } from '@/types/UserGroupModel'
import { UserModel } from '@/types/UserModel'
import React, { ReactElement, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthChecker from './AuthChecker/AuthChecker'
import SidebarDrawerButton from './Sidebar/components/SidebarDrawerButton'
import Sidebar from './Sidebar/Sidebar'
import SidebarDrawer from './Sidebar/SidebarDrawer'
import Topbar from './Topbar/Topbar'

/**
 * Main component of the application. Handles the routing and provides state variables and
 * setter functions for various global components, such as the sidebar or the shopping list.
 *
 * Renders a flex container consisting of two columns/rows: the sidebar, rendered by the
 * Sidebar component, and the main container, which itself consists of the topbar, rendered by
 * the Topbar component, and the actual content container, where the BrowserRouter decides
 * which page to  load depending on the URL.
 *
 * @component
 */
export default function App(): ReactElement {
    // The User and Authentication objects
    const [user, authentication]: [EntityState<UserModel>, Authentication] = useAuthentication()

    // Will be updated by useRefreshDataTimestamp and set to true if the timestamp changed.
    // Can e.g. be passed as dependency in a useFetch call to reload entity data without showing a loading screen.
    const [isLoading, setLoading] = useState<boolean>(false)

    // Whether the image migration is processing right now.
    const [isMigratingImages, setMigratingImages] = useState<boolean>(false)

    // This hook will keep updating isLoading if the timestamp changes
    useRefreshDataTimestamp(isLoading, setLoading)

    // The configuration of the topbar
    const [topbar, setTopbar] = useState<TopbarConfiguration>({})

    // Whether the sidebar drawer is visible
    const [isDrawerVisible, setDrawerVisible] = useState<boolean>(false)

    // The identifier of the active sidebar item
    const [sidebarActiveItem, setSidebarActiveItem] = useState<string>('')

    // The configuration of the SidebarActionButton (SAB)
    const [sidebarActionButton, setSidebarActionButton] = useState<SidebarActionButtonConfiguration>({})

    // Whether the app has been installed
    const [isInstalled, setInstalled] = useState<Optional<boolean>>()

    /**
     * Updates the active sidebar item and the SidebarActionButton. If there is no argument given,
     * the sidebar will have no active item and the Sidebar Action Button is invisible. This method
     * MUST be called by each page, otherwise the configuration of the last page will not be overriden.
     * See the documentation of the SidebarActionButtonConfiguration type alias for more information
     * on the properties.
     *
     * @param sidebarActiveItem The sidebar item that should be active.
     * @param sidebarActionButton The configuration for the SidebarActionButton.
     */
    const setSidebar: SetSidebarAction = (sidebarActiveItem = '', sidebarActionButton = {}) => {
        setSidebarActiveItem(sidebarActiveItem)
        setSidebarActionButton(sidebarActionButton)
    }

    // Fetch installation status
    const installationStatus: EntityState<InstallationStatusModel> = useEntityState("/api/installation-status", undefined, [isLoading])
    useEffect(() => {
        if (installationStatus.isLoading) {
            return
        }

        setInstalled(!!installationStatus.data.status)
    }, [installationStatus.isLoading])

    // Fetch data
    const settings: EntityState<SettingsModel> = useEntityState(`/api/settings?userid=${!user.isLoading ? user.data.id : 0}`, authentication, [isLoading])
    const userGroups: EntityState<UserGroupModel[]> = useEntityState("/api/usergroups", authentication, [isLoading])
    const visibleUserGroups: EntityState<UserGroupModel[]> = useEntityState("/api/usergroups?hidden=false", authentication, [isLoading])
    const mealCategories: EntityState<MealCategoryModel[]> = useEntityState("/api/mealcategories", authentication, [isLoading])
    const shoppingList: EntityState<IngredientModel[]> = useEntityState("/api/storages/shoppinglist/ingredients", authentication, [isLoading])
    const pantry: EntityState<IngredientModel[]> = useEntityState("/api/storages/pantry/ingredients", authentication, [isLoading])
    const recipes: EntityState<RecipeModel[]> = useEntityState("/api/recipes", authentication, [isLoading])
    const days: EntityState<DayModel[]> = useEntityState("/api/days", authentication, [isLoading])

    // Reload visibleUserGroups when userGroups updates
    useEffect(() => {
        if (userGroups.isLoading) {
            visibleUserGroups.load()
        }
    }, [userGroups.isLoading])

    // Calculate number of non-checked shopping list items for the notification dot at the shopping list sidebar item
    const [
        shoppingListNotificationDotValue,
        setShoppingListNotificationDotValue,
    ] = useState<number>()

    useEffect(() => {
        if (shoppingList.isLoading) {
            return
        }

        setShoppingListNotificationDotValue(shoppingList.data.filter(ingredientModel => !ingredientModel.checked).length)
    }, [shoppingList])

    // Migrate recipe images to v1.6 if not done already
    useImageMigration(installationStatus, setMigratingImages, [recipes, days])

    // Render App component
    return (
        <BrowserRouter>
            <BaseLayout>
                {isInstalled &&
                    <>
                        <SidebarDrawer {...{
                            isDrawerVisible, setDrawerVisible, authentication, installationStatus
                        }} />

                        <Sidebar {...{
                            sidebarActiveItem, sidebarActionButton, isDrawerVisible,
                            setDrawerVisible, authentication, settings, shoppingListNotificationDotValue
                        }} />
                    </>
                }

                <MainContainer>
                    {isInstalled ? (
                        <>
                            <Topbar
                                topbar={topbar}
                                SidebarDrawerButton={
                                    <SidebarDrawerButton
                                        isDrawerVisible={isDrawerVisible}
                                        setDrawerVisible={setDrawerVisible}
                                    />
                                }
                            />

                            <div className="md:pt-20">
                                {isMigratingImages ? (
                                    <div className="pb-[5.5rem] mx-4 md:ml-0">
                                        <Spacer height="6" />
                                        <Notification title="FoodPlanner wird auf Version v1.6 aktualisiert ..." />
                                        <Spinner />
                                    </div>
                                ) : (
                                    <Routes>
                                        <Route
                                            path="/"
                                            element={<AuthChecker authentication={authentication} component={
                                                <Planner {...{ days, shoppingList, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/planner"
                                            element={<AuthChecker authentication={authentication} component={
                                                <Planner {...{ days, shoppingList, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/planner/add/:id"
                                            element={<AuthChecker authentication={authentication} component={
                                                <AddMeal userGroups={visibleUserGroups} {...{ days, mealCategories, recipes, settings, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/shoppinglist"
                                            element={<AuthChecker authentication={authentication} component={
                                                <ShoppingList {...{ shoppingList, pantry, settings, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/recipes"
                                            element={<AuthChecker authentication={authentication} component={
                                                <Recipes {...{ recipes, settings, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/recipe/import"
                                            element={<AuthChecker authentication={authentication} component={
                                                <ImportRecipe {...{ recipes, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/recipe/add"
                                            element={<AuthChecker authentication={authentication} component={
                                                <AddRecipe {...{ recipes, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/recipe/:id"
                                            element={<AuthChecker authentication={authentication} component={
                                                <Recipe {...{ days, recipes, shoppingList, pantry, settings, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/recipe/:id/edit"
                                            element={<AuthChecker authentication={authentication} component={
                                                <EditRecipe {...{ recipes, days, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/pantry"
                                            element={<AuthChecker authentication={authentication} component={
                                                <Pantry {...{ pantry, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/settings"
                                            element={<AuthChecker authentication={authentication} component={
                                                <Settings {...{ settings, userGroups, visibleUserGroups, mealCategories, days, authentication, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/settings/groups/add"
                                            element={<AuthChecker authentication={authentication} component={
                                                <AddGroup {...{ authentication, userGroups, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/settings/group/:id/edit"
                                            element={<AuthChecker authentication={authentication} component={
                                                <EditGroup {...{ authentication, userGroups, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/settings/user"
                                            element={<AuthChecker authentication={authentication} component={
                                                <UserSettings {...{ user, setSidebar, setTopbar }} />
                                            } />}
                                        />
                                        <Route
                                            path="/login"
                                            element={<JsonLogin {...{ user, authentication, setSidebar, setTopbar }} />}
                                        />
                                        <Route
                                            path="/logout"
                                            element={<Logout {...{ authentication, setSidebar, setTopbar }} />}
                                        />
                                        <Route
                                            path="/register"
                                            element={<Registration {...{ authentication, setSidebar, setTopbar }} />}
                                        />
                                        <Route
                                            path="*"
                                            element={<PageNotFound {...{ setSidebar, setTopbar }} />}
                                        />
                                    </Routes>
                                )}
                            </div>
                        </>
                    ) : (
                        installationStatus.isLoading ? (
                            <Spinner />
                        ) : (
                            <Routes>
                                <Route path="*" element={<Installation {...{ installationStatus }} />} />
                            </Routes>
                        )
                    )}
                </MainContainer>
            </BaseLayout>
        </BrowserRouter>
    )
}
