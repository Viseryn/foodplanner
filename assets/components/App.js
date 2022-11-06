import React, { useState } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Sidebar from './Sidebar';
import Planner from './Planner';
import Recipes from './Recipes';
import AddRecipe from './AddRecipe';
import PageNotFound from './PageNotFound';
import EditRecipe from "./EditRecipe";
import Pantry from "./Pantry";
import ShoppingList from "./ShoppingList";
import AddMeal from "./AddMeal";
import Login from "./Login";
import Logout from "./Logout";

export default function App() {
    // Sidebar state variables
    const [sidebarActiveItem, setSidebarActiveItem] = useState('');
    const [sidebarActionButton, setSidebarActionButton] = useState({
        visible: false,
        icon: '',
        path: '#',
        label: '',
        onClickHandler: () => {},
    }); // Maybe make each one its own state variable

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
