/*
 * app.js
 */

// loads the jquery package from node_modules
// var $ = require('jquery');
// global.$ = global.jQuery = $;

// // load custom js
import './custom';

// Import CSS
import './styles/app.scss';

// Start the Stimulus application
import './bootstrap';

// Import SweetAlert
import swal from 'sweetalert';

// Import React
import React, {Component} from 'react';
import ReactDOM from 'react-dom/client';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';

// Import React components
import Sidebar from './components/Sidebar';
import Planner from './components/Planner';
import Recipes from './components/Recipes';

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <div className="flex bg-blue-50">
            <Sidebar />

            <div className="px-10 lg:mt-8 py-8 pb-28 lg:pb-8 lg:rounded-tl-3xl bg-white text-gray-700 w-full">
                <div className="max-w-[700px]">
                        <Routes>
                            <Route path="/planner" element={<Planner />} />
                            <Route path="/recipes" element={<Recipes />} />
                        </Routes>
                </div>
            </div>
        </div>
    </Router>
);
