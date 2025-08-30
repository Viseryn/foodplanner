import { ApiResource } from "@/types/api/ApiResource"
import { Authentication } from "@/types/Authentication"
import { ManagedResource } from "@/types/ManagedResource"
import { apiClient } from "@/util/apiClient"
import { StringBuilder } from "@/util/StringBuilder"
import axios, { AxiosResponse } from "axios"
import { useEffect, useState } from "react"

/**
 * **This hook is not intended to be used directly.**
 *
 * @see useApiResource
 * @see useApiResourceCollection
 * @see useUnauthenticatedApiResource
 */
export const useGenericApiResourceImplementation = <T extends ApiResource>(
    apiUrl: string,
    dependencies?: boolean[],
    authentication?: Authentication,
): ManagedResource<T> => {
    const logger: StringBuilder = new StringBuilder()

    const [dataInternal, setDataInternal] = useState<T>()
    const [isLoading, setLoading] = useState<boolean>(true)
    const [detached, setDetached] = useState<boolean>(true)

    const load = (): void => {
        setLoading(true)
    }

    const setData = (value: T): void => {
        setDataInternal(value)
        setDetached(true)
    }

    const loadingDependencies: boolean[] = [
        isLoading,
        ...(authentication ? [authentication.isLoading] : []),
        ...(dependencies ?? []),
    ]

    useEffect(() => {
        if (authentication && !authentication.isAuthenticated) {
            return
        }

        if (loadingDependencies.every(isLoading => !isLoading)) {
            return
        }

        const doRequest = async (): Promise<void> => {
            try {
                const response: AxiosResponse<T> = await apiClient.get(apiUrl)

                setDataInternal(response.data)
                setLoading(false)
                setDetached(false)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    logger
                        .append(`[ERROR] (GET ${apiUrl}): ${error.code}`)
                        .logToConsole()

                    const swalResponse: Promise<boolean> = swal({
                        dangerMode: true,
                        icon: "error",
                        title: "Resource could not be loaded",
                        text: logger.build(),
                        buttons: ["Ignore", "Reload"],
                    })

                    logger.clear()

                    if (await swalResponse) {
                        location.reload()
                    }
                }
            }
        }

        void doRequest()
    }, loadingDependencies)

    return (isLoading || dataInternal === undefined)
        ? { data: undefined, isLoading: true, load: load }
        : { data: dataInternal, setData: setData, isLoading: false, load: load, detached: detached }
}
