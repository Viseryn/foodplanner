/***********************************
 * ./assets/pages/Logout/Logout.js *
 ***********************************/

import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

/**
 * Logout
 * 
 * A component that logs a user out and redirects to the login page.
 * Since only a redirect happens, the sidebar need not be updated.
 * 
 * @component
 * @property {arr} user
 * @property {boolean} isLoadingUser
 * @property {function} setLoadingUser
 */
export default function Logout(props) {
    /**
     * Call Logout API
     */
    useEffect(() => {
        axios.get('/api/logout');
        props.setLoadingUser(true);
    });

    /**
     * Redirect to login page
     */
    return (
        <Navigate to="/login" />
    );
}