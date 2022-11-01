/**
 * /assets/components/PageNotFound.js
 */
    
import React, { useEffect } from 'react';
import Notification from './Notification';

export default function PageNotFound(props) {
    useEffect(() => {
        props.setSidebarActiveItem();
        props.setSidebarActionButton();
    }, []);

    return (
        <div className="mx-6 mt-6 md:ml-0 w-full md:rounded-3xl md:max-w-[450px]">
            <Notification
                message="Die angeforderte Seite konnte nicht gefunden werden. Bitte wende dich an den Administrator, falls der Fehler weiterhin auftreten sollte."
                icon="error"
                color="red"
            >Fehler 404</Notification>
        </div>
    );
}
