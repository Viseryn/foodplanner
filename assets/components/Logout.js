import React, { useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

/**
 * Logout
 */
export default function Logout(props) {
    useEffect(() => {
        axios.get('/api/logout');
    });

    return (
        <Navigate to="/login" />
    );
}