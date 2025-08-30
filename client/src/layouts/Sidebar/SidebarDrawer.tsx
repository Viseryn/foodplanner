import { OuterCard } from "@/components/ui/Cards/OuterCard"
import { AuthenticationContext } from "@/context/AuthenticationContext"
import { SidebarContext } from "@/context/SidebarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { SidebarDrawerButton } from "@/layouts/Sidebar/components/SidebarDrawerButton"
import { SidebarDrawerItem } from "@/layouts/Sidebar/components/SidebarDrawerItem"
import { AppInformationSettingsModule } from "@/pages/Settings/components/AppInformationSettingsModule"
import { Authentication } from "@/types/Authentication"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { apiClient } from "@/util/apiClient"
import { ReactElement } from "react"

/**
 * A layout component that renders the sidebar drawer. The sidebar drawer is controlled by the
 * SidebarContext configuration `isDrawerVisible`. When this variable is set to true, the sidebar
 * drawer will move into the display area together with some semi-transparent overlay for the rest
 * of the screen.
 *
 * The sidebar drawer has a SidebarDrawerButton that can close the drawer again, and contains several
 * links to less important pages (or even external websites). Lastly, the drawer also shows the
 * current version number of the app.
 */
export const SidebarDrawer = (): ReactElement => {
    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)

    return (
        <>
            {/* SidebarDrawer */}
            <aside className={
                "z-[9000] fixed h-full ease-in-out duration-300"
                + (sidebar.isDrawerVisible ? "" : " -translate-x-full")
            }>
                <div className={"flex flex-col justify-between bg-bg dark:bg-bg-dark h-full w-80 p-2 md:p-6 pb-3"}>
                    <div className="flex flex-col justify-start">
                        <ul className="mb-2 w-fit">
                            <SidebarDrawerButton icon="close" />
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
                                        onClick={async (): Promise<void> => {
                                            await apiClient.get(`/api/logout`)
                                            location.reload()
                                        }}
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
                    </div>
                    <OuterCard>
                        <AppInformationSettingsModule />
                    </OuterCard>
                </div>
            </aside>

            {/* Background gradient for sidebar drawer */}
            <div
                onClick={() => sidebar.configuration.isDrawerVisible(!sidebar.isDrawerVisible)}
                className={
                    "bg-gradient-to-r from-black/75 duration-300 h-full w-full fixed z-[8000]"
                    + (sidebar.isDrawerVisible ? "" : " opacity-0 -translate-x-full")
                }
            />
        </>
    )
}
