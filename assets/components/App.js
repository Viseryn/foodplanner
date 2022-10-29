import React, { useState } from "react";
import {Route, Routes, BrowserRouter} from 'react-router-dom';

import Sidebar from './Sidebar';
import Planner from './Planner';
import Recipes from './Recipes';
import Recipe from './Recipe';
import AddRecipe from './AddRecipe';
import PageNotFound from './PageNotFound';
import EditRecipe from "./EditRecipe";
import Pantry from "./Pantry";
import ShoppingList from "./ShoppingList";
import AddMeal from "./AddMeal";

export default function App() {
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
            <div className="flex bg-blue-50">
                <Sidebar sidebarActiveItem={sidebarActiveItem} sidebarActionButton={sidebarActionButton} />

                <div className="px-6 py-10 pb-28 md:my-8 md:mr-8 md:pb-10 md:px-10
                    md:rounded-3xl bg-white text-gray-700 
                    w-full md:max-w-[900px]">
                    <Routes>
                        <Route path="/"                 element={<Planner       {...setSidebarProps} />} />
                        <Route path="/planner"          element={<Planner       {...setSidebarProps} />} />
                        <Route path="/planner/add"      element={<AddMeal       {...setSidebarProps} />} />
                        <Route path="/planner/add/:id"  element={<AddMeal       {...setSidebarProps} />} />
                        <Route path="/pantry"           element={<Pantry        {...setSidebarProps} />} />
                        <Route path="/shoppinglist"     element={<ShoppingList  {...setSidebarProps} />} />
                        <Route path="/recipes"          element={<Recipes       {...setSidebarProps} />} />
                        <Route path="/recipe/:id"       element={<Recipe        {...setSidebarProps} />} />
                        <Route path="/recipe/add"       element={<AddRecipe     {...setSidebarProps} />} />
                        <Route path="/recipe/:id/edit"  element={<EditRecipe    {...setSidebarProps} />} />
                        <Route path="*"                 element={<PageNotFound  {...setSidebarProps} />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}
