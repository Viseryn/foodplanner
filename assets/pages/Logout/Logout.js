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
                <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
                    <Heading>Login</Heading>
                    <Spinner />
                </div>
            )}
        </>
    );
}