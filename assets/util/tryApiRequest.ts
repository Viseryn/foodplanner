import axios, { AxiosResponse } from 'axios'
import { HttpMethod } from '@/types/HttpMethod'
import { StringBuilder } from '@/util/StringBuilder'
import swal from 'sweetalert'

/**
 * Utility method to execute an HTTP request at some API endpoint and catch errors.
 * If any errors are caught, they will trigger a SweetAlert dialog with detailed information.
 * Otherwise, the success message will just be written to the console log.
 *
 * @param httpMethod The HTTP Request Method of the API request, e.g. "PATCH".
 * @param apiUrl The URL of the API endpoint, e.g. "/api/usergroups".
 * @param task The request logic. It is executed and the response is used to either display incoming errors or to write
 *             a success message to the console. The callback can take a variable amounts of parameters, but should
 *             return the HTTP response object.
 * @param args Optional arguments for the `task` callback function. Need to match the function signature of `task`.
 */
export const tryApiRequest = async (
    httpMethod: HttpMethod,
    apiUrl: string,
    task: (...args: unknown[]) => Promise<AxiosResponse<unknown, unknown>>,
    ...args: unknown[]
): Promise<void> => {
    const infoStack: StringBuilder = new StringBuilder()

    try {
        const response: AxiosResponse = await task(args)
        infoStack
            .append(`[INFO] (${httpMethod} ${apiUrl}): ${response?.request?.status}`)
            .blank()
            .append(`${response?.request?.statusText}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            infoStack
                .append(`[ERROR] (${httpMethod} ${apiUrl}): ${error?.response?.request?.status}`)
                .blank()
                .append(`${error?.response?.request?.statusText}.`)
                .newLine()
                .append(`${error?.response?.data?.detail ?? error?.response?.data}`)

            void swal({
                dangerMode: true,
                icon: 'error',
                title: error.message,
                text: infoStack.build(),
            })
        }
    } finally {
        infoStack.logToConsole()
    }
}
