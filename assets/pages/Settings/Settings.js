/***************************************
 * ./assets/pages/Settings/Settings.js *
 ***************************************/

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import Heading from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';
 
/**
 * Settings
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} user
 * @property {boolean} isLoadingUser
 * @property {function} setLoadingUser
 * 
 * @todo This is NOT a safe security gate. Do this in the backend controllers!!!
 */
export default function Settings(props) {
    /** 
     * Render
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
            <Heading>Einstellungen</Heading>

            {props.isLoadingUser ? (
                <Spinner />
            ) : (
                <>
                    {props.user?.username !== undefined ? (
                        <>Hello!</>
                    ) : (
                        <Navigate to="/login" />
                    )}
                </>
            )}
        </div>
    );
}
