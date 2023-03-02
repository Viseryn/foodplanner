/****************************************
 * ./assets/layouts/Sidebar/Sidebar.tsx *
 ****************************************/

import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import SettingsModel from '@/types/SettingsModel'
import SidebarActionButton from './components/SidebarActionButton'
import SidebarDrawerButton from './components/SidebarDrawerButton'
import SidebarItem from './components/SidebarItem'

/**
 * A layout component that renders the sidebar. On mobile screens, the sidebar transforms into a 
 * bottom navigation bar according to the Material Design 3 specs. On medium screens, the sidebar 
 * becomes a navigation rail on the left side. On extra large screens the buttons expand and show an 
 * additional text label.
 * 
 * The sidebar also has a SidebarActionButton, which acts as Floating Action Button on small screens 
 * and has a fixed position in the sidebar on larger screens.
 * 
 * @component
 * @param props
 * @param props.sidebarActiveItem The id of the sidebar item that should be highlighted.
 * @param props.sidebarActionButton An object that contains the sidebar action button configuration.
 * @param props.isDrawerVisible A state variable that describes whether or not the sidebar drawer is visible.
 * @param props.setDrawerVisible The setter method of isDrawerVisible.
 * @param props.authentication The Authentication object.
 * @param props.settings A Settings object.
 * 
 * @todo Maybe this component should be renamed in something like "NavigationBar" so it sounds more important.
 */
export default function Sidebar({ 
    sidebarActiveItem, sidebarActionButton, isDrawerVisible, setDrawerVisible, authentication, settings, 
}: {
    sidebarActiveItem: string
    sidebarActionButton: SidebarActionButtonConfiguration
    isDrawerVisible: boolean
    setDrawerVisible: SetState<boolean>
    authentication: Authentication
    settings: EntityState<SettingsModel>
}): JSX.Element {
    // Close drawer when location changes
    const location = useLocation()

    useEffect(() => {
        setDrawerVisible(false)
    }, [location])

    // Render Sidebar
    return (
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
                    <ul className="flex flex-row md:flex-col w-full justify-between md:space-x-0 md:space-y-2">
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
                        {(settings.data?.showPantry || !authentication.isAuthenticated || settings.isLoading) &&
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
    )
}
