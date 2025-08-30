import { InstallationData } from "@/types/InstallationData"
import { Page } from "@/types/Page"

export type App = {
    installationData: InstallationData
    isLoading: boolean
    pageConfigs: Page[]
}
