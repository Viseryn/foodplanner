import { useEntityState } from '@/hooks/useEntityState'
import { tryApiRequest } from "@/util/tryApiRequest"
import axios, { AxiosResponse } from 'axios'
import { useEffect } from 'react'

/**
 * useRefreshDataTimestamp
 * 
 * A hook that fetches the current RefreshDataTimestamp value stored in the database. It updates 
 * itself every 5 seconds and will set the isLoading state variable that was passed as argument to
 * true if there was a change in the timestamp.
 * 
 * @param isLoading A boolean state variable that should be updated by this hook.
 * @param setLoading The setter method of the state variable isLoading.
 */
export const useRefreshDataTimestamp = (isLoading: boolean, setLoading: SetState<boolean>): void => {
    // Fetch the current RefreshDataTimestamp
    const refreshDataTimestamp: EntityState<string> = useEntityState("/api/refresh-data-timestamp")

    // Create a repeating 5 seconds interval
    useEffect(() => {
        const interval = setInterval(() => {
            // Fetch the current RefreshDataTimestamp
            void tryApiRequest("GET", "/api/refresh-data-timestamp", async apiUrl => {
                const timestampResponse: AxiosResponse<string> = await axios.get(apiUrl)

                // Check if timestamp has changed. If yes, update and set the state variable argument to true.
                if (timestampResponse.data !== refreshDataTimestamp.data) {
                    refreshDataTimestamp.setData(timestampResponse.data)
                    setLoading(true)
                }

                return timestampResponse
            })

            // If state variable was set to true, turn back to false
            if (isLoading) {
                setLoading(false)
            }
        }, 5000)

        // Clear interval
        return () => { clearInterval(interval) }
    })
}
