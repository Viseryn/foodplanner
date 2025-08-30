import { useUnauthenticatedApiResource } from "@/hooks/useUnauthenticatedApiResource"
import { InstallationStatus } from "@/types/api/InstallationStatus"
import { InstallationData } from "@/types/InstallationData"
import { ManagedResource } from "@/types/ManagedResource"
import { Maybe } from "@/types/Maybe"
import { CLIENT_VERSION } from "@/util/env/CLIENT_VERSION"
import { useEffect, useState } from "react"
import swal from "sweetalert"

export const useInstallation = (isAppLoading: boolean): InstallationData => {
    const [isAppInstalled, setAppInstalled] = useState<Maybe<boolean>>()
    const installation: ManagedResource<InstallationStatus> = useUnauthenticatedApiResource("/api/installation_status", [isAppLoading])

    useEffect(() => {
        if (installation.isLoading) {
            return
        }

        setAppInstalled(installation.data.status)

        const tryValidateVersion = async (): Promise<void> => {
            try {
                validateVersions(installation.data.apiVersion, CLIENT_VERSION)
            } catch (error) {
                if (!(error instanceof Error)) {
                    return
                }

                const swalResponse: Promise<boolean> = swal({
                    dangerMode: true,
                    icon: "error",
                    title: "Version Error",
                    text: error.message,
                    buttons: ["Ignore", "Reload"],
                })

                if (await swalResponse) {
                    location.reload()
                }
            }
        }

        void tryValidateVersion()
    }, [installation.isLoading])

    return {
        isAppInstalled,
        installation,
    }
}

const validateVersions = (apiVersion: string, clientVersion: string): void => {
    const apiVersionDigits: string[] = apiVersion.split(".")
    const clientVersionDigits: string[] = clientVersion.split(".")

    if (apiVersionDigits.length !== 2) {
        throw Error(`The API version (v${clientVersion}) is invalid.`)
    }

    if (clientVersionDigits.length !== 3) {
        throw Error(`The client version (v${clientVersion}) is invalid.`)
    }

    if (apiVersionDigits[0] !== clientVersionDigits[0] || apiVersionDigits[1] !== clientVersionDigits[1]) {
        throw Error(`The client version (v${clientVersion}) is not compatible with the API version (v${apiVersion}). Please install a matching client (v${apiVersion}.x).`)
    }
}
