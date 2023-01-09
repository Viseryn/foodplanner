/***********************************
 * ./assets/pages/Logout/Logout.js *
 ***********************************/

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/ui/Spinner";
import Heading from "../../components/ui/Heading";

/**
 * Logout
 * 
 * A component that logs a user out and redirects to the login page.
 * Since only a redirect happens, the sidebar need not be updated.
 * 
 * @component
 * @property {arr} user
 * @property {function} setUser
 * @property {boolean} isLoadingUser
 * @property {function} setLoadingUser
 * @property {function} setShoppingList
 * @property {function} setDays 
 * @property {function} setRecipes
 */
export default function Logout(props) {
    /**
     * State variables
     */
    const [isLoading, setLoading] = useState(true);

    /**
     * Call Logout API
     */
    useEffect(() => {
        if (!isLoading) return;

        // Remove user data from state
        props.setUser([]);

        // Remove other sensitive data
        props.setShoppingList([]);
        props.setPantry([]);
        props.setDays([]);
        props.setRecipes([]);
        props.setSettings([]);

        // Call Logout API
        axios
            .get('/api/logout')
            .then(() => {
                setLoading(false);

                // Trigger reload of user data
                props.setLoadingUser(true);
            })
        ;
    }, [isLoading]);

    /**
     * Redirect to login page
     */
    return (
        <>
            {props.isLoadingUser || !isLoading ? (
                <Navigate to="/login" />
            ) : (
                <div className="pb-[6.5rem] md:pb-6 pt-4 md:pt-9 px-4 md:pl-0 w-full md:w-[450px]">
                    <div className="px-4">
                        <Heading>Login</Heading>
                    </div>
                    
                    <Spinner />
                </div>
            )}
        </>
    );
}