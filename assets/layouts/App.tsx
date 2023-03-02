/****************************
 * ./assets/layouts/App.tsx *
 ****************************/

import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AuthChecker from './AuthChecker/AuthChecker'
import SidebarDrawerButton from './Sidebar/components/SidebarDrawerButton'
import Sidebar from './Sidebar/Sidebar'
import SidebarDrawer from './Sidebar/SidebarDrawer'
import Topbar from './Topbar/Topbar'

import useAuthentication from '@/hooks/useAuthentication'
import useFetch from '@/hooks/useFetch'
import useRefreshDataTimestamp from '@/hooks/useRefreshDataTimestamp'

import Login from '@/pages/Login/Login'
import Logout from '@/pages/Logout/Logout'
import PageNotFound from '@/pages/PageNotFound/PageNotFound'
import Pantry from '@/pages/Pantry/Pantry'
import AddMeal from '@/pages/Planner/AddMeal'
import Planner from '@/pages/Planner/Planner'
import AddRecipe from '@/pages/Recipes/AddRecipe'
import EditRecipe from '@/pages/Recipes/EditRecipe'
import Recipe from '@/pages/Recipes/Recipe'
import Recipes from '@/pages/Recipes/Recipes'
import Registration from '@/pages/Registration/Registration'
import AddGroup from '@/pages/Settings/AddGroup'
import Settings from '@/pages/Settings/Settings'
import ShoppingList from '@/pages/ShoppingList/ShoppingList'

import DayModel from '@/types/DayModel'
import IngredientModel from '@/types/IngredientModel'
import MealCategoryModel from '@/types/MealCategoryModel'
import RecipeModel from '@/types/RecipeModel'
import UserGroupModel from '@/types/UserGroupModel'
import UserModel from '@/types/UserModel'

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
 * @param props
 * @param props.version The current version number.
 */
export default function App({ version }: { 
    version: string
}): JSX.Element {
    // The User and Authentication objects
    const [user, authentication]: [FetchableEntity<UserModel>, Authentication] = useAuthentication()

    // Will be updated by useRefreshDataTimestamp and set to true if the timestamp changed.
    // Can e.g. be passed as dependency in a useFetch call to reload entity data without showing a loading screen.
    const [isLoading, setLoading] = useState<boolean>(false)

    // This hook will keep updating isLoading if the timestamp changes
    useRefreshDataTimestamp(isLoading, setLoading)

    // The configuration of the topbar
    const [topbar, setTopbar] = useState<TopbarConfiguration>({})

    // Whether or not the sidebar drawer is visible
    const [isDrawerVisible, setDrawerVisible] = useState<boolean>(false)

    // The identifier of the active sidebar item
    const [sidebarActiveItem, setSidebarActiveItem] = useState<string>('')

    // The configuration of the SidebarActionButton (SAB)
    const [sidebarActionButton, setSidebarActionButton] = useState<SidebarActionButtonConfiguration>({})

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

    /**
     * A shortcut function for fetching the global data. Returns the useFetch return value with the 
     * given URL and the authentication and isLoading state variable as dependencies.
     * 
     * @param url The API url.
     * @returns The useFetch return value.
     */
    const fetch = <T,>(url: string): FetchableEntity<T> => { 
        return useFetch<T>(url, authentication, [isLoading]) 
    }

    // Fetch data
    const settings = fetch<Settings>('/api/settings/detail')
    const mealCategories = fetch<Array<MealCategoryModel>>('/api/mealcategories/list')
    const userGroups = fetch<Array<UserGroupModel>>('/api/usergroups/list')
    const shoppingList = fetch<Array<IngredientModel>>('/api/shoppinglist/ingredients')
    const pantry = fetch<Array<IngredientModel>>('/api/pantry/ingredients')
    const recipes = fetch<Array<RecipeModel>>('/api/recipes/list')
    const days = fetch<Array<DayModel>>('/api/days/list')

    // Render App component
    return (
        <BrowserRouter>
            <div className="flex flex-col md:flex-row items-start bg-bg dark:bg-bg-dark min-h-screen text-secondary-900 dark:text-secondary-dark-900 min-w-[375px]">
                <SidebarDrawer {...{
                    isDrawerVisible, setDrawerVisible, version, authentication
                }} />

                <Sidebar {...{
                    sidebarActiveItem, sidebarActionButton, isDrawerVisible, 
                    setDrawerVisible, authentication, settings
                }} />
                
                {/* Main Container */}
                <div className="flex flex-col w-full">
                    <Topbar 
                        topbar={topbar}
                        SidebarDrawerButton={
                            <SidebarDrawerButton
                                isDrawerVisible={isDrawerVisible}
                                setDrawerVisible={setDrawerVisible} 
                            />
                        }
                    />

                    {/* Routing */}
                    <Routes>
                        <Route 
                            path="/"
                            element={<AuthChecker authentication={authentication} component={
                                <Planner {...{ days, recipes, shoppingList, setSidebar, setTopbar }} />
                            } />} 
                        />
                        <Route 
                            path="/planner"
                            element={<AuthChecker authentication={authentication} component={
                                <Planner {...{ days, recipes, shoppingList, setSidebar, setTopbar }} />
                            } />} 
                        />
                        <Route 
                            path="/planner/add"
                            element={<AuthChecker authentication={authentication} component={
                                <AddMeal {...{ days, mealCategories, recipes, userGroups, setSidebar, setTopbar }} />
                            } />} 
                        />
                        <Route 
                            path="/planner/add/:id"
                            element={<AuthChecker authentication={authentication} component={
                                <AddMeal {...{ days, mealCategories, recipes, userGroups, setSidebar, setTopbar }} />
                            } />} 
                        />
                        <Route 
                            path="/shoppinglist"
                            element={<AuthChecker authentication={authentication} component={
                                <ShoppingList 
                                    {...{ shoppingList, pantry, settings, setSidebar, setTopbar }} 
                                />
                            } />} 
                        />
                        <Route 
                            path="/recipes"
                            element={<AuthChecker authentication={authentication} component={
                                <Recipes {...{ recipes, setSidebar, setTopbar }} />
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
                                <Recipe {...{ recipes, shoppingList, pantry, settings, setSidebar, setTopbar }} />
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
                                <Settings {...{ settings, userGroups, mealCategories, days, setSidebar, setTopbar }} />
                            } />} 
                        />
                        <Route 
                            path="/settings/groups/add"
                            element={<AuthChecker authentication={authentication} component={
                                <AddGroup {...{ authentication, userGroups, setSidebar, setTopbar }} />
                            } />} 
                        />
                        <Route 
                            path="/login"
                            element={<Login {...{ user, authentication, setLoading, setSidebar, setTopbar }} />} 
                        />
                        <Route 
                            path="/logout"
                            element={<Logout {...{ authentication, setSidebar, setTopbar }} />} 
                        />
                        <Route 
                            path="/register"
                            element={<Registration {...{ user, setSidebar, setTopbar }} />} 
                        />
                        <Route 
                            path="*"
                            element={<PageNotFound {...{ setSidebar, setTopbar }} />} 
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}
