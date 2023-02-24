/************************************
 * ./assets/pages/Logout/Logout.tsx *
 ************************************/

import React, { useEffect, useState }   from 'react'
import { useNavigate }                  from 'react-router-dom'
import axios                            from 'axios'

import Spacer                           from '../../components/ui/Spacer'
import Spinner                          from '../../components/ui/Spinner'

/**
 * Logout
 * 
 * A component that logs a user out and redirects to the login page.
 * 
 * @component
 * @param {object} props
 * @param {object} props.user
 * @param {object} props.settings
 * @param {object} props.userGroups
 * @param {object} props.mealCategories
 * @param {object} props.recipes
 * @param {object} props.days
 * @param {object} props.shoppingList
 * @param {object} props.pantry
 */
export default function Logout(props) {
    /**
     * A function that can change the location.
     * Needed for the redirect after submit.
     * 
     * @type {NavigateFunction}
     */
    const navigate = useNavigate()

    /**
     * Call Logout API
     */
    useEffect(() => {
        // Remove other sensitive data
        props.settings.setData()
        props.userGroups.setData()
        props.mealCategories.setData()
        props.recipes.setData()
        props.days.setData()
        // props.shoppinglist.setData()
        // props.pantry.setData()

        // Call Logout API
        axios
            .get('/api/logout')
            .then(() => {

                // Remove user data from state
                props.user.setData({})

                // Trigger reload of user data
                props.user.setLoading(true)

                // Navigate to login page
                navigate('/login')
            })
    }, [])

    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebar()

        // Load topbar
        props.setTopbar({
            title: 'Logout',
        })
    }, [])

    /**
     * Redirect to login page
     */
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />
            <Spinner />
        </div>
    )
}