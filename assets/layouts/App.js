/***************************
 * ./assets/layouts/App.js *
 ***************************/

import React, { useEffect, useState }   from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import axios                            from 'axios'

import AuthChecker                      from './AuthChecker/AuthChecker'
import Sidebar                          from './Sidebar/Sidebar'
import SidebarDrawer                    from './Sidebar/SidebarDrawer'
import SidebarDrawerButton              from './Sidebar/components/SidebarDrawerButton'
import Topbar                           from './Topbar/Topbar'

import useAuthentication                from '../hooks/useAuthentication'
import useFetch                         from '../hooks/useFetch'
import useRefreshDataTimestamp          from '../hooks/useRefreshDataTimestamp'

import Login                            from '../pages/Login/Login'
import Logout                           from '../pages/Logout/Logout'
import PageNotFound                     from '../pages/PageNotFound/PageNotFound'
import Pantry                           from '../pages/Pantry/Pantry'
import AddMeal                          from '../pages/Planner/AddMeal'
import Planner                          from '../pages/Planner/Planner'
import AddRecipe                        from '../pages/Recipes/AddRecipe'
import EditRecipe                       from '../pages/Recipes/EditRecipe'
import Recipes                          from '../pages/Recipes/Recipes'
import Recipe                           from '../pages/Recipes/Recipe'
import Registration                     from '../pages/Registration/Registration'
import AddGroup                         from '../pages/Settings/AddGroup'
import Settings                         from '../pages/Settings/Settings'
import ShoppingList                     from '../pages/ShoppingList/ShoppingListNew'

/**
 * App
 * 
 * Main component of the application. Handles the routing
 * and provides state variables and setter functions for 
 * various global components, such as the sidebar or 
 * the shopping list.
 * 
 * Renders a flex container consisting of two columns/rows:
 * the sidebar, rendered by the Sidebar component, and 
 * the main container, which itself consists of the topbar,
 * rendered by the Topbar component, and the actual content
 * container, where the BrowserRouter decides which page to 
 * load depending on the URL.
 * 
 * @component
 * @property {string} version The current version number.
 */
