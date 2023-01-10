/***************************************
 * ./assets/layouts/Sidebar/Sidebar.js *
 ***************************************/

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import SidebarActionButton from './components/SidebarActionButton';

/**
 * Sidebar
 * 
 * A layout component that renders the sidebar.
 * 
 * Break points for the sidebar:
 * size < md: Sidebar is on the bottom.
 * size < xl: Sidebar is on the side, but retracted.
 * size > xl: Sidebar is on the side and extended.
 * 
 * @component
 * @property {string} sidebarActiveItem The id of the sidebar item that should be highlighted.
 * @property {Object} sidebarActionButton An object that contains the sidebar action button configuration.
 * @property {arr} user
 * @property {function} setUser
 * @property {boolean} isLoadingUser
 * @property {function} setLoadingUser
 * 
 * @example
 * <Sidebar
 *     sidebarActiveItem="recipes"
 *     sidebarActionButton={{
 *         visible: false,
 *         icon: '',
 *         path: '#',
 *         label: '',
 *         onClickHandler: () => {},
 *     }}
 * />
 */
export default function Sidebar(props) {
    /**
     * State variables
     */
    const location = useLocation();
    const [isDrawerVisible, setDrawerVisible] = useState(false);
 
    /**
     * Close drawer and load user data when route changes.
     */
    useEffect(() => {
        setDrawerVisible(false);
    }, [location]);

    /** 
     * Render
     */
    return (
        <>
            {/* SidebarDrawer */}
            <aside className={
                'z-[9000] fixed h-full ease-in-out duration-300' 
                + (isDrawerVisible ? '' : ' -translate-x-full')
            }>
                <div className="flex flex-col justify-start bg-bg dark:bg-bg-dark h-full w-80 px-6 pt-7 pb-3">
                    <SidebarDrawerContent
                        isDrawerVisible={isDrawerVisible}
                        setDrawerVisible={setDrawerVisible}
                        {...props} 
                    />
                </div>
            </aside>
            
            {/* Background gradient for sidebar drawer */}
            <div 
                className={
                    'bg-gradient-to-r from-black/75 h-full w-full z-[8000] fixed duration-300'
                    + (isDrawerVisible ? '' : ' opacity-0 -translate-x-full')
                } 
                onClick={() => setDrawerVisible(!isDrawerVisible)} 
            />

            {/* Sidebar */}
            <aside className="z-30 bg-bg dark:bg-bg-dark shrink-0 h-20 w-full md:w-24 md:min-w-24 md:min-h-screen xl:w-64 fixed bottom-0 md:static md:flex md:justify-center xl:justify-start">
                <div className="px-6 py-3 w-full fixed flex justify-between md:px-6 md:py-7 md:max-w-fit md:block xl:w-64 xl:max-w-none">
                    <SidebarContent 
                        isDrawerVisible={isDrawerVisible}
                        setDrawerVisible={setDrawerVisible} 
                        {...props} 
                    />
                </div>
            </aside>

            {/* Top bar for mobile screens */}
            <div className="pt-2 pl-2 -bg-blue-500 w-full md:hidden">
                <ul className="flex justify-start">
                    <SidebarDrawerButton
                        isDrawerVisible={isDrawerVisible}
                        setDrawerVisible={setDrawerVisible} 
                    />
                </ul>
            </div>
        </>
    );
}

/**
 * SidebarDrawerContent
 * 
 * A component that renders the content of the sidebar drawer.
 * Contains low-priority destinations as settings or sign in pages.
 * In the bottom right, the current version of the app is displayed.
 * 
 * @component
 * @property {function} setDrawerVisible A setter function of the property isDrawerVisible.
 * @property {boolean} isDrawerVisible Whether or not the sidebar drawer is visible now.
 * @property {arr} user
 * 
 * @example 
 * <SidebarContent isDrawerVisible={isDrawerVisible} setDrawerVisible={setDrawerVisible} {...props} />
 */
