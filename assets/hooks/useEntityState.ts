import { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import swal from 'sweetalert'
import { StringBuilder } from '@/util/StringBuilder'

export const useEntityState = <T = unknown>(
    url: string,
    authentication?: Authentication,
    dependencies?: boolean[],
): EntityState<T> => {
    const infoStack: StringBuilder = new StringBuilder()

    const [data, setData] = useState<T>()
    const [isLoading, setLoading] = useState<boolean>(true)

    const load: SetLoadingAction = (shouldLoad = true) => {
        setLoading(shouldLoad)
    }

    const isLoadingDependencies: boolean[] = [
        isLoading,
        ...(authentication ? [authentication.isLoading] : []),
        ...(dependencies ?? [])
    ]

    useEffect(() => {
        if (authentication !== undefined && !authentication.isAuthenticated) {
            return
        }

        if (isLoadingDependencies.every(isLoading => !isLoading)) {
            return
        }

        let swalResponse: Promise<boolean>

        const doRequest = async (): Promise<void> => {
            try {
                const response: AxiosResponse<T> = await axios.get(url)

                setData(response.data)
                setLoading(false)

                infoStack
                    .append(`[INFO] (GET ${url}): ${response?.request?.status}`)
                    .blank()
                    .append(`${response?.request?.statusText}`)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    infoStack
                        .append(`[ERROR] (GET ${url}): ${error?.response?.request?.status}`)
                        .blank()
                        .append(`${error?.response?.request?.statusText}.`)
                        .newLine()
                        .append(`${error?.response?.data?.detail ?? error?.response?.data}`)

                    swalResponse = swal({
                        dangerMode: true,
                        icon: 'error',
                        title: error.message,
                        text: infoStack.build(),
                        buttons: ["Ignorieren", "Neu laden"],
                    })
                }
            } finally {
                infoStack.logToConsole()
                infoStack.clear()

                if (await swalResponse) {
                    location.reload()
                }
            }
        }

        void doRequest()
    }, isLoadingDependencies)

    return (isLoading || data === undefined)
        ? { data, setData, isLoading: true, load }
        : { data, setData, isLoading: false, load }
}
