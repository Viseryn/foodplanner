import React, { Component } from "react";
import {Route, Routes, BrowserRouter} from 'react-router-dom';

import Planner from './Planner';
import Recipes from './Recipes';
import Recipe from './Recipe';
import AddRecipe from './AddRecipe';
import PageNotFound from './PageNotFound';
import EditRecipe from "./EditRecipe";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <div className="flex bg-blue-50">

                    <div className="px-10 lg:mt-8 py-10 pb-28 lg:pb-10 lg:rounded-tl-3xl bg-white text-gray-700 w-full lg:mr-8 lg:mb-8 lg:rounded-tr-3xl lg:rounded-b-3xl">
                        <Routes>
                            <Route path="/" element={
                                <Planner 
                                />
                            } />
                            <Route path="/planner" element={
                                <Planner 
                                />
                            } />
                            <Route path="/recipes" element={
                                <Recipes 
                                />
                            } />
                            <Route path="/recipe/:id" element={
                                <Recipe 
                                />
                            } />
                            <Route path="/recipe/add" element={
                                <AddRecipe 
                                />
                            } />
                            <Route path="/recipe/:id/edit" element={
                                <EditRecipe 
                                />
                            } />
                            <Route path="*" element={
                                <PageNotFound 
                                />
                            } />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}