/***********************************
 * ./assets/layouts/AuthChecker.js *
 ***********************************/

import React from "react";
import { useNavigate }                  from 'react-router-dom'

import Heading from "../components/ui/Heading";
import Spinner from "../components/ui/Spinner";

/**
 * AuthChecker
 * 
 * A wrapper component that can be used to hide a component
 * behind authentication (i.e., having the admin role).
 * First checks if the user is authenticated and if yes, 
 * renders the component. If not, the user is redirected 
 * to the login page. While loading the user data, a 
 * Spinner is shown.
 * 
 * @component
 * @property {function} component A React component.
 * @property {function} isAuthenticated A function that checks whether the user is authenticated.
 * @property {boolean} isLoadingUser A bool that is true while the user data is loading.
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