function SidebarDrawerContent(props) {
    return (
        <>
            <ul className="mb-2 w-fit">
                <SidebarDrawerButton
                    isDrawerVisible={props.isDrawerVisible}
                    setDrawerVisible={props.setDrawerVisible} 
                    icon="close"
                />
            </ul>

            <ul className="flex flex-col space-y-2">
                {props.user?.username === undefined
                    ? (
                        <>
                            <SidebarItem 
                                id="login"
                                icon="login"
                                label="Einloggen"
                                isDrawerVisible={props.isDrawerVisible}
                            />
                            <SidebarItem 
                                id="register"
                                icon="person_add"
                                label="Registrieren"
                                isDrawerVisible={props.isDrawerVisible}
                            />
                        </>
                    ) : (
                        <>
                            <SidebarItem 
                                id="logout"
                                icon="logout"
                                label="Ausloggen"
                                isDrawerVisible={props.isDrawerVisible}
                            />
                            <SidebarItem 
                                id="settings"
                                icon="settings"
                                label="Einstellungen"
                                isDrawerVisible={props.isDrawerVisible}
                            />
                        </>
                    )
                }
            </ul>

            <hr className="my-4 border-t-secondary-dark-300" />

            <ul className="flex flex-col space-y-2">
                <SidebarItem 
                    path="https://github.com/Viseryn/foodplanner"
                    id="github"
                    icon="developer_mode"
                    label="GitHub"
                    isDrawerVisible={props.isDrawerVisible}
                />
                <SidebarItem 
                    path="https://yusel.net/blog"
                    id="blog"
                    icon="web"
                    label="Blog"
                    isDrawerVisible={props.isDrawerVisible}
                />
            </ul>

            <div className="text-xs flex justify-end absolute bottom-5 right-5">
                v1.2.0
            </div>
        </>
    );
}

/**
 * SidebarContent
 * 
 * A component that renders the content of the main sidebar.
 * Responsively switches between a flex-row on small screens 
 * and a flex-col on larger screens. Contains SidebarDrawerButtons,
 * SidebarItems and a SidebarActionButton.
 * 
 * @component
 * @property {function} setDrawerVisible A setter function of the property isDrawerVisible.
 * @property {boolean} isDrawerVisible Whether or not the sidebar drawer is visible now.
 * @property {string} sidebarActiveItem The id of the sidebar item that should be highlighted.
 * @property {Object} sidebarActionButton An object that contains the sidebar action button configuration.
 * 
 * @example 
 * <SidebarContent isDrawerVisible={isDrawerVisible} setDrawerVisible={setDrawerVisible} {...props} />
 */
function SidebarContent(props) {
    return (
        <>
            {/* Sidebar for small screens becomes bottom navbar */}
            <div className="md:hidden w-full">
                <ul className="flex flex-row w-full justify-between">
                    <BottomNavbarItem 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="planner"
                        icon="date_range"
                        label="Wochenplan"
                    />
                    <BottomNavbarItem 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="recipes"
                        icon="receipt_long"
                        label="Rezepte"
                    />
                    <BottomNavbarItem 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="shoppinglist"
                        icon="shopping_cart"
                        label="Einkaufsliste"
                    />
                    {(props.settings.showPantry 
                        || !props.isAuthenticated()
                        || props.isLoadingSettings) 
                    &&
                        <BottomNavbarItem 
                            sidebarActiveItem={props.sidebarActiveItem}
                            id="pantry"
                            icon="shelves"
                            label="Vorrat"
                        />
                    }
                </ul>

                <ul className="fixed bottom-[6.5rem] right-6">
                    <SidebarActionButton floating={true} sidebarActionButton={props.sidebarActionButton} />
                </ul>
            </div>

            {/* Sidebar for large screens (md+) */}
            <div className="hidden md:block">
                {/* Sidebar Drawer Button and SAB for large screens */}
                <ul className="space-y-2 mb-16 hidden md:block">
                    <SidebarDrawerButton
                        isDrawerVisible={props.isDrawerVisible}
                        setDrawerVisible={props.setDrawerVisible} 
                    />
                    
                    <SidebarActionButton sidebarActionButton={props.sidebarActionButton} />
                </ul>

                {/* Main navigation destinations, for all screen sizes */}
                <ul className="flex flex-row w-full justify-between space-x-1 md:flex-col md:space-x-0 md:space-y-2">
                    <SidebarDrawerButton
                        isDrawerVisible={props.isDrawerVisible}
                        setDrawerVisible={props.setDrawerVisible} 
                        className="md:hidden"
                    />
                    <SidebarItem 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="planner"
                        icon="date_range"
                        label="Wochenplan"
                    />
                    <SidebarItem 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="recipes"
                        icon="receipt_long"
                        label="Rezepte"
                    />
                    <SidebarItem 
                        sidebarActiveItem={props.sidebarActiveItem}
                        id="shoppinglist"
                        icon="shopping_cart"
                        label="Einkaufsliste"
                    />
                    {(props.settings.showPantry 
                        || !props.isAuthenticated()
                        || props.isLoadingSettings) 
                    &&
                        <SidebarItem 
                            sidebarActiveItem={props.sidebarActiveItem}
                            id="pantry"
                            icon="shelves"
                            label="Vorratskammer"
                        />
                    }
                </ul>
            </div>
        </>
    );
}

