import { AppContext } from "@/context/AppContext"
import { AuthenticationContext } from "@/context/AuthenticationContext"
import { MainViewWidthContext } from "@/context/MainViewWidthContext"
import { SidebarContext } from "@/context/SidebarContext"
import { UserContext } from "@/context/UserContext"
import { useAuthentication } from "@/hooks/useAuthentication"
import { useInstallation } from "@/hooks/useInstallation"
import { useRefreshDataTimestamp } from "@/hooks/useRefreshDataTimestamp"
import { useSidebar } from "@/hooks/useSidebar"
import { BaseLayout } from "@/layouts/BaseLayout"
import { MainView } from "@/layouts/MainView"
import { SettingsLoader } from "@/layouts/SettingsLoader"
import { SidebarComponent } from "@/layouts/Sidebar/SidebarComponent"
import { SidebarDrawer } from "@/layouts/Sidebar/SidebarDrawer"
import { User } from "@/types/api/User"
import { Authentication } from "@/types/Authentication"
import { PAGE_CONFIGS } from "@/types/constants/PAGE_CONFIGS"
import { InstallationData } from "@/types/InstallationData"
import { ManagedResource } from "@/types/ManagedResource"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { ReactElement, useState } from "react"
import { BrowserRouter } from "react-router-dom"

/**
 * Entrypoint of the application. Handles various global context, e.g. authentication, user information and settings.
 * Renders the sidebar and the main view with the base layout.
 */
export const Application = (): ReactElement => {
    // Will be updated by useRefreshDataTimestamp and set to true if the timestamp changed.
    // Can e.g. be passed as dependency in a useFetch call to reload entity data without showing a loading screen.
    const [isLoading, setLoading] = useState<boolean>(false)

    // This hook will keep updating isLoading if the timestamp changes
    useRefreshDataTimestamp(isLoading, setLoading)

    const [user, authentication]: [ManagedResource<User>, Authentication] = useAuthentication()
    const installationData: InstallationData = useInstallation(isLoading)
    const sidebar: Sidebar = useSidebar()

    // Styling classes regarding the view width. Will be applied to the TopbarComponent and any StandardContentWrapper inside the context provider.
    const [mainViewWidth, setMainViewWidth] = useState<string>("")

    return (
        <AppContext.Provider value={{
            installationData: installationData,
            isLoading: isLoading,
            pageConfigs: PAGE_CONFIGS,
        }}>
            <AuthenticationContext.Provider value={authentication}>
                <UserContext.Provider value={user}>
                    <SettingsLoader>
                        <BaseLayout>
                            <BrowserRouter>
                                <SidebarContext.Provider value={sidebar}>
                                    {installationData.isAppInstalled && <SidebarDrawer />}
                                    {installationData.isAppInstalled && <SidebarComponent />}

                                    <MainViewWidthContext.Provider value={{ mainViewWidth, setMainViewWidth }}>
                                        <MainView />
                                    </MainViewWidthContext.Provider>
                                </SidebarContext.Provider>
                            </BrowserRouter>
                        </BaseLayout>
                    </SettingsLoader>
                </UserContext.Provider>
            </AuthenticationContext.Provider>
        </AppContext.Provider>
    )
}
