/******************************
 * ./assets/hooks/useFetch.js *
 ******************************/

import { useEffect, useState }  from 'react'
import axios                    from 'axios'

/**
 * useFetch
 * 
 * A hook that manages the data and loading state of 
 * fetchable entities. When used, it attempts an API
 * call at the given URL, but first checks several things.
 * 
 * First, if the authentication argument is not null, 
 * the attempt is cancelled when the user is not authenticated.
 * 
 * Second, for the list of isLoading dependencies, it is 
 * checked that indeed at least one is true, i.e. something
 * wants to load (this can be the data entity itself, or 
 * some external factor like App.isLoading or authentication.isLoading).
 * 
 * If none of these steps lead to an early return, the API
 * is called and the response data is saved to the state 
 * variable data. The state this.isLoading is then set to false.
 * The hook returns an object with both the data and the loading 
 * boolean as well as their setter methods.
 * 
 * @param {string} url The URL to the API that provides the data.
 * @param {object?} authentication If argument is an authentication object, the data will only be fetched if the user is authenticated. If argument is null, it will be ignored.
 * @param {Array<boolean>} isDependencyLoading An array of isLoading properties of dependent data. If an authentication object was provided, authentication.isLoading is automatically added to this list.
 * @param {Array<any>} otherDependencies An array of dependencies for the useEffect API call.
 * @param {boolean} doCustomFetch Whether after the API call a custom callback should be executed.
 * @param {(response: object, setData: React.Dispatch<React.SetStateAction<any>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => void} customFetch A function that can be executed after the API call if doCustomFetch is true. The response of the API call will be passed as argument as well as the setter methodd of the data entity and its isLoading state.
 * @return {object} An object that consists of the data state variable, the isLoading state variable, and their respective setter methods.
 */
function useFetch(
    url,
    authentication = null,
    isDependencyLoading = [],
    otherDependencies = [],
    doCustomFetch = false,
    customFetch,
) {
    /**
     * The data that the API provides. Can usually
     * be an object or an array of objects, but any 
     * other type is also allowed.
     * 
     * @type {[*, function]}
     */
    const [data, setData] = useState({})

    /**
     * Whether the data is currently loading. Whenever
     * this is set to true, a reload of the data is 
     * attempted. This is the property that should be 
     * used to determine the necessity for a loading screen.
     * 
     * @type {[boolean, function]}
     */
    const [isLoading, setLoading] = useState(true)

    /**
     * Attempt API call
     */
    // Collect all dependencies in one array
    const dependencies = [isLoading].concat(
        authentication?.isLoading, 
        isDependencyLoading, 
        otherDependencies,
    )

    // Detect changes in dependencies
    useEffect(() => {
        // Do not fetch data if authentication fails
        // (if an authentication object was provided)
        if (authentication !== null) {
            if (!authentication.isAuthenticated) {
                // console.log('AUTH FAILED', url, dependencies)
                return
            }
        }

        // If all array entries are false (i.e., 
        // nothing is loading), we can return.
        // We need to exclude all non-boolean 
        // array entries though.
        const nothingLoading = dependencies.every(value => {
            return value === false || typeof value !== 'boolean'
        })

        if (nothingLoading) {
            // console.log('NOTHING LOADING', url, dependencies)
            return
        }

        // If we have not returned yet, do the API call
        axios
            .get(url)
            .then(response => {
                // Do a custom fetch if doCustomFetch is true, 
                // otherwise just put the response data into the state
                if (doCustomFetch) {
                    customFetch(response, setData, setLoading)
                } else {
                    setLoading(false)
                    setData(JSON.parse(response.data))
                    // console.log('API', url, dependencies, JSON.parse(response.data))
                }
            })
    }, dependencies)

    // Return the state variables, there loading status and the setters
    return { data, setData, isLoading, setLoading }
}

export default useFetch
