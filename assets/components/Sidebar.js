import React, {Component} from 'react';
import {Link} from 'react-router-dom';

function SidebarActionButton(props) {
    let baseStyle = 'flex items-center p-4 rounded-2xl transition duration-300 h-14';
    let invisibleStyle = baseStyle + ' text-transparent bg-transparent cursor-default';
    let visibleStyle = baseStyle + ' text-gray-900 bg-pink-200 hover:bg-pink-300 active:bg-pink-400 active:scale-90';

    return (
        <li className="sidebar-action-button">
            <Link 
                to={props.sidebarActionButton.path}
                className={props.sidebarActionButton.visible ? visibleStyle : invisibleStyle}
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
    let baseStyle = 'flex items-center p-4 rounded-2xl transition duration-300 h-14';
    let invisibleStyle = baseStyle + ' text-transparent bg-transparent cursor-default';
    let visibleStyle = baseStyle + ' text-gray-900 bg-pink-200 hover:bg-pink-300 active:bg-pink-400 active:scale-90';

    return (
        <li className="sidebar-action-button">
            <Link 
                to={props.sidebarActionButton.path}
                className={props.sidebarActionButton.visible ? visibleStyle : invisibleStyle}
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

function SidebarItem(props) {
    let baseLinkStyle = 'flex items-center p-4 rounded-full transition duration-300 hover:bg-blue-100 active:bg-blue-200 active:scale-90 group';
    let activeLinkStyle = baseLinkStyle + ' bg-blue-100';

    let baseSpanStyle = 'material-symbols-rounded transition duration-300 lg:group-hover:text-gray-900';
    let activeSpanStyle = baseSpanStyle + ' text-gray-900';

    return (
        <li>
            <Link 
                className={props.sidebarActiveItem == props.id ? activeLinkStyle : baseLinkStyle}
                to={'/' + props.id}
            >
                <span className={props.sidebarActiveItem == props.id ? activeSpanStyle : baseSpanStyle + ' text-gray-500'}>
                    {props.icon}
                </span>
            </Link>
        </li>
    );
}

function SidebarItemExtended(props) {
    let baseLinkStyle = 'flex items-center p-4 rounded-full transition duration-300 hover:bg-blue-100 active:bg-blue-200 active:scale-90 group';
    let activeLinkStyle = baseLinkStyle + ' bg-blue-100';

    let baseSpanStyle = 'transition duration-300 group-hover:text-gray-900';
    let activeSpanStyle = baseSpanStyle + ' text-gray-900';

    return (
        <li>
            <Link 
                className={props.sidebarActiveItem == props.id ? activeLinkStyle : baseLinkStyle}
                to={'/' + props.id}
            >
                <span className={'material-symbols-rounded ' + (props.sidebarActiveItem == props.id ? activeSpanStyle : baseSpanStyle + ' text-gray-500')}>
                    {props.icon}
                </span>
                <span className={(props.sidebarActiveItem == props.id ? activeSpanStyle : baseSpanStyle) + ' text-gray-500 ml-4 font-semibold'}>{props.label}</span>
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

export default class Sidebar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <aside 
                id="sidebar" 
                className="z-50 bg-blue-50 w-full fixed bottom-0 h-20 lg:w-24 lg:min-h-screen lg:static lg:flex lg:justify-center"
            >
                <div className="pl-3 pr-6 py-3 md:pl-7 md:pr-10 lg:px-3 lg:py-7 w-full lg:max-w-fit flex justify-between lg:block fixed">
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
                        
                        <SidebarActionButton sidebarActionButton={this.props.sidebarActionButton} />
                    </ul>

                    <ul className="flex flex-row space-x-1 lg:flex-col lg:space-x-0 lg:space-y-2">
                        <SidebarItem 
                            sidebarActiveItem={this.props.sidebarActiveItem}
                            id="planner"
                            icon="date_range"
                        />
                        <SidebarItem 
                            sidebarActiveItem={this.props.sidebarActiveItem}
                            id="recipes"
                            icon="fastfood"
                        />
                        <SidebarItem 
                            sidebarActiveItem={this.props.sidebarActiveItem}
                            id="pantry"
                            icon="kitchen"
                        />
                        <SidebarItem 
                            sidebarActiveItem={this.props.sidebarActiveItem}
                            id="shoppinglist"
                            icon="shopping_cart"
                        />
                    </ul>
                        
                    <ul className="lg:hidden">
                        <SidebarActionButton sidebarActionButton={this.props.sidebarActionButton} />
                    </ul>
                </div>
            </aside>
        );
    }
}