/**********************************************
 * ./assets/layouts/Sidebar/SidebarDrawer.tsx *
 **********************************************/

import React from 'react'

import SidebarDrawerButton from './components/SidebarDrawerButton'
import SidebarDrawerItem from './components/SidebarDrawerItem'

/**
 * A layout component that renders the sidebar drawer. The sidebar drawer is controlled by the state 
 * variable isDrawerVisible from the parent component. When this variable is set to true, the sidebar 
 * drawer will move into the display area together with some semi-transparent overlay for the rest 
 * of the screen. 
 * 
 * The sidebar drawer has a SidebarDrawerButton that can close the drawer again, and contains several 
 * links to less important pages (or even external websites). Lastly, the drawer also shows the 
 * current version number of the app.
 * 
 * @component
 * @param props
 * @param props.isDrawerVisible A state variable that describes whether or not the sidebar drawer is visible.
 * @param props.setDrawerVisible The setter method of isDrawerVisible.
 * @param props.version The current version number of the app.
 * @param props.authentication The Authentication object.
 */
export default function SidebarDrawer({ isDrawerVisible, setDrawerVisible, version, authentication }: {
    isDrawerVisible: boolean
    setDrawerVisible: SetState<boolean>
    version: string
    authentication: Authentication
}): JSX.Element {
    return (
        <>
            {/* SidebarDrawer */}
            <aside className={
                'z-[9000] fixed h-full ease-in-out duration-300' 
                + (isDrawerVisible ? '' : ' -translate-x-full')
            }>
                <div className="flex flex-col justify-start bg-bg dark:bg-bg-dark h-full w-80 p-2 md:p-6 pb-3">
                    <ul className="mb-2 w-fit">
                        <SidebarDrawerButton
                            isDrawerVisible={isDrawerVisible}
                            setDrawerVisible={setDrawerVisible} 
                            icon="close"
                        />
                    </ul>

                    <ul className="flex flex-col space-y-2">
                        {!authentication.isAuthenticated ? (
                            <>
                                <SidebarDrawerItem 
                                    id="login"
                                    icon="login"
                                    label="Einloggen"
                                />
                                <SidebarDrawerItem 
                                    id="register"
                                    icon="person_add"
                                    label="Registrieren"
                                />
                            </>
                        ) : (
                            <>
                                <SidebarDrawerItem 
                                    id="logout"
                                    icon="logout"
                                    label="Ausloggen"
                                />
                                <SidebarDrawerItem 
                                    id="settings"
                                    icon="settings"
                                    label="Einstellungen"
                                />
                            </>
                        )}
                        
                        <SidebarDrawerItem
                            onClick={() => location.reload()}
                            id="refresh"
                            icon="refresh"
                            label="Aktualisieren"
                        />
                    </ul>

                    <hr className="m-4 md:mx-0 border-t-secondary-dark-300" />

                    <ul className="flex flex-col space-y-2">
                        <SidebarDrawerItem 
                            path="https://github.com/Viseryn/foodplanner"
                            id="github"
                            icon="developer_mode"
                            label="GitHub"
                        />
                    </ul>

                    {/* Current version */}
                    <div className="text-xs flex justify-end absolute bottom-5 right-5">
                        {version}
                    </div>
                </div>
            </aside>
                
            {/* Background gradient for sidebar drawer */}
            <div 
                onClick={() => setDrawerVisible(!isDrawerVisible)} 
                className={
                    'bg-gradient-to-r from-black/75 duration-300 h-full w-full fixed z-[8000]'
                    + (isDrawerVisible ? '' : ' opacity-0 -translate-x-full')
                } 
            />
        </>
    )
}
