/************************************
 * ./assets/layouts/AuthChecker.tsx *
 ************************************/

import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

import Spinner from '@/components/ui/Spinner'

/**
 * A wrapper component that can be used to hide a component behind authentication (i.e., having the 
 * ROLE_ADMIN role). Shows a spinner while the authentication is loading and will then redirect the 
 * user to either the login screen if not authenticated or the component if authenticated.
 * 
 * @component
 * @param props
 * @param props.authentication The authentication object from useAuthentication().
 * @param props.component A React component that should be locked behind authentication.
 */
export default function AuthChecker({ authentication, component }: {
    authentication: Authentication
    component: JSX.Element
}): JSX.Element {
    // Whether the AuthChecker is loading
    const [isLoading, setLoading] = useState<boolean>(true)

    // A NavigateFunction for navigating to the login page.
    const navigate: NavigateFunction = useNavigate()

    // Detect changes is authentication.isLoading
    useEffect(() => {
        // Wait if authentication is still loading
        if (authentication.isLoading) {
            return
        }

        // Navigate to login page if not authenticated and show component else
        if (!authentication.isAuthenticated) {
            navigate('/login')
        } else {
            setLoading(false)
        }
    }, [authentication.isLoading])

    // Render AuthChecker
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
