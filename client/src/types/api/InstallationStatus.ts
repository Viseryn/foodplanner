import { ApiResource } from "@/types/api/ApiResource"

/**
 * This type mirrors the ApiResource `InstallationStatus`.
 *
 * @see api/src/Entity/InstallationStatus.php
 */
export type InstallationStatus = ApiResource & {
    "@type": "InstallationStatus"
    status: boolean
    apiVersion: string
}
