/***************************************
 * ./assets/hooks/useAuthentication.ts *
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
 * @returns An array of a user object and an authentication object.
 */
function useAuthentication(): [FetchableEntity<User>, {
    isAuthenticated: boolean
    isLoading: boolean
}] {
    /**
     * Whether the user is currently authenticated.
     */
    const [isAuthenticated, setAuthenticated] = useState(false)

    /**
     * Whether the authentication process is still loading.
     * This will only be false after the user data has been 
     * loaded and isAuthenticated has been set for the last 
     * time.
     */
    const [isLoading, setLoading] = useState(true)

    // User object
    const user = useFetch<User>('/api/user')

    // Authentication object
    const authentication = { isAuthenticated, isLoading }

    // Each time the user data changes, check if authenticated
    useEffect(() => {
        const authenticated = user.data?.roles?.includes('ROLE_ADMIN') ?? false
        setAuthenticated(authenticated)
        setLoading(true)

        // The loading of the authentication process will
        // only be stopped once the user data has loaded
        if (!user.isLoading) {
            setLoading(false)
        }
    }, [user.data, user.isLoading])

    // Return the user object and an authentication object
    return [user, authentication]
}

export default useAuthentication
