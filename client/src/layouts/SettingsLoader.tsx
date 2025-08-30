import { AppContext } from "@/context/AppContext"
import { SettingsContext } from "@/context/SettingsContext"
import { useApiResource } from "@/hooks/useApiResource"
import { useNullishContext } from "@/hooks/useNullishContext"
import { Settings } from "@/types/api/Settings"
import { App } from "@/types/App"
import { ManagedResource } from "@/types/ManagedResource"
import { ReactElement } from "react"

type SettingsLoaderProps = {
    children: React.ReactNode
}

export const SettingsLoader = ({ children }: SettingsLoaderProps): ReactElement => {
    const app: App = useNullishContext(AppContext)
    const settings: ManagedResource<Settings> = useApiResource(`/api/users/me/settings`, true, [app.isLoading])

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    )
}
