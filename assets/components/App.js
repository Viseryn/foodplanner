import React, { Component } from "react";
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

export default class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            sidebarActiveItem: '',
            sidebarActionButton: {
                visible: false,
                icon: '',
                path: '#',
                label: '',
                onClickHandler: () => {},
            }
        };
    }

    updateSidebar(activeItem = '') {
        this.setState({
            sidebarActiveItem: activeItem
        })
    }

    updateSAB(visible = false, icon = '', path = '#', label = '', onClickHandler = () => {}) {
        this.setState({
            sidebarActionButton: {
                visible: visible,
                icon: icon,
                path: path,
                label: label,
                onClickHandler: onClickHandler,
            }
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="flex bg-blue-50">
                    <Sidebar 
                        sidebarActiveItem={this.state.sidebarActiveItem}
                        sidebarActionButton={this.state.sidebarActionButton} 
                    />

                    <div 
                        className="px-6 py-10 pb-28 md:my-8 md:mr-8 md:pb-10 md:px-10
                            md:rounded-3xl bg-white text-gray-700 
                            w-full md:max-w-[900px]"
                    >
                        <Routes>
                            <Route path="/" element={
                                <Planner 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="/planner" element={
                                <Planner 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="/planner/add" element={
                                <AddMeal 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="/planner/add/:id" element={
                                <AddMeal 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="/pantry" element={
                                <Pantry 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="/shoppinglist" element={
                                <ShoppingList 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="/recipes" element={
                                <Recipes 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="/recipe/:id" element={
                                <Recipe 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="/recipe/add" element={
                                <AddRecipe 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="/recipe/:id/edit" element={
                                <EditRecipe 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                            <Route path="*" element={
                                <PageNotFound 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path, label, onClickHandler) => this.updateSAB(visible, icon, path, label, onClickHandler)} 
                                />
                            } />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}