import { SettingsContext } from "@/context/SettingsContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { Settings as SettingsApiResource } from "@/types/api/Settings"
import { HOMEPAGE_CONFIGS } from "@/types/constants/HOMEPAGE_CONFIGS"
import { Homepage } from "@/types/enums/Homepage"
import { ManagedResource } from "@/types/ManagedResource"
import { ReactElement, useEffect, useState } from "react"

const DEFAULT_HOMEPAGE: Homepage = "PLANNER"

/**
 * Returns the correct ReactElement component depending on the user's configured homepage.
 */
export const useHomepage = (): ReactElement => {
    const settings: ManagedResource<SettingsApiResource> = useNullishContext(SettingsContext)
    const [homepage, setHomepage] = useState<Homepage>(DEFAULT_HOMEPAGE)

    useEffect(() => {
        if (settings.isLoading) {
            setHomepage(DEFAULT_HOMEPAGE)
            return
        }

        setHomepage(settings.data.homepage ?? DEFAULT_HOMEPAGE)
    }, [settings.isLoading])

    return HOMEPAGE_CONFIGS.find(it => it.homepage === homepage)!.page.element
}
