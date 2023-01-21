/*********************************************
 * ./assets/hooks/useRefreshDataTimestamp.js *
 *********************************************/

import axios            from 'axios'
import { useEffect }    from 'react'

import useFetch         from './useFetch'

/**
 * useRefreshDataTimestamp
 * 
 * A hook that returns the current RefreshDataTimestamp value
 * stored in the database. It updates itself every 5 seconds
 * and will set the isLoading state variable that was passed 
 * as argument to true if there was a change in the timestamp.
 * 
 * @param {boolean} isLoading A boolean state variable.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading The setter method of the state variable isLoading.
 * @returns {number} The current RefreshDataTimestamp.
 */
function useRefreshDataTimestamp(isLoading, setLoading) {
    // Fetch the current RefreshDataTimestamp
    const refreshDataTimestamp = useFetch('/api/refresh-data-timestamp')

    // Create a repeating 5 seconds interval
    useEffect(() => {
        const interval = setInterval(() => {
            // Fetch the current RefreshDataTimestamp
            axios
                .get('/api/refresh-data-timestamp')
                .then(response => {
                    const timestamp = JSON.parse(response.data)

                    // Check if timestamp has changed.
                    // If yes, update and set the state variable argument to true.
                    if (timestamp !== refreshDataTimestamp.data) {
                        refreshDataTimestamp.setData(timestamp)
                        setLoading(true)
                    }
                })

            // If state variable was set to true, turn back to false
            if (isLoading) {
                setLoading(false)
            }
        }, 10000)

        // Clear interval
        return () => { 
            clearInterval(interval)
        }
    })

    // Return the current RefreshDataTimestamp
    return refreshDataTimestamp.data
}

export default useRefreshDataTimestamp