export default function App({ version }) {
    /******************
     * GENERAL        *
     ******************/

    /**
     * The user and authentication objects.
     * 
     * @type {[object, object]}
     */
    const [user, authentication] = useAuthentication()

    /**
     * Whether or not dependent data should be reloaded
     * without loading screens. Will be updated by the
     * useRefreshDataTimestamp hook.
     * 
     * @type {[boolean, function]}
     */
    const [isLoading, setLoading] = useState(false)

    /**
     * The RefreshDataTimestamp. This hook will keep
     * updating isLoading if the timestamp changes.
     * 
     * @type {number}
     */
    const refreshDataTimestamp = useRefreshDataTimestamp(isLoading, setLoading)

    
    /******************
     * SIDEBAR        *
     ******************/

    /**
     * The active item of the sidebar. It will be highlighted
     * with a darker background color and a filled icon.
     * Each page MUST set an active item; it can be empty, however.
     * 
     * @type {[string?, function]}
     */
    const [sidebarActiveItem, setSidebarActiveItem] = useState('')

    /**
     * The configuration of the SidebarActionButton (SAB). 
     * On larger screens, it is fixed in the top of the sidebar.
     * On small screens it is a floating action button in the 
     * bottom-right corner of the screen. By default, it is 
     * invisible. Each page MUST set a configuration for the SAB;
     * it can be empty, however.
     * 
     * @type {[object?, function]}
     */
    const [sidebarActionButton, setSidebarActionButton] = useState({})

    /**
     * Updates the active sidebar item and the SidebarActionButton.
     * 
     * @param {string} sidebarActiveItem The sidebar item that should be active.
     * @param {object} sidebarActionButton The configuration for the SidebarActionButton.
     * @param {boolean} sidebarActionButton.visible Whether the SAB should be visible or not.
     * @param {string} sidebarActionButton.icon The icon of the SAB.
     * @param {string} sidebarActionButton.label The label text of the SAB.
     * @param {string} sidebarActionButton.path An optional path that the SAB redirects to.
     * @param {function} sidebarActionButton.onClick An optional onClick handler.
     * @param {boolean?} sidebarActionButton.floating Set true for being displayed expanded and floating in the bottom-right corner. Set false for an SAB integrated in the sidebar.
     */
    const setSidebar = (sidebarActiveItem = '', sidebarActionButton = {}) => {
        setSidebarActiveItem(sidebarActiveItem)
        setSidebarActionButton(sidebarActionButton)
    }

    /**
     * Whether or not the sidebar drawer is visible.
     * If set to true, the SidebarDrawer will move into 
     * the view. The setDrawerVisible method can be passed
     * to any button, preferably to SidebarDrawerButton 
     * components, e.g. in the sidebar or the topbar.
     * 
     * @type {[boolean, function]}
     */
    const [isDrawerVisible, setDrawerVisible] = useState(false)

    
    /******************
     * TOPBAR         *
     ******************/

    /**
     * The configuration of the topbar. On small screens, 
     * the topbar consists of two rows, one of which has a
     * SidebarDrawerButton and Topbar Action Buttons, while
     * the other one has a back button and the title. By 
     * scrolling, it will collapse into one row. On large 
     * screens, the topbar will be shown in the main container.
     * 
     * See the documentation of the Topbar component 
     * for further details on the properties.
     */
    const [topbar, setTopbar] = useState({
        title: '',
        showBackButton: false,
        backButtonPath: '/',
        onBackButtonClick: () => {},
        actionButtons: [],
        truncate: false,
        isLoading: false,
        style: '',
    })

    
    /******************
     * SETTINGS       *
     ******************/

    /**
     * The user-specific settings.
     * 
     * @type {object}
     */
    const settings = useFetch(
        '/api/settings', 
        authentication,
        [isLoading],
    )

    
    /******************
     * USERGROUPS     *
     ******************/

    /**
     * The list of UserGroups. The data object 
     * is an array of objects here.
     * 
     * @type {object}
     * @property {Array<object>} data
     */
    const userGroups = useFetch(
        '/api/usergroups/list',
        authentication,
        [isLoading],
    )

    
    /******************
     * MEALCATEGORIES *
     ******************/

    /**
     * The list of MealCategories. The data object 
     * is an array of objects here. 
     * 
     * @type {object}
     * @property {Array<object>} data
     */
    const mealCategories = useFetch(
        '/api/mealcategories/list',
        authentication,
        [isLoading],
    )

    
    /******************
     * RECIPES        *
     ******************/

    /**
     * The complete recipe list. The data object 
     * is an array of objects here.
     * 
     * @type {object}
     * @property {Array<object>} data
     */
    const recipes = useFetch(
        '/api/recipes/list',
        authentication,
        [isLoading],
    )


    /******************
     * PLANNER        *
     ******************/

    /**
     * The complete list of Day entities. The data
     * object is an array of objects here.
     * 
     * @type {object}
     * @property {Array<object>} data
     */
    const days = useFetch(
        '/api/days/list',
        authentication,
        [isLoading],
    )

    /**
     * Calls the Update Days API, which removes all 
     * unnecessary Days (past days and days further away
     * than ten).
     */
    useEffect(() => {
        if (days.isLoading) return

        axios.get('/api/days/update')
    }, [days.isLoading])


    /******************
     * SHOPPINGLIST  *
     ******************/

    /**
     * The complete shopping list. The data 
     * object is an array of objects here.
     * 
     * @type {object}
     * @property {Array<object>} data
     */
    const shoppingList = useFetch(
        '/api/shoppinglist/ingredients',
        authentication,
        [isLoading],
    )



    /**
     * Props for subcomponents
     */
    const props = {
        user,
        authentication,

        settings,
        userGroups,
        mealCategories,

        recipes,
        days,
        // shoppingList,
        // pantry,

        // setSidebarActiveItem,   /** @deprecated */
        // setSidebarActionButton, /** @deprecated */
        setSidebar,
        setTopbar,
    }

    /** 
     * Render App
     */
    return (
        <BrowserRouter>
            <div className="flex flex-col md:flex-row items-start bg-bg dark:bg-bg-dark min-h-screen text-secondary-900 dark:text-secondary-dark-900 min-w-[375px]">
                <SidebarDrawer
                    isDrawerVisible={isDrawerVisible}
                    setDrawerVisible={setDrawerVisible} 
                    version={version}
                    user={user}
                />

                <Sidebar 
                    sidebarActiveItem={sidebarActiveItem} 
                    sidebarActionButton={sidebarActionButton}
                    isDrawerVisible={isDrawerVisible}
                    setDrawerVisible={setDrawerVisible} 
                    authentication={authentication}
                    settings={settings}
                />
                
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
                            element={<AuthChecker authentication={authentication} component={<Planner {...props} />} />} 
                        />
                        <Route 
                            path="/planner"              
                            element={<AuthChecker authentication={authentication} component={<Planner {...props} />} />} 
                        />
                        <Route 
                            path="/planner/add"          
                            element={<AuthChecker authentication={authentication} component={<AddMeal {...props} />} />} 
                        />
                        <Route 
                            path="/planner/add/:id"      
                            element={<AuthChecker authentication={authentication} component={<AddMeal {...props} />} />} 
                        />
                        <Route 
                            path="/shoppinglist"         
                            element={<AuthChecker authentication={authentication} component={<ShoppingList {...props} />} />} 
                        />
                        <Route 
                            path="/recipes"              
                            element={<AuthChecker authentication={authentication} component={<Recipes {...props} />} />} 
                        />
                        <Route 
                            path="/recipe/add"           
                            element={<AuthChecker authentication={authentication} component={<AddRecipe {...props} />} />} 
                        />
                        <Route 
                            path="/recipe/:id"           
                            element={<AuthChecker authentication={authentication} component={<Recipe {...props} />} />} 
                        />
                        <Route 
                            path="/recipe/:id/edit"      
                            element={<AuthChecker authentication={authentication} component={<EditRecipe {...props} />} />} 
                        />
                        <Route 
                            path="/pantry"               
                            element={<AuthChecker authentication={authentication} component={<Pantry {...props} />} />} 
                        />
                        <Route 
                            path="/settings"             
                            element={<AuthChecker authentication={authentication} component={<Settings {...props} />} />} 
                        />
                        <Route 
                            path="/settings/groups/add"  
                            element={<AuthChecker authentication={authentication} component={<AddGroup {...props} />} />} 
                        />
                        <Route 
                            path="/login"                
                            element={<Login setLoading={setLoading} {...props} />} 
                        />
                        <Route 
                            path="/logout"               
                            element={<Logout {...props} />} 
                        />
                        <Route 
                            path="/register"             
                            element={<Registration {...props} />} 
                        />
                        <Route 
                            path="*"                     
                            element={<PageNotFound {...props} />} 
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}
