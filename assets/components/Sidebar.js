import React from 'react';
import {Link} from 'react-router-dom';

let SABbaseStyle = 'flex items-center p-4 rounded-2xl transition duration-300 h-14';
let SABinvisibleStyle = SABbaseStyle + ' text-transparent bg-transparent cursor-default';
let SABvisibleStyle = SABbaseStyle + ' text-gray-900 bg-pink-300 hover:bg-pink-400 active:bg-pink-500 active:scale-90';

let baseLinkStyle = 'flex items-center p-4 rounded-full transition duration-300 hover:bg-blue-200 active:bg-blue-200 active:scale-90 group';
let activeLinkStyle = baseLinkStyle + ' bg-blue-200';

let baseSpanStyle = 'transition duration-300 text-gray-600 group-hover:text-gray-900';
let activeSpanStyle = baseSpanStyle + ' text-gray-900';

function SidebarActionButton(props) {
    return (
        <li className="sidebar-action-button">
            <Link 
                to={props.sidebarActionButton.path}
                className={props.sidebarActionButton.visible ? SABvisibleStyle : SABinvisibleStyle}
            >
                <span className="material-symbols-rounded">
                    {
                        props.sidebarActionButton.visible 
                        ? props.sidebarActionButton.icon
                        : ''
                    }
                </span>
            </Link>
        </li>
    );
}

function SidebarActionButtonExtended(props) {
    return (
        <li className="sidebar-action-button">
            <Link 
                to={props.sidebarActionButton.path}
                className={props.sidebarActionButton.visible ? SABvisibleStyle : SABinvisibleStyle}
            >
                <span className="material-symbols-rounded">
                    {
                        props.sidebarActionButton.visible 
                        ? props.sidebarActionButton.icon
                        : ''
                    }
                </span>
                <div className="w-full ml-4 font-semibold">{props.sidebarActionButton.label}</div>
            </Link>
        </li>
    );
}

function SidebarItemIcon(props) {
    return (
        <span className={'material-symbols-rounded ' + (props.sidebarActiveItem == props.id ? activeSpanStyle : baseSpanStyle)}>
            {props.icon}
        </span>
    );
}

function SidebarItem(props) {
    return (
        <li>
            <Link 
                className={props.sidebarActiveItem == props.id ? activeLinkStyle : baseLinkStyle}
                to={'/' + props.id}
            >
                <SidebarItemIcon {...props} />
            </Link>
        </li>
    );
}

function SidebarItemExtended(props) {
    return (
        <li>
            <Link 
                className={props.sidebarActiveItem == props.id ? activeLinkStyle : baseLinkStyle}
                to={'/' + props.id}
            >
                <SidebarItemIcon {...props} />
                <span className={(props.sidebarActiveItem == props.id ? activeSpanStyle : baseSpanStyle) + ' ml-4 font-semibold'}>{props.label}</span>
            </Link>
        </li>
    );
}

function SidebarExtended(props) {
    return (
        <aside 
            id="sidebar" 
            className="hidden z-50 bg-blue-50 w-64 min-h-screen static xl:flex justify-start"
        >
            <div className="px-6 py-7 w-64 fixed">
                <ul className="space-y-2 mb-16 block">
                    <li className="w-min">
                        <Link 
                            className="flex items-center p-4 text-gray-900 rounded-full transition duration-300 hover:bg-blue-100 active:bg-blue-200 active:scale-90 group"
                            to="#"
                        >
                            <span className="material-symbols-rounded text-gray-500 transition duration-300 group-hover:text-gray-900">
                                menu
                            </span>
                        </Link>
                    </li>
                    
                    <SidebarActionButtonExtended sidebarActionButton={props.sidebarActionButton} />
                </ul>

                <ul className="flex flex-col space-x-0 space-y-2">
                    <SidebarItemExtended 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="planner"
                        icon="date_range"
                        label="Wochenplan"
                    />
                    <SidebarItemExtended 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="recipes"
                        icon="fastfood"
                        label="Rezepte"
                    />
                    <SidebarItemExtended 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="pantry"
                        icon="kitchen"
                        label="Vorratsschrank"
                    />
                    <SidebarItemExtended 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="shoppinglist"
                        icon="shopping_cart"
                        label="Einkaufsliste"
                    />
                </ul>
            </div>
        </aside>
    );
}

export default function Sidebar(props) {
    return (
        <>
            <SidebarExtended
                sidebarActiveItem={props.sidebarActiveItem}
                sidebarActionButton={props.sidebarActionButton}
            />    
            <aside 
                id="sidebar" 
                className="z-50 bg-blue-50 w-full fixed bottom-0 h-20 lg:w-24 lg:min-h-screen lg:static lg:flex lg:justify-center xl:hidden"
            >
                <div className="pl-3 pr-6 py-3 md:pl-7 md:pr-10 lg:px-6 lg:py-7 w-full lg:max-w-fit flex justify-between lg:block fixed">
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
                        
                        <SidebarActionButton sidebarActionButton={props.sidebarActionButton} />
                    </ul>

                    <ul className="flex flex-row space-x-1 lg:flex-col lg:space-x-0 lg:space-y-2">
                        <SidebarItem 
                            sidebarActiveItem={props.sidebarActiveItem}
                            id="planner"
                            icon="date_range"
                        />
                        <SidebarItem 
                            sidebarActiveItem={props.sidebarActiveItem}
                            id="recipes"
                            icon="fastfood"
                        />
                        <SidebarItem 
                            sidebarActiveItem={props.sidebarActiveItem}
                            id="pantry"
                            icon="kitchen"
                        />
                        <SidebarItem 
                            sidebarActiveItem={props.sidebarActiveItem}
                            id="shoppinglist"
                            icon="shopping_cart"
                        />
                    </ul>
                        
                    <ul className="lg:hidden">
                        <SidebarActionButton sidebarActionButton={props.sidebarActionButton} />
                    </ul>
                </div>
            </aside>
        </>
    );
}