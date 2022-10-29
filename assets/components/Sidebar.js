import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar(props) {
    return (
        <aside className="z-50 bg-blue-50 shrink-0 h-20 w-full md:w-24 md:min-w-24 md:min-h-screen xl:w-64 fixed bottom-0 md:static md:flex md:justify-center xl:justify-start">
            <div className="pl-4 pr-6 py-3 w-full fixed flex justify-between md:px-6 md:py-7 md:max-w-fit md:block xl:w-64 xl:max-w-none">
                <SidebarContent {...props} />
            </div>
        </aside>
    );
}

function SidebarContent(props) {
    return (
        <>
            <ul className="space-y-2 mb-16 hidden md:block">
                <li className="xl:w-min">
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

            <ul className="flex flex-row space-x-1 md:flex-col md:space-x-0 md:space-y-2">
                <SidebarItem 
                    sidebarActiveItem={props.sidebarActiveItem}
                    id="planner"
                    icon="date_range"
                    label="Wochenplan"
                />
                <SidebarItem 
                    sidebarActiveItem={props.sidebarActiveItem}
                    id="recipes"
                    icon="fastfood"
                    label="Rezepte"
                />
                <SidebarItem 
                    sidebarActiveItem={props.sidebarActiveItem}
                    id="pantry"
                    icon="kitchen"
                    label="Vorratskammer"
                />
                <SidebarItem 
                    sidebarActiveItem={props.sidebarActiveItem}
                    id="shoppinglist"
                    icon="shopping_cart"
                    label="Einkaufsliste"
                />
            </ul>
                
            <ul className="md:hidden">
                <SidebarActionButton sidebarActionButton={props.sidebarActionButton} />
            </ul>
        </>
    );
}

function SidebarActionButton(props) {
    let SABbaseStyle = 'flex items-center p-4 rounded-2xl transition duration-300 h-14 w-14 xl:w-auto';
    let SABinvisibleStyle = SABbaseStyle + ' text-transparent bg-transparent cursor-default';
    let SABvisibleStyle = SABbaseStyle + ' text-gray-900 bg-pink-300 hover:bg-pink-400 active:bg-pink-500 active:scale-90';

    return (
        <li className="sidebar-action-button">
            <Link 
                to={props.sidebarActionButton?.path}
                className={props.sidebarActionButton?.visible ? SABvisibleStyle : SABinvisibleStyle}
                onClick={props.sidebarActionButton?.onClickHandler}
            >
                <span className="material-symbols-rounded">
                    {
                        props.sidebarActionButton?.visible 
                        ? props.sidebarActionButton?.icon
                        : ''
                    }
                </span>
                <div className="hidden xl:block w-full ml-4 font-semibold">{props.sidebarActionButton?.label}</div>
            </Link>
        </li>
    );
}

function SidebarItem(props) {
    const baseLinkStyle = 'flex items-center p-4 rounded-full transition duration-300 hover:bg-blue-200 active:bg-blue-200 active:scale-90 group';
    const activeLinkStyle = baseLinkStyle + ' bg-blue-200';
    const linkStyle = props.sidebarActiveItem == props.id ? activeLinkStyle : baseLinkStyle;

    const baseLabelStyle = 'transition duration-300 text-gray-600 group-hover:text-gray-900 flex items-center';
    const activeLabelStyle = baseLabelStyle + ' text-gray-900';
    const labelStyle = props.sidebarActiveItem == props.id ? activeLabelStyle : baseLabelStyle;

    return (
        <li>
            <Link to={'/' + props.id} className={linkStyle}>
                <div className={labelStyle}>
                    <span className="material-symbols-rounded">{props.icon}</span>
                    <span className="hidden xl:block ml-4 font-semibold">{props.label}</span>
                </div>
            </Link>
        </li>
    );
}