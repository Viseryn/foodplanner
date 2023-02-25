/************************************
 * ./assets/pages/Logout/Logout.tsx *
 ************************************/

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'

/**
 * Logout
 * 
 * A component that logs a user out and redirects to the login page.
 * 
 * @component
 */
export default function Logout({ authentication, setSidebar, setTopbar }: {
    authentication: Authentication
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // A function that can change the location. Needed for the redirect after logout.
    const navigate = useNavigate()

    // Call Logout API
    useEffect(() => {
        if (authentication.isAuthenticated) {
            (async () => {
                try {
                    // If user is authenticated, logout and reload
                    await axios.get('/api/logout')
                    location.reload()
                } catch (error) {
                    console.log(error)
                }
            })()
        } else {
            // Navigate to login page
            navigate('/login')
        }
    }, [])

    // Load layout
    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Logout',
        })
    }, [])

    // Render Logout
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />
            <Spinner />
        </div>
    )
}