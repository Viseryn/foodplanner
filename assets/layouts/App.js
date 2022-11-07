import React, { useState } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Sidebar from '../layouts/Sidebar';

import Planner from '../pages/Planner/Planner';
import AddMeal from '../pages/Planner/AddMeal';

import Recipes from '../pages/Recipes/Recipes';
import AddRecipe from '../pages/Recipes/AddRecipe';
import EditRecipe from '../pages/Recipes/EditRecipe';

import Pantry from '../pages/Pantry/Pantry';
import ShoppingList from '../pages/ShoppingList/ShoppingList';
import Login from '../pages/Login/Login';
import Logout from '../pages/Logout/Logout';
import PageNotFound from '../pages/PageNotFound/PageNotFound';

/**
 * App
 */
export default function App() {
    // Sidebar state variables
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
                    <Route path="/planner/add"      element={<AddMeal       {...setSidebarProps} />} />
                    <Route path="/planner/add/:id"  element={<AddMeal       {...setSidebarProps} />} />
                    <Route path="/pantry"           element={<Pantry        {...setSidebarProps} />} />
                    <Route path="/shoppinglist"     element={<ShoppingList  {...setSidebarProps} />} />
                    <Route path="/recipes"          element={<Recipes       {...setSidebarProps} />} />
                    <Route path="/recipe/add"       element={<AddRecipe     {...setSidebarProps} />} />
                    <Route path="/recipe/:id"       element={<Recipes       {...setSidebarProps} />} />
                    <Route path="/recipe/:id/edit"  element={<EditRecipe    {...setSidebarProps} />} />
                    <Route path="/login"            element={<Login         {...setSidebarProps} />} />
                    <Route path="/logout"           element={<Logout        {...setSidebarProps} />} />
                    <Route path="*"                 element={<PageNotFound  {...setSidebarProps} />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
