/*********************************************
 * ./assets/hooks/useRefreshDataTimestamp.ts *
 *********************************************/

import axios from 'axios'
import { useEffect } from 'react'
import { useEntityState } from '@/hooks/useEntityState'

/**
 * useRefreshDataTimestamp
 * 
 * A hook that fetches the current RefreshDataTimestamp value stored in the database. It updates 
 * itself every 10 seconds and will set the isLoading state variable that was passed as argument to 
 * true if there was a change in the timestamp.
 * 
 * @param isLoading A boolean state variable that should be updated by this hook.
 * @param setLoading The setter method of the state variable isLoading.
 */
function useRefreshDataTimestamp(isLoading: boolean, setLoading: SetState<boolean>): void {
    // Fetch the current RefreshDataTimestamp
    const refreshDataTimestamp: EntityState<string> = useEntityState('/api/refresh-data-timestamp')

    // Create a repeating 5 seconds interval
    useEffect(() => {
        const interval = setInterval(() => {
            // Fetch the current RefreshDataTimestamp
            axios
                .get('/api/refresh-data-timestamp')
                .then(response => {
                    const timestamp = JSON.parse(response.data)

                    // Check if timestamp has changed. If yes, update and set the state variable argument to true.
                    if (timestamp !== refreshDataTimestamp.data) {
                        refreshDataTimestamp.setData(timestamp)
                        setLoading(true)
                    }
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

export default useRefreshDataTimestamp
