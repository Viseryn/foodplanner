/***********************************
 * ./assets/layouts/AuthChecker.js *
 ***********************************/

import React from "react";
import { Navigate } from 'react-router-dom';

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
export default function AuthChecker({ component, ...props }) {
    return (
        !props.isAuthenticated() ? (
            props.isLoadingUser ? (
                <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-bg dark:bg-bg-dark md:rounded-3xl md:w-fit">
                    <div className="min-w-[400px]"></div>
                    <Heading>&emsp;</Heading>
                    <Spinner /> 
                </div>
            ) : (
                <Navigate to="/login" />
            )
        ) : (
            <>
                {component}
            </>
        )
    );
}
