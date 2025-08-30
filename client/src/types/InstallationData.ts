import { InstallationStatus } from "@/types/api/InstallationStatus"
import { ManagedResource } from "@/types/ManagedResource"

export type InstallationData = {
    isAppInstalled?: boolean
    installation: ManagedResource<InstallationStatus>
}
