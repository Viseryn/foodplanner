/******************************
 * ./assets/hooks/useFetch.ts *
 ******************************/

import { useEffect, useState }  from 'react'
import axios, { AxiosResponse } from 'axios'

/**
 * useFetch
 * 
 * A hook that fetches the data of a fetchable entity using a given API.
 * Manages a state variable 'data' that contains the data of the entity,
 * as well as a state variable 'isLoading' that is true while the data 
 * is loading. 
 * 
 * The hook returns an object of the FetchableEntity<DataType> type, i.e.
 * an object that consists of the 'data' and 'isLoading' state variables 
 * as well as their setter functions.
 * 
 * Usually, one can use the 'isLoading' property to decide in a component
 * whether a loading screen should be shown. The 'setLoading' function 
 * can be used to trigger a reload by passing true, since the 'data' property
 * will be updated whenever 'isLoading' is true.
 * 
 * When the hook is called, it is first checked whether an Authentication 
 * object was passed as argument. If yes and the user is not authenticated,
 * then the hook will return early and thus not attempt an API call.
 * 
 * The hook will basically attempt an API call, and thus a (re-)load of the 
 * entity data, whenever the 'isLoading' state variable is true. If it is 
 * false, it will not trigger a (re-)load. If the entity is (co-)dependent of 
 * some other entity however, one might want to trigger a reload regardless.
 * For example, if this hook manages EntityA, but a reload is wished because
 * EntityB is loading, then EntityB.isLoading can be passed in the parameter
 * list 'isDependencyLoading'. The Authentication.isLoading is automatically
 * added to this list if an Authentication object was provided. If all 
 * booleans in this list are also false, then the hook returns early.
 * 
 * If none of these steps lead to an early return, the hook will try to 
 * do the API call (up to a maximal number of five tries). If a customFetch 
 * callback function was passed as argument, it will now be called with the 
 * API response object and the setter functions of the 'data' and 'isLoading' 
 * state variables as arguments. If no customFetch callback function was given, 
 * then instead the 'data' state variable is set to be the API response data 
 * and the 'isLoading' state variable is set to false.
 * 
 * @template DataType The expected type of the 'data' state variable.
 * @param url The URL to the API that provides the data.
 * @param authentication An optional Authentication object. If such an object is given, the hook will only attempt API calls if Authentication.isAuthenticated is true, i.e. the user is authenticated.
 * @param isDependencyLoading An array of isLoading properties of dependent data. If an Authentication object was provided, Authentication.isLoading is automatically added to this list.
 * @param customFetch A function that can be executed after the API call if passed as argument. The response of the API call will be passed as argument as well as the setter methods of the 'data' state and its 'isLoading' state.
 * @return An object that consists of the data state variable, the isLoading state variable, and their respective setter methods.
 */
function useFetch<DataType = any>(
    url: string,
    authentication?: Authentication,
    isDependencyLoading?: Array<boolean>,
    customFetch?: (
        response: AxiosResponse<any, any>,
        setData: React.Dispatch<React.SetStateAction<DataType>>,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    ) => void,
): FetchableEntity<DataType> {
    /**
     * The data that the API provides. Can usually
     * be an object or an array of objects, but any 
     * other type is also allowed.
     */
    const [data, setData] = useState<DataType>(<DataType> {})

    /**
     * Whether the data is currently loading. Whenever
     * this is set to true, a reload of the data is 
     * attempted. This is the property that should be 
     * used to determine the necessity for a loading screen.
     */
    const [isLoading, setLoading] = useState<boolean>(true)

    /**
     * By default, reloads the data. If the optional parameter is set to false, then loading will be stopped.
     * 
     * @param shouldLoad Whether the entity should reload.
     */
    const load: SetLoadingAction = (shouldLoad = true) => { 
        setLoading(shouldLoad) 
    }

    // Collect all dependencies in one array
    const dependencies: Array<boolean | undefined> = ([] as Array<boolean | undefined>).concat(
        isLoading,
        authentication?.isLoading, 
        isDependencyLoading, 
    )

    // Detect changes in dependencies
    useEffect(() => {
        // Do not fetch data if authentication fails
        if (authentication !== undefined && !authentication.isAuthenticated) {
            return
        }

        // If all array entries are false (i.e., nothing is loading), we can 
        // return. We need to exclude all non-boolean array entries though.
        const nothingLoading: boolean = dependencies.every(value => {
            return value === false || typeof value !== 'boolean'
        })

        if (nothingLoading) {
            return
        }

        // If we have not returned yet, do the API call
        (async () => {
            let tries: number = 5

            // Try fetching maximally five times
            while (tries > 0) {
                try {
                    const response: AxiosResponse<any, any> = await axios.get(url)

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
                    const attempts: string = '(' + (6 - tries) 
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
    return { data, setData, isLoading, /** @deprecated */ setLoading, load }
}

export default useFetch
