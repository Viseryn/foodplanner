/***********************************
 * ./assets/layouts/AuthChecker.js *
 ***********************************/

import React, { useEffect, useState }   from 'react'
import { useNavigate }                  from 'react-router-dom'

import Spinner                          from '../../components/ui/Spinner'

/**
 * AuthChecker
 * 
 * A wrapper component that can be used to hide a component
 * behind authentication (i.e., having the admin role).
 * Shows a spinner while the authentication is loading
 * and will then redirect the user to either the login 
 * screen if not authenticated or the component if 
 * authenticated.
 * 
 * @component
 * @property {object} authentication The authentication object from useAuthentication().
 * @property {function} component A React component that should be locked behind authentication.
 */
export default function AuthChecker({ authentication, component = <></> }) {
    /**
     * Whether the AuthChecker is loading.
     * 
     * @type {[boolean, function]}
     */
    const [isLoading, setLoading] = useState(true)

    /**
     * A NavigateFunction for navigating to the login page.
     * 
     * @type {NavigateFunction}
     */
    const navigate = useNavigate()

    // Detect changes is authentication.isLoading
    useEffect(() => {
        // Wait if authentication is still loading
        if (authentication.isLoading) return

        // Navigate to login page if not authenticated
        // and show component else
        if (!authentication.isAuthenticated) {
            navigate('/login')
        } else {
            setLoading(false)
        }
    }, [authentication.isLoading])

    /**
     * Render AuthChecker
     */
    return isLoading ? (
        <div className="pb-24 md:pb-4">
            <div className="min-w-[400px]"></div>
            <Spinner /> 
        </div>
    ) : (
        <>
            {component}
        </>
    )
}
