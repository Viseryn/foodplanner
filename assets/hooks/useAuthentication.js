/***************************************
 * ./assets/hooks/useAuthentication.js *
 ***************************************/

import { useEffect, useState }  from 'react'

import useFetch                 from './useFetch'

/**
 * useAuthentication
 * 
 * Returns the current state of the user data state variable
 * and the authentication, especially whether the user is 
 * authenticated at the moment and whether the authentication
 * is done loading.
 * 
 * @returns {Array<Object>} An array of a user object and an authentication object.
 * 
 * @example 
 * const [user, authentication] = useAuthentication()
 * user: { 
 *     data: {};
 *     setData: React.Dispatch<React.SetStateAction<{}>>;
 *     isLoading: boolean;
 *     setLoading: React.Dispatch<React.SetStateAction<boolean>>;
 * }
 * authentication: { 
 *     isAuthenticated: boolean;
 *     isLoading: boolean;
 * }
 */
function useAuthentication() {
    /**
     * Whether the user is currently authenticated.
     * 
     * @type {[boolean, function]}
     */
    const [isAuthenticated, setAuthenticated] = useState(false)

    /**
     * Whether the authentication process is still loading.
     * This will only be false after the user data has been 
     * loaded and isAuthenticated has been set for the last 
     * time.
     * 
     * @type {[boolean, function]}
     */
    const [isLoading, setLoading] = useState(true)

    // User object
    const user = useFetch('/api/user')

    // Authentication object
    const authentication = { isAuthenticated, isLoading }

    // Each time the user data changes, check if authenticated
    useEffect(() => {
        const authenticated = user.data?.roles?.includes('ROLE_ADMIN') ?? false
        setAuthenticated(authenticated)

        // The loading of the authentication process will
        // only be stopped once the user data has loaded
        if (!user.isLoading) {
            setLoading(false)
        }
    }, [user.data])

    // Return the user object and an authentication object
    return [user, authentication]
}

export default useAuthentication
