/***************************
 * ./assets/layouts/App.js *
 ***************************/

import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import axios from "axios";

import generateDisplayName from '../util/generateDisplayName';

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

    const setUserProps = {
        'user': user,
        'isLoadingUser': isLoadingUser,
        'setLoadingUser': setLoadingUser,
    }

    /**
     * Load user data into global state when isLoadingUser
     * is true, e.g. on first render or after login/logout.
     */
    useEffect(() => {
        if (isLoadingUser) {
            axios
                .get('/api/user')
                .then(response => {
                    setUser(JSON.parse(response.data));
                    setLoadingUser(false);
                })
            ;
        }
    }, [isLoadingUser]);

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

    const setSidebarProps = {
        'setSidebarActiveItem': setSidebarActiveItem, 
        'setSidebarActionButton': setSidebarActionButton,
    };

    /**
     * Keep recipes in global state variable
     * and pass them as props to subcomponents.
     */
    const [recipes, setRecipes] = useState([]);
    const [isLoadingRecipes, setLoadingRecipes] = useState(true);
    const [recipeIndex, setRecipeIndex] = useState(-1);

    const setRecipesProps = {
        'recipes': recipes,
        'setRecipes': setRecipes,
        'isLoadingRecipes': isLoadingRecipes,
        'setLoadingRecipes': setLoadingRecipes,
        'recipeIndex': recipeIndex,
        'setRecipeIndex': setRecipeIndex,
    }

    /**
     * Load recipes into global state when isLoadingRecipes 
     * is true, e.g. on first render or after adding/editing
     * a recipe.
     */
    useEffect(() => {
        if (isLoadingRecipes) {
            axios
                .get('/api/recipes')
                .then(response => {
                    setRecipes(JSON.parse(response.data));
                    setLoadingRecipes(false);
                })
            ;
        }
    }, [isLoadingRecipes]);

    /**
     * Keep days in global state variable 
     * and pass them as props to subcomponents.
     */
    const [days, setDays] = useState([]);
    const [isLoadingDays, setLoadingDays] = useState(true);

    const setDaysProps = {
        'days': days,
        'isLoadingDays': isLoadingDays,
        'setLoadingDays': setLoadingDays,
    };

    /**
     * Calls the Update Days API, which removes all 
     * unnecessary Days (past days and days further away
     * than ten), and calls getDays() after.
     * Loads days data into global state when isLoadingDays
     * is true, e.g. on first render or after adding/deleting 
     * a meal.
     */
    useEffect(() => {
        if (isLoadingDays) {
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
        }
    }, [isLoadingDays]);

    /**
     * Keep shopping list in global state variable
     * and pass it as props to subcomponents.
     */
    const [shoppingList, setShoppingList] = useState([]);
    const [isLoadingShoppingList, setLoadingShoppingList] = useState(true);

    const setShoppingListProps = {
        'shoppingList': shoppingList,
        'setShoppingList': setShoppingList,
        'isLoadingShoppingList': isLoadingShoppingList,
        'setLoadingShoppingList': setLoadingShoppingList,
    };

    /**
     * Load shopping list into global state when 
     * isLoadingShoppingList is true, e.g. on first render.
     */
    useEffect(() => {
        if (isLoadingShoppingList) {
            axios
                .get('/api/shoppinglist')
                .then(response => {
                    let itemsRaw = JSON.parse(response.data);

                    itemsRaw.forEach(item => {
                        // Save original name of each item
                        item.originalName = item.name;

                        // Add quantity to the name field, which will be displayed.
                        // The Shopping List Update API will split everything later.
                        item.name = generateDisplayName(
                            item.quantity_value, 
                            item.quantity_unit, 
                            item.originalName
                        );
                    });

                    // Order list by position
                    const compareItems = (a, b) => {
                        if (a.position < b.position) return -1;
                        if (a.position > b.position) return 1;
                        return 0;
                    }

                    itemsRaw.sort(compareItems);

                    // Add list to state
                    setShoppingList(itemsRaw);
                    setLoadingShoppingList(false);
                })
            ;
        }
    }, [isLoadingShoppingList]);

    /** 
     * Render
     */
    return (
        <BrowserRouter>
            <div className="flex items-start bg-blue-50 dark:bg-[#1D252C] min-h-screen text-gray-700 dark:text-gray-100">
                <Sidebar 
                    sidebarActiveItem={sidebarActiveItem} 
                    sidebarActionButton={sidebarActionButton}
                    {...setUserProps}
                />

                <Routes>
                    <Route path="/"                 element={<Planner       {...setSidebarProps} 
                                                                            {...setDaysProps} />} />
                    <Route path="/planner"          element={<Planner       {...setSidebarProps} 
                                                                            {...setDaysProps}
                                                                            {...setShoppingListProps} />} />
                    <Route path="/planner/add"      element={<AddMeal       {...setSidebarProps} 
                                                                            {...setDaysProps} 
                                                                            {...setRecipesProps} />} />
                    <Route path="/planner/add/:id"  element={<AddMeal       {...setSidebarProps} 
                                                                            {...setDaysProps} 
                                                                            {...setRecipesProps} />} />
                    <Route path="/shoppinglist"     element={<ShoppingList  {...setSidebarProps}
                                                                            {...setShoppingListProps} />} />
                    <Route path="/recipes"          element={<Recipes       {...setSidebarProps} 
                                                                            {...setRecipesProps} />} />
                    <Route path="/recipe/add"       element={<AddRecipe     {...setSidebarProps} 
                                                                            {...setRecipesProps} />} />
                    <Route path="/recipe/:id"       element={<Recipes       {...setSidebarProps} 
                                                                            {...setRecipesProps}
                                                                            {...setShoppingListProps} />} />
                    <Route path="/recipe/:id/edit"  element={<EditRecipe    {...setSidebarProps} 
                                                                            {...setRecipesProps} />} />
                    <Route path="/login"            element={<Login         {...setSidebarProps} 
                                                                            {...setUserProps} />} />
                    <Route path="/logout"           element={<Logout        {...setSidebarProps} 
                                                                            {...setUserProps} />} />
                    <Route path="*"                 element={<PageNotFound  {...setSidebarProps} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
