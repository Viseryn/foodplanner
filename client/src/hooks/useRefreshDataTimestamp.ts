import { usePolling } from "@/hooks/usePolling"
import { useUnauthenticatedApiResource } from "@/hooks/useUnauthenticatedApiResource"
import { RefreshDataTimestamp } from "@/types/api/RefreshDataTimestamp"
import { ManagedResource } from "@/types/ManagedResource"
import { ApiRequest } from "@/util/ApiRequest"


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
    const refreshDataTimestamp: ManagedResource<RefreshDataTimestamp> = useUnauthenticatedApiResource("/api/refresh_data_timestamp")

    // Create a repeating 5 seconds interval
    usePolling(() => {
        // Fetch the current RefreshDataTimestamp
        void ApiRequest
            .get<RefreshDataTimestamp>("/api/refresh_data_timestamp")
            .ifSuccessful(timestampResponse => {
                // Check if timestamp has changed. If yes, update and set the state variable argument to true.
                if (!refreshDataTimestamp.isLoading && timestampResponse.timestamp !== refreshDataTimestamp.data.timestamp) {
                    refreshDataTimestamp.setData(timestampResponse)
                    setLoading(true)
                }
            })
            .execute()

        // If state variable was set to true, turn back to false
        if (isLoading) {
            setLoading(false)
        }
    }, 5000)
}
