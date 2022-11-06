import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

/**
 * Break points for the sidebar:
 * size < md: Sidebar is on the bottom.
 * md <= size < xl: Sidebar is on the side, but retracted.
 * xl <= size: Sidebar is on the side and extended.
 */

export default function Sidebar(props) {
    const location = useLocation();
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [user, setUser] = useState([]);

    /**
     * getUser
     * 
     * Calls the User API, which responds with an 
     * array containing the username and user roles
     * (if authenticated), or an empty array elsewise.
     */
     const getUser = () => {
        axios
            .get('/api/user')
            .then(response => {
                setUser(JSON.parse(response.data));
            });
    }
 
    // When route changes, close drawer and load user data
    useEffect(() => {
        setDrawerVisible(false);
        getUser();
    }, [location]);

    return (
        <>
            {/* SidebarDrawer */}
            <aside className={
                'z-50 fixed h-full w-full ease-in-out duration-300' 
                + (isDrawerVisible ? '' : ' -translate-x-full')
            }>
                <div className="bg-white dark:bg-[#29353f] rounded-r-3xl h-full w-80 px-6 py-7">
                    <ul className="mb-2 block w-fit">
                        <SidebarDrawerButton
                            isDrawerVisible={isDrawerVisible}
                            setDrawerVisible={setDrawerVisible} 
                            icon="close"
                        />
                    </ul>

                    <ul className="flex flex-col space-y-2">
                        {user?.username === undefined 
                            ? <SidebarItem 
                                id="login"
                                icon="login"
                                label="Einloggen"
                                isDrawerVisible={isDrawerVisible}
                            />
                            : <>
                                <SidebarItem 
                                    id="login"
                                    icon="account_circle"
                                    label={'Willkommen, ' + user?.username + '!'}
                                    isDrawerVisible={isDrawerVisible}
                                />
                                <SidebarItem 
                                    id="logout"
                                    icon="logout"
                                    label="Ausloggen"
                                    isDrawerVisible={isDrawerVisible}
                                />
                            </>
                        }
                        <SidebarItem 
                            id="register"
                            icon="person_add"
                            label="Registrieren"
                            isDrawerVisible={isDrawerVisible}
                        />
                    </ul>
                    <hr className="my-4" />
                    <ul className="flex flex-col space-y-2">
                        <SidebarItem 
                            path="https://github.com/Viseryn/foodplanner"
                            id="github"
                            icon="developer_mode"
                            label="GitHub"
                            isDrawerVisible={isDrawerVisible}
                        />
                        <SidebarItem 
                            path="https://yusel.net/blog"
                            id="blog"
                            icon="web"
                            label="Blog"
                            isDrawerVisible={isDrawerVisible}
                        />
                    </ul>
                </div>
            </aside>
            <div className={
                'bg-gradient-to-r from-black/75 h-full w-full z-40 fixed duration-300'
                + (isDrawerVisible ? '' : ' opacity-0 -translate-x-full')
            }>
            </div>

            {/* Sidebar */}
            <aside className="z-30 bg-blue-50 dark:bg-[#1D252C] shrink-0 h-20 w-full md:w-24 md:min-w-24 md:min-h-screen xl:w-64 fixed bottom-0 md:static md:flex md:justify-center xl:justify-start">
                <div className="pl-4 pr-6 py-3 w-full fixed flex justify-between md:px-6 md:py-7 md:max-w-fit md:block xl:w-64 xl:max-w-none">
                    <SidebarContent 
                        isDrawerVisible={isDrawerVisible}
                        setDrawerVisible={setDrawerVisible} 
                        {...props} 
                    />
                </div>
            </aside>
        </>
    );
}

function SidebarContent(props) {
    return (
        <>
            <ul className="space-y-2 mb-16 hidden md:block">
                <SidebarDrawerButton
                    isDrawerVisible={props.isDrawerVisible}
                    setDrawerVisible={props.setDrawerVisible} 
                />
                
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
                {/* <SidebarItem 
                    sidebarActiveItem={props.sidebarActiveItem}
                    id="pantry"
                    icon="kitchen"
                    label="Vorratskammer"
                /> */}
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

function SidebarDrawerButton(props) {
    return (
        <li className="xl:w-min">
            <div 
                className="flex items-center p-4 rounded-full transition duration-300 hover:bg-blue-200 dark:hover:bg-[#1f3953] active:bg-blue-200 active:scale-90 group cursor-pointer"
                onClick={() => props.setDrawerVisible(!props.isDrawerVisible)}
            >
                <span className="material-symbols-rounded transition duration-300 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                    {props.icon || 'menu'}
                </span>
            </div>
        </li>
    );
}

function SidebarActionButton(props) {
    let SABbaseStyle = 'flex items-center p-4 rounded-2xl transition duration-300 h-14 w-14 xl:w-auto';
    let SABinvisibleStyle = SABbaseStyle + ' text-transparent bg-transparent cursor-default';
    let SABvisibleStyle = SABbaseStyle + ' text-gray-900 dark:text-gray-300 bg-pink-300 dark:bg-pink-800 hover:bg-pink-400 dark:hover:bg-pink-600 active:bg-pink-500 active:scale-90';

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
    const baseLinkStyle = 'flex items-center p-4 rounded-full transition duration-300 hover:bg-blue-200 dark:hover:bg-[#1f3953] active:bg-blue-200 active:scale-90 group';
    const activeLinkStyle = baseLinkStyle + ' bg-blue-200 dark:bg-[#1f3953]';
    const linkStyle = props.sidebarActiveItem == props.id ? activeLinkStyle : baseLinkStyle;

    const baseLabelStyle = 'transition duration-300 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 flex items-center';
    const activeLabelStyle = baseLabelStyle + ' text-gray-900 dark:text-gray-200';
    const labelStyle = props.sidebarActiveItem == props.id ? activeLabelStyle : baseLabelStyle;

    const SidebarItemContent = (
        <div className={labelStyle}>
            <span className="material-symbols-rounded">{props.icon}</span>
            <span className={
                'xl:block ml-4 font-semibold'
                + (props.isDrawerVisible ? ' block' : ' hidden')
            }>{props.label}</span>
        </div>
    );

    return (
        <li>
            {props.path ? (
                <a href={props.path} className={linkStyle}>
                    {SidebarItemContent}
                </a>
            ) : (
                <Link to={'/' + props.id} className={linkStyle}>
                    {SidebarItemContent}
                </Link>
            )}
        </li>
    );
}