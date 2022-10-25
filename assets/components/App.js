import React, { Component } from "react";
import {Route, Routes, BrowserRouter} from 'react-router-dom';

import Sidebar from './Sidebar';
import Planner from './Planner';
import Recipes from './Recipes';
import Recipe from './Recipe';
import AddRecipe from './AddRecipe';
import PageNotFound from './PageNotFound';
import EditRecipe from "./EditRecipe";

export default class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            sidebarActiveItem: '',
            sidebarActionButton: {
                visible: false,
                icon: '',
                path: '#',
            }
        };
    }

    updateSidebar(activeItem = '') {
        this.setState({
            sidebarActiveItem: activeItem
        })
    }

    updateSAB(visible = false, icon = '', path = '#') {
        this.setState({
            sidebarActionButton: {
                visible: visible,
                icon: icon,
                path: path,
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

                    <div className="px-10 lg:mt-8 py-10 pb-28 lg:pb-10 lg:rounded-tl-3xl bg-white text-gray-700 w-full lg:max-w-[900px] lg:mr-8 lg:mb-8 lg:rounded-tr-3xl lg:rounded-b-3xl">
                        <Routes>
                            <Route path="/" element={
                                <Planner 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path) => this.updateSAB(visible, icon, path)} 
                                />
                            } />
                            <Route path="/planner" element={
                                <Planner 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path) => this.updateSAB(visible, icon, path)} 
                                />
                            } />
                            <Route path="/recipes" element={
                                <Recipes 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path) => this.updateSAB(visible, icon, path)} 
                                />
                            } />
                            <Route path="/recipe/:id" element={
                                <Recipe 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path) => this.updateSAB(visible, icon, path)} 
                                />
                            } />
                            <Route path="/recipe/add" element={
                                <AddRecipe 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path) => this.updateSAB(visible, icon, path)} 
                                />
                            } />
                            <Route path="/recipe/:id/edit" element={
                                <EditRecipe 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path) => this.updateSAB(visible, icon, path)} 
                                />
                            } />
                            <Route path="*" element={
                                <PageNotFound 
                                    updateSidebar={(activeItem) => this.updateSidebar(activeItem)} 
                                    updateSAB={(visible, icon, path) => this.updateSAB(visible, icon, path)} 
                                />
                            } />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}