/**
 * SidebarDrawerButton
 * 
 * A component that renders a menu button that toggles the sidebar drawer.
 * 
 * @component
 * @property {string} className Additional css classes for the <li> element.
 * @property {function} setDrawerVisible A setter function of the property isDrawerVisible.
 * @property {boolean} isDrawerVisible Whether or not the sidebar drawer is visible now.
 * @property {string} icon The icon of the menu button. Default is 'menu'.
 * 
 * @example 
 * <SidebarDrawerButton
 *     isDrawerVisible={isDrawerVisible}
 *     setDrawerVisible={setDrawerVisible} 
 *     icon="close"
 *     className="md:hidden"
 * />
 */
function SidebarDrawerButton(props) {
    return (
        <li className={'xl:w-min ' + props?.className}>
            <div 
                className="flex items-center p-4 rounded-full transition duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:scale-90 group cursor-pointer"
                onClick={() => props.setDrawerVisible(!props.isDrawerVisible)}
            >
                <span className="material-symbols-rounded transition duration-300 group-hover:text-primary-200 dark:group-hover:text-primary-dark-100">
                    {props.icon || 'menu'}
                </span>
            </div>
        </li>
    );
}

/**
 * SidebarItem
 * 
 * A component that renders a single sidebar item, i.e. 
 * a <li> element that contains an icon and a label.
 * 
 * @component
 * @property {string} sidebarActiveItem The id of the sidebar item that should be highlighted.
 * @property {boolean} isDrawerVisible Whether the drawer is open or not. If yes, the label is always shown.
 * @property {?string} path An external URL. 
 * @property {string} id The id of the component this sidebar item should link to. Default is '/'. Will be overriden if path is set.
 * @property {string} icon The icon of the sidebar item. 
 * @property {string} label The label of the sidebar item.
 * 
 * @example
 * <SidebarItem
 *     sidebarActiveItem={props.sidebarActiveItem}
 *     id="planner"
 *     icon="date_range"
 *     label="Wochenplan"
 * />
 */
function SidebarItem(props) {
    const baseLinkStyle = 'flex items-center p-4 rounded-full transition duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:bg-secondary-200 active:scale-90 group';
    const activeLinkStyle = baseLinkStyle + ' bg-secondary-200 dark:bg-secondary-dark-200';
    const linkStyle = props.sidebarActiveItem == props.id ? activeLinkStyle : baseLinkStyle;

    const baseLabelStyle = 'transition duration-300 group-hover:text-primary-200 dark:group-hover:text-primary-dark-100 flex items-center';
    const activeLabelStyle = baseLabelStyle + ' text-primary-200 dark:text-primary-dark-100';
    const labelStyle = props.sidebarActiveItem == props.id ? activeLabelStyle : baseLabelStyle;

    const SidebarItemContent = (
        <div className={labelStyle}>
            <span className={'material-symbols-rounded' + (props.sidebarActiveItem == props.id ? '' : ' outlined')}>
                {props.icon}
            </span>
            <span className={
                'xl:block ml-4 font-semibold'
                + (props.isDrawerVisible ? ' block' : ' hidden')
            }>
                {props.label}
            </span>
        </div>
    );

    return (
        <li>
            {props.path ? (
                <a href={props.path} className={linkStyle} target="_blank" rel="noopener noreferrer">
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

/**
 * BottomNavbarItem
 * 
 * A component that renders a single bottom navbar item, i.e. 
 * a <li> element that contains an icon and a label.
 * 
 * @component
 * @property {string} sidebarActiveItem The id of the bottom navbar item that should be highlighted.
 * @property {string} id The id of the component this bottom navbar item should link to. Default is '/'. 
 * @property {string} icon The icon of the bottom navbar item. 
 * @property {string} label The label of the bottom navbar item.
 * 
 * @example
 * <BottomNavbarItem
 *     sidebarActiveItem={props.sidebarActiveItem}
 *     id="planner"
 *     icon="date_range"
 *     label="Wochenplan"
 * />
 */
function BottomNavbarItem(props) {
    return (
        <li>
            <Link to={'/' + props.id} className="group">
                <div className={
                    'group-hover:text-primary-200 dark:group-hover:text-primary-dark-100 flex flex-col items-center'
                    + (props.sidebarActiveItem == props.id ? ' text-primary-200 dark:text-primary-dark-100' : '')
                }>
                    <span className={
                        'transition duration-300 material-symbols-rounded rounded-full w-16 h-8 '
                        + 'flex justify-center items-center group-hover:bg-secondary-200 dark:group-hover:bg-secondary-dark-200' 
                        + (props.sidebarActiveItem == props.id ? ' bg-secondary-200 dark:bg-secondary-dark-200' : ' outlined')
                    }>
                        {props.icon}
                    </span>
                    <span className="font-semibold mt-1 text-xs">
                        {props.label}
                    </span>
                </div>
            </Link>
        </li>
    );
}
