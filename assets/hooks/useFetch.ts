/******************************
 * ./assets/hooks/useFetch.ts *
 ******************************/

import { useEffect, useState }  from 'react'
import axios, { AxiosResponse } from 'axios'

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
 * @template DataType The return value's data property type. Default is Object.
 * @param url The URL to the API that provides the data.
 * @param authentication If argument is an authentication object, the data will only be fetched if the user is authenticated. If argument is null, it will be ignored.
 * @param isDependencyLoading An array of isLoading properties of dependent data. If an authentication object was provided, authentication.isLoading is automatically added to this list.
 * @param otherDependencies An array of dependencies for the useEffect API call.
 * @param customFetch A function that can be executed after the API call if passed as argument. The response of the API call will be passed as argument as well as the setter methods of the data entity and its isLoading state.
 * @return An object that consists of the data state variable, the isLoading state variable, and their respective setter methods.
 */
function useFetch<DataType = any>(
    url: string,
    authentication?: Authentication,
    isDependencyLoading?: Array<boolean>,
    otherDependencies?: React.DependencyList,
    customFetch?: (
        response: AxiosResponse<any, any>,
        setData: React.Dispatch<React.SetStateAction<DataType | undefined>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    ) => void,
) : FetchableEntity<DataType> {
    /**
     * The data that the API provides. Can usually
     * be an object or an array of objects, but any 
     * other type is also allowed.
     */
    const [data, setData] = useState<DataType>()

    /**
     * Whether the data is currently loading. Whenever
     * this is set to true, a reload of the data is 
     * attempted. This is the property that should be 
     * used to determine the necessity for a loading screen.
     */
    const [isLoading, setLoading] = useState(true)

    /**
     * Attempt API call
     */
    // Collect all dependencies in one array
    const dependencies: Array<any> = ([] as Array<any>).concat(
        isLoading,
        authentication?.isLoading, 
        isDependencyLoading, 
        otherDependencies,
    )

    // Detect changes in dependencies
    useEffect(() => {
        // Do not fetch data if authentication fails
        if (authentication !== undefined && !authentication?.isAuthenticated) {
            return
        }

        // If all array entries are false (i.e., nothing is loading), we can 
        // return. We need to exclude all non-boolean array entries though.
        const nothingLoading = dependencies.every(value => {
            return value === false || typeof value !== 'boolean'
        })

        if (nothingLoading) {
            return
        }

        // If we have not returned yet, do the API call
        (async () => {
            let tries = 5

            // Try fetching maximally five times
            while (tries > 0) {
                try {
                    const response = await axios.get(url)

                    // Do a customFetch if callback was given
                    if (customFetch != null) {
                        customFetch?.(response, setData, setLoading)
                    } else {
                        setData(JSON.parse(response.data))
                        setLoading(false)
                    }

                    // Stop trying once fetch was successful
                    break
                } catch (error) {
                    const attempts = '(' + (6 - tries) 
                        + ' attempt' 
                        + (tries < 5 ? 's' : '') 
                        + (tries === 1 ? ', stopping now' : '') 
                        +')'

                    console.log('Failed loading', url, attempts, error)
                    
                    tries--
                }
            }
        })()
    }, dependencies)

    // Return the state variables, their loading status and the setters
    return { data, setData, isLoading, setLoading }
}

export default useFetch
