/***************************
 * ./assets/layouts/App.js *
 ***************************/

import React, { useEffect, useState }   from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import axios                            from 'axios'

import AuthChecker                      from './AuthChecker/AuthChecker'
import Sidebar, { SidebarDrawerButton } from './Sidebar/Sidebar'
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
import ShoppingList                     from '../pages/ShoppingList/ShoppingList'

import loadShoppingList                 from '../util/loadShoppingList'
import loadPantry                       from '../util/loadPantry.js'

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
 */
export default function App() {
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
     * See the documentation of the SidebarActionButton component
     * for further details on the properties.
     * 
     * @type {[object?, function]}
     * 
     * @todo The onClickHandler property should be renamed to onClick.
     */
    const [sidebarActionButton, setSidebarActionButton] = useState({
        visible: false,
        icon: '',
        path: '#',
        label: '',
        onClickHandler: () => {},
    })

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
     * The user-specific settings. Since these do not
     * have to be loaded more than once, the 
     * isDependencyLoading array can be left empty.
     * 
     * @type {object}
     */
    const settings = useFetch(
        '/api/settings', 
        authentication,
    )


    // ShoppingList
    const [shoppingList, setShoppingList] = useState([]);
    const [isLoadingShoppingList, setLoadingShoppingList] = useState(true);

    // Pantry
    const [pantry, setPantry] = useState([]);
    const [isLoadingPantry, setLoadingPantry] = useState(true);

    // Days
    const [days, setDays] = useState([]);
    const [isLoadingDays, setLoadingDays] = useState(true);

    // Recipes
    const [recipes, setRecipes] = useState([]);
    const [isLoadingRecipes, setLoadingRecipes] = useState(true);
    const [recipeIndex, setRecipeIndex] = useState(-1);
    
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
    const props = {
        // RefreshDataTimestamp

        // User

        // ShoppingList
        'shoppingList': shoppingList,
        'setShoppingList': setShoppingList,
        'isLoadingShoppingList': isLoadingShoppingList,
        'setLoadingShoppingList': setLoadingShoppingList,

        // Pantry
        'pantry': pantry,
        'setPantry': setPantry,
        'isLoadingPantry': isLoadingPantry,
        'setLoadingPantry': setLoadingPantry,

        // Days
        'days': days,
        'setDays': setDays,
        'isLoadingDays': isLoadingDays,
        'setLoadingDays': setLoadingDays,

        // Recipes
        'recipes': recipes,
        'setRecipes': setRecipes,
        'isLoadingRecipes': isLoadingRecipes,
        'setLoadingRecipes': setLoadingRecipes,
        'recipeIndex': recipeIndex,
        'setRecipeIndex': setRecipeIndex,

        // Sidebar
        'setSidebarActiveItem': setSidebarActiveItem, 
        'setSidebarActionButton': setSidebarActionButton,

        // Topbar
        'topbar': topbar,
        'setTopbar': setTopbar,
    };

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
     * is an array of objects here. They do not have 
     * to be updated more than once, so the 
     * isDependencyLoading array can be left empty.
     * 
     * @type {object}
     * @property {Array<object>} data
     */
    const mealCategories = useFetch(
        '/api/mealcategories/list',
        authentication,
    )


    /**
     */



    /**
     * Load recipes into global state when isLoadingRecipes 
     * is true, e.g. on first render or after adding/editing
     * a recipe.
     */
    useEffect(() => {
        if (!isLoadingRecipes && !isLoadingUser && !isLoadingAnonymously) return;
        if (!isAuthenticated()) return;

        axios
            .get('/api/recipes/list')
            .then(response => {
                setRecipes(JSON.parse(response.data));
                setLoadingRecipes(false);
            })
        ;
    }, [isLoadingRecipes, isLoadingUser, user, isLoadingAnonymously]);

    /**
     * Calls the Update Days API, which removes all 
     * unnecessary Days (past days and days further away
     * than ten), and calls getDays() after.
     * Loads days data into global state when isLoadingDays
     * is true, e.g. on first render or after adding/deleting 
     * a meal.
     */
    useEffect(() => {
        if (!isLoadingDays && !isLoadingUser && !isLoadingAnonymously) return;
        if (!isAuthenticated()) return;

        axios
            .get('/api/days/update')
            .then(() => {
                axios
                    .get('/api/days/list')
                    .then(response => {
                        setDays(JSON.parse(response.data));
                        setLoadingDays(false);
                    })
                ;
            })
        ;
    }, [isLoadingDays, isLoadingUser, user, isLoadingAnonymously]);

    /**
     * Load shopping list into global state when 
     * isLoadingShoppingList is true, e.g. on first render.
     */
    useEffect(() => {
        if (!isLoadingShoppingList && !isLoadingUser && !isLoadingAnonymously) return;
        if (!isAuthenticated()) return;

        loadShoppingList(setShoppingList, () => {
            // Disable loading screen
            setLoadingShoppingList(false);
        });
    }, [isLoadingShoppingList, isLoadingUser, user, isLoadingAnonymously]);

    /**
     * Load pantry into global state when 
     * isLoadingPantry is true, e.g. on first render.
     */
    useEffect(() => {
        if (!isLoadingPantry && !isLoadingUser && !isLoadingAnonymously) return;
        if (!isAuthenticated()) return;

        loadPantry(setPantry, () => {
            // Disable loading screen
            setLoadingPantry(false);
        });
    }, [isLoadingPantry, isLoadingUser, user, isLoadingAnonymously]);
    const props = {
        user,
        authentication,
        settings,
        userGroups,
        mealCategories,
        setSidebarActiveItem, 
        setSidebarActionButton,
        topbar, 
        setTopbar,
    }

    /** 
     * Render App
     */
    return (
        <BrowserRouter>
            <div className="flex flex-col md:flex-row items-start bg-bg dark:bg-bg-dark min-h-screen text-secondary-900 dark:text-secondary-dark-900 min-w-[375px]">
                <Sidebar 
                    sidebarActiveItem={sidebarActiveItem} 
                    sidebarActionButton={sidebarActionButton}
                    isDrawerVisible={isDrawerVisible}
                    setDrawerVisible={setDrawerVisible} 
                    {...props}
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
                            element={<Login {...props} />} 
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
