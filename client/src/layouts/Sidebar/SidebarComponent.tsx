import { AuthenticationContext } from "@/context/AuthenticationContext"
import { SettingsContext } from "@/context/SettingsContext"
import { SidebarContext } from "@/context/SidebarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { SidebarActionButton } from "@/layouts/Sidebar/components/SidebarActionButton"
import { SidebarDrawerButton } from "@/layouts/Sidebar/components/SidebarDrawerButton"
import { SidebarItem } from "@/layouts/Sidebar/components/SidebarItem"
import { Settings } from "@/types/api/Settings"
import { Authentication } from "@/types/Authentication"
import { HOMEPAGE_CONFIGS } from "@/types/constants/HOMEPAGE_CONFIGS"
import { HomepageConfig } from "@/types/enums/HomepageConfig"
import { ManagedResource } from "@/types/ManagedResource"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { ReactElement, useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * A layout component that renders the sidebar. On mobile screens, the sidebar transforms into a
 * bottom navigation bar according to the Material Design 3 specs. On medium screens, the sidebar
 * becomes a navigation rail on the left side. On extra large screens the buttons expand and show an
 * additional text label.
 *
 * The sidebar also has a SidebarActionButton, which acts as Floating Action Button on small screens
 * and has a fixed position in the sidebar on larger screens.
 *
 * @todo Maybe this component should be renamed in something like "NavigationBar" so it sounds more important.
 */
export const SidebarComponent = (): ReactElement => {
    const settings: ManagedResource<Settings> = useNullishContext(SettingsContext)
    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)

    // Close drawer when location changes
    const location = useLocation()
    useEffect(() => {
        sidebar.configuration.isDrawerVisible(false)
    }, [location])

    return (
        <aside className="z-30 bg-bg dark:bg-bg-dark shrink-0 h-20 w-full md:w-24 md:min-w-24 md:min-h-screen xl:w-64 fixed bottom-0 md:static md:flex md:justify-center xl:justify-start">
            <div className="px-6 py-3 w-full fixed flex justify-between md:p-6 md:max-w-fit md:block xl:w-64 xl:max-w-none">
                <div className="w-full">
                    {/* Sidebar Drawer Button and Sidebar Action Button for large screens (md+) */}
                    <ul className="space-y-2 mb-16 hidden md:block">
                        <SidebarDrawerButton />
                        <SidebarActionButton />
                    </ul>

                    {/* Main navigation destinations, for all screen sizes */}
                    {authentication.isAuthenticated && (
                        <ul className="flex flex-row md:flex-col w-full justify-between md:space-x-0 md:space-y-2">
                            {HOMEPAGE_CONFIGS.map((homepageConfig: HomepageConfig) => {
                                const isItemPantry: boolean = homepageConfig.homepage === "PANTRY"
                                const isPantryVisible: boolean = settings.isLoading || !!settings.data?.showPantry

                                if (isItemPantry && !isPantryVisible) {
                                    return
                                }

                                return (
                                    <SidebarItem
                                        key={homepageConfig.page.id}
                                        id={homepageConfig.page.id}
                                        icon={homepageConfig.icon}
                                        label={homepageConfig.label}
                                    />
                                )
                            })}
                        </ul>
                    )}

                    {/* Floating Sidebar Action Button on mobile screens */}
                    <ul className="fixed md:hidden bottom-[6.5rem] right-6">
                        <SidebarActionButton floating={true} />
                    </ul>
                </div>
            </div>
        </aside>
    )
}
