/***************************************
 * ./assets/layouts/Sidebar/Sidebar.js *
 ***************************************/

import React, { useEffect } from 'react'
import { useLocation }      from 'react-router-dom'

import SidebarActionButton  from './components/SidebarActionButton'
import SidebarDrawerButton  from './components/SidebarDrawerButton'
import SidebarItem          from './components/SidebarItem'

/**
 * Sidebar
 * 
 * A layout component that renders the sidebar.
 * On mobile screens, the sidebar transforms into a
 * bottom navigation bar according to the Material 
 * Design 3 specs. On medium screens, the sidebar 
 * becomes a navigation rail on the left side.
 * On extra large screens the buttons expand and 
 * show an additional text label.
 * 
 * The sidebar also has a SidebarActionButton, which 
 * acts as Floating Action Button on small screens 
 * and has a fixed position in the sidebar on larger 
 * screens.
 * 
 * @component
 * @property {string} sidebarActiveItem The id of the sidebar item that should be highlighted.
 * @property {object} sidebarActionButton An object that contains the sidebar action button configuration. See example for properties.
 * @property {boolean} isDrawerVisible A state variable that describes hether or not the sidebar drawer is visible.
 * @property {React.Dispatch<ReactSetStateAction<boolean>>} setDrawerVisible The setter method of isDrawerVisible.
 * @property {object} authentication An authentication object.
 * @property {object} settings A settings object.
 * 
 * @example
 * sidebarActionButton: {
 *     visible: boolean;
 *     icon: string;
 *     path: string;
 *     label: string;
 *     onClick: function;
 * }
 */
export default function Sidebar({ 
    sidebarActiveItem,
    sidebarActionButton,
    isDrawerVisible, 
    setDrawerVisible, 
    authentication,
    settings, 
}) {
    /**
     * The current location, i.e. the relative path.
     * 
     * @type {Location}
     */
    const location = useLocation()
 
    /**
     * Close drawer when location changes.
     */
    useEffect(() => {
        setDrawerVisible(false)
    }, [location])

    /** 
     * Render Sidebar
     */
    return (
        <>
            <aside className="z-30 bg-bg dark:bg-bg-dark shrink-0 h-20 w-full md:w-24 md:min-w-24 md:min-h-screen xl:w-64 fixed bottom-0 md:static md:flex md:justify-center xl:justify-start">
                <div className="px-6 py-3 w-full fixed flex justify-between md:p-6 md:max-w-fit md:block xl:w-64 xl:max-w-none">
                    <div className="w-full">
                        {/* Sidebar Drawer Button and Sidebar Action Button for large screens (md+) */}
                        <ul className="space-y-2 mb-16 hidden md:block">
                            <SidebarDrawerButton
                                isDrawerVisible={isDrawerVisible}
                                setDrawerVisible={setDrawerVisible} 
                            />
                            
                            <SidebarActionButton 
                                sidebarActionButton={sidebarActionButton} 
                            />
                        </ul>

                        {/* Main navigation destinations, for all screen sizes */}
                        <ul className={
                            'flex flex-row md:flex-col w-full justify-between md:space-x-0 md:space-y-2'
                        }>
                            <SidebarItem 
                                sidebarActiveItem={sidebarActiveItem}
                                id="planner"
                                icon="date_range"
                                label="Wochenplan"
                            />
                            <SidebarItem 
                                sidebarActiveItem={sidebarActiveItem}
                                id="recipes"
                                icon="receipt_long"
                                label="Rezepte"
                            />
                            <SidebarItem 
                                sidebarActiveItem={sidebarActiveItem}
                                id="shoppinglist"
                                icon="shopping_cart"
                                label="Einkaufsliste"
                            />
                            {(settings.data?.showPantry 
                                || !authentication.isAuthenticated
                                || settings.isLoading) 
                            &&
                                <SidebarItem 
                                    sidebarActiveItem={sidebarActiveItem}
                                    id="pantry"
                                    icon="shelves"
                                    label="Vorratskammer"
                                />
                            }
                        </ul>

                        {/* Floating Sidebar Action Button on mobile screens */}
                        <ul className="fixed md:hidden bottom-[6.5rem] right-6">
                            <SidebarActionButton 
                                sidebarActionButton={sidebarActionButton} 
                                floating={true} 
                            />
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    )
}
