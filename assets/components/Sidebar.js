import React, {Component} from 'react';
import {BrowserRouter as Router, Link} from 'react-router-dom';

function SidebarActionButton(props) {
    return (
        <li>
            <Link 
                className="flex items-center p-4 rounded-2xl 
                    text-gray-900 bg-pink-200 
                    transition duration-300 
                    hover:bg-pink-300 active:bg-pink-400 active:scale-90" 
                to={props.path || '#'}
            >
                <span className="material-symbols-rounded">
                    {props.icon || 'drive_file_rename_outline'}
                </span>
            </Link>
        </li>
    );
}

function SidebarItem(props) {
    return (
        <li>
            <Link 
                id={'sidebar-' + (props.id || '')}
                className="sidebar-item flex items-center p-4 rounded-full transition duration-300 lg:hover:bg-blue-100 active:bg-blue-200 active:scale-90 group" 
                to={'/' + props.id || '#'}
            >
                <span className="material-symbols-rounded text-gray-500 transition duration-300 lg:group-hover:text-gray-900">
                    {props.icon || ''}
                </span>
            </Link>
        </li>
    );
}


export default class Sidebar extends Component {
    render() {
        return (
            <aside 
                    id="sidebar" 
                    className="z-50 bg-blue-50 w-full fixed bottom-0 h-20 lg:w-24 lg:min-h-screen lg:static lg:flex lg:justify-center"
            >
                <div className="pl-7 pr-10 py-3 w-full lg:max-w-fit flex justify-between lg:block lg:px-3 lg:py-7 fixed">
                    <ul className="space-y-2 mb-16 hidden lg:block">
                        <li>
                            <Link 
                                className="flex items-center p-4 text-gray-900 rounded-full transition duration-300 hover:bg-blue-100 active:bg-blue-200 active:scale-90 group"
                                to="#"
                            >
                                <span className="material-symbols-rounded text-gray-500 transition duration-300 group-hover:text-gray-900">
                                    menu
                                </span>
                            </Link>
                        </li>
                        
                        <SidebarActionButton 
                            path=""
                            icon=""
                        />
                    </ul>

                    <ul className="flex flex-row space-x-1 lg:flex-col lg:space-x-0 lg:space-y-2">
                        <SidebarItem 
                            id="planner"
                            icon="date_range"
                        />
                        <SidebarItem 
                            id="recipes"
                            icon="fastfood"
                        />
                        <SidebarItem 
                            id="pantry"
                            icon="kitchen"
                        />
                        <SidebarItem 
                            id="shoppinglist"
                            icon="shopping_cart"
                        />
                    </ul>
                    
                    <ul className="lg:hidden">
                        <SidebarActionButton 
                            path=""
                            icon=""
                        />
                    </ul>
                </div>
            </aside>
        );
    }
}