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
        <div className="max-w-[700px]">
            <Notification 
                title="Fehler 404"
                message="Die angeforderte Seite konnte nicht gefunden werden. Bitte wende dich an den Administrator, falls der Fehler weiterhin auftreten sollte."
                icon="error"
                color="red"
            />
        </div>
    );
}
