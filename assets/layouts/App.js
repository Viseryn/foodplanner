/***************************
 * ./assets/layouts/App.js *
 ***************************/

import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import axios from "axios";

import loadShoppingList from "../util/loadShoppingList";

import Sidebar from '../layouts/Sidebar';
import Planner from '../pages/Planner/Planner';
import AddMeal from '../pages/Planner/AddMeal';
import Recipes from '../pages/Recipes/Recipes';
import AddRecipe from '../pages/Recipes/AddRecipe';
import EditRecipe from '../pages/Recipes/EditRecipe';
import ShoppingList from '../pages/ShoppingList/ShoppingList';
import Login from '../pages/Login/Login';
import Logout from '../pages/Logout/Logout';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import Settings from '../pages/Settings/Settings';
import AddGroup from "../pages/Settings/AddGroup";

/**
 * App
 * 
 * Main component of the application. Handles the routing
 * and provides state functions for the sidebar, e.g. setting 
 * the active sidebar item and updating the sidebar action button.
 * 
 * Renders a flex container consisting of two columns; 
 * the sidebar, rendered by the Sidebar component, and 
 * the content, which is handled by the BrowserRouter.
 * 
 * @component
 */
export default function App() {
    /**
     * Keep user data in global state variable
     * and pass them as props to subcomponents.
     */
    const [user, setUser] = useState([]);
    const [isLoadingUser, setLoadingUser] = useState(true);

    /**
     * Load user data into global state when isLoadingUser
     * is true, e.g. on first render or after login/logout.
     */
    useEffect(() => {
        if (isLoadingUser) {
            axios
                .get('/api/user')
                .then(response => {
                    // Load user data
                    setUser(JSON.parse(response.data));
                    setLoadingUser(false);

                    // Remove user-sensitive data
                    setUserGroups([]);
                    setMealCategories([]);
                    setLoadingUserGroups(true);
                    setLoadingMealCategories(true);
                })
            ;
        }
    }, [isLoadingUser]);

    /**
     * Keep UserGroup data in global state variable
     * and pass them as props to subcomponents.
     */
    const [userGroups, setUserGroups] = useState([]);
    const [isLoadingUserGroups, setLoadingUserGroups] = useState(true);

    /**
     * Load UserGroup data into global state when isLoadingUserGroups
     * is true, e.g. on first render.
     */
    useEffect(() => {
        if (!isLoadingUserGroups && !isLoadingUser) return;
        if (!isAuthenticated()) return;

        axios
            .get('/api/usergroups')
            .then(response => {
                setUserGroups(JSON.parse(response.data));
                setLoadingUserGroups(false);
            })
        ;
    }, [isLoadingUserGroups, isLoadingUser, user]);

    /**
     * Keep MealCategory data in global state variable
     * and pass them as props to subcomponents.
     */
    const [mealCategories, setMealCategories] = useState([]);
    const [isLoadingMealCategories, setLoadingMealCategories] = useState(true);

    /**
     * Load MealCategory data into global state when isLoadingMealCategories
     * is true, e.g. on first render.
     */
    useEffect(() => {
        if (!isLoadingMealCategories && !isLoadingUser) return;
        if (!isAuthenticated()) return;

        axios
            .get('/api/mealcategories')
            .then(response => {
                setMealCategories(JSON.parse(response.data));
                setLoadingMealCategories(false);
            })
        ;
    }, [isLoadingMealCategories, isLoadingUser, user]);

    /**
     * Sidebar configuration (active item, action button) are kept 
     * in global state variables.
     * Sidebar setters will be passed as props to subcomponents, so 
     * that each subcomponent can alter the sidebar state variables.
     */
    const [sidebarActiveItem, setSidebarActiveItem] = useState('');
    const [sidebarActionButton, setSidebarActionButton] = useState({
        visible: false,
        icon: '',
        path: '#',
        label: '',
        onClickHandler: () => {},
    }); 

    /**
     * Keep recipes in global state variable
     * and pass them as props to subcomponents.
     */
    const [recipes, setRecipes] = useState([]);
    const [isLoadingRecipes, setLoadingRecipes] = useState(true);
    const [recipeIndex, setRecipeIndex] = useState(-1);

    /**
     * Load recipes into global state when isLoadingRecipes 
     * is true, e.g. on first render or after adding/editing
     * a recipe.
     */
    useEffect(() => {
        if (!isLoadingRecipes) return;
        if (!isAuthenticated()) return;

        axios
            .get('/api/recipes')
            .then(response => {
                setRecipes(JSON.parse(response.data));
                setLoadingRecipes(false);
            })
        ;
    }, [isLoadingRecipes]);

    /**
     * Keep days in global state variable 
     * and pass them as props to subcomponents.
     */
    const [days, setDays] = useState([]);
    const [isLoadingDays, setLoadingDays] = useState(true);

    /**
     * Calls the Update Days API, which removes all 
     * unnecessary Days (past days and days further away
     * than ten), and calls getDays() after.
     * Loads days data into global state when isLoadingDays
     * is true, e.g. on first render or after adding/deleting 
     * a meal.
     */
    useEffect(() => {
        if (!isLoadingDays) return;
        if (!isAuthenticated()) return;

        axios
            .get('/api/day/update')
            .then(() => {
                axios
                    .get('/api/days')
                    .then(response => {
                        setDays(JSON.parse(response.data));
                        setLoadingDays(false);
                    })
                ;
            })
        ;
    }, [isLoadingDays]);

    /**
     * Keep shopping list in global state variable
     * and pass it as props to subcomponents.
     */
    const [shoppingList, setShoppingList] = useState([]);
    const [isLoadingShoppingList, setLoadingShoppingList] = useState(true);

    /**
     * Load shopping list into global state when 
     * isLoadingShoppingList is true, e.g. on first render.
     */
    useEffect(() => {
        if (!isLoadingShoppingList) return;
        if (!isAuthenticated()) return;

        loadShoppingList(setShoppingList, () => {
            // Disable loading screen
            setLoadingShoppingList(false);
        });
    }, [isLoadingShoppingList]);

    /**
     * isAuthenticated
     * 
     * Returns true when the authenticated user has the admin role
     * and false otherwise.
     * 
     * @return {boolean} Returns true when the authenticated user has the admin role and false otherwise.
     */
    const isAuthenticated = () => {
        return user?.roles?.includes('ROLE_ADMIN');
    };

    /**
     * Props for subcomponents
     */
    const props = {
        // User
        'user': user,
        'setUser': setUser,
        'isLoadingUser': isLoadingUser,
        'setLoadingUser': setLoadingUser,

        // ShoppingList
        'shoppingList': shoppingList,
        'setShoppingList': setShoppingList,
        'isLoadingShoppingList': isLoadingShoppingList,
        'setLoadingShoppingList': setLoadingShoppingList,

        // Days
        'days': days,
        'isLoadingDays': isLoadingDays,
        'setLoadingDays': setLoadingDays,

        // Recipes
        'recipes': recipes,
        'setRecipes': setRecipes,
        'isLoadingRecipes': isLoadingRecipes,
        'setLoadingRecipes': setLoadingRecipes,
        'recipeIndex': recipeIndex,
        'setRecipeIndex': setRecipeIndex,

        // UserGroups
        'userGroups': userGroups,
        'setUserGroups': setUserGroups,
        'isLoadingUserGroups': isLoadingUserGroups,
        'setLoadingUserGroups': setLoadingUserGroups,

        // MealCategories
        'mealCategories': mealCategories,
        'setMealCategories': setMealCategories,
        'isLoadingMealCategories': isLoadingMealCategories,
        'setLoadingMealCategories': setLoadingMealCategories,

        // Sidebar
        'setSidebarActiveItem': setSidebarActiveItem, 
        'setSidebarActionButton': setSidebarActionButton,
    };

    /** 
     * Render
     */
    return (
        <BrowserRouter>
            <div className="flex items-start bg-blue-50 dark:bg-[#1D252C] min-h-screen text-gray-700 dark:text-gray-100">
                <Sidebar 
                    sidebarActiveItem={sidebarActiveItem} 
                    sidebarActionButton={sidebarActionButton}
                    {...props}
                />

                <Routes>
                    <Route path="/"                     element={!isAuthenticated() ? <Navigate to="/login" /> : <Planner {...props} />} />
                    <Route path="/planner"              element={!isAuthenticated() ? <Navigate to="/login" /> : <Planner {...props} />} />
                    <Route path="/planner/add"          element={!isAuthenticated() ? <Navigate to="/login" /> : <AddMeal {...props} />} />
                    <Route path="/planner/add/:id"      element={!isAuthenticated() ? <Navigate to="/login" /> : <AddMeal {...props} />} />
                    <Route path="/shoppinglist"         element={!isAuthenticated() ? <Navigate to="/login" /> : <ShoppingList {...props} />} />
                    <Route path="/recipes"              element={!isAuthenticated() ? <Navigate to="/login" /> : <Recipes {...props} />} />
                    <Route path="/recipe/add"           element={!isAuthenticated() ? <Navigate to="/login" /> : <AddRecipe {...props} />} />
                    <Route path="/recipe/:id"           element={!isAuthenticated() ? <Navigate to="/login" /> : <Recipes {...props} />} />
                    <Route path="/recipe/:id/edit"      element={!isAuthenticated() ? <Navigate to="/login" /> : <EditRecipe {...props} />} />
                    <Route path="/settings"             element={!isAuthenticated() ? <Navigate to="/login" /> : <Settings {...props} />} />
                    <Route path="/settings/groups/add"  element={!isAuthenticated() ? <Navigate to="/login" /> : <AddGroup {...props} />} />
                    <Route path="/login"                element={<Login {...props} />} />
                    <Route path="/logout"               element={<Logout {...props} />} />
                    <Route path="*"                     element={<PageNotFound {...props} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
