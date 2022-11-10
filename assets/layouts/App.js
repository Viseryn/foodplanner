/***************************
 * ./assets/layouts/App.js *
 ***************************/

import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import axios from "axios";

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
     * Render
     */
    return (
        <BrowserRouter>
            <div className="flex items-start bg-blue-50 dark:bg-[#1D252C] min-h-screen text-gray-700 dark:text-gray-100">
                <Sidebar 
                    sidebarActiveItem={sidebarActiveItem} 
                    sidebarActionButton={sidebarActionButton}
                />

                <Routes>
                    <Route path="/"                 element={<Planner       {...setSidebarProps} />} />
                    <Route path="/planner"          element={<Planner       {...setSidebarProps} />} />
                    <Route path="/pantry"           element={<Pantry        {...setSidebarProps} />} />
                    <Route path="/planner/add"      element={<AddMeal       {...setSidebarProps} {...setRecipesProps} />} />
                    <Route path="/planner/add/:id"  element={<AddMeal       {...setSidebarProps} {...setRecipesProps} />} />
                    <Route path="/shoppinglist"     element={<ShoppingList  {...setSidebarProps} />} />
                    <Route path="/recipes"          element={<Recipes       {...setSidebarProps} {...setRecipesProps} />} />
                    <Route path="/recipe/add"       element={<AddRecipe     {...setSidebarProps} {...setRecipesProps} />} />
                    <Route path="/recipe/:id"       element={<Recipes       {...setSidebarProps} {...setRecipesProps} />} />
                    <Route path="/recipe/:id/edit"  element={<EditRecipe    {...setSidebarProps} {...setRecipesProps} />} />
                    <Route path="/login"            element={<Login         {...setSidebarProps} />} />
                    <Route path="/logout"           element={<Logout        {...setSidebarProps} />} />
                    <Route path="*"                 element={<PageNotFound  {...setSidebarProps} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
