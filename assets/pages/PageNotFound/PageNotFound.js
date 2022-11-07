/***********************************************
 * ./assets/pages/PageNotFound/PageNotFound.js *
 ***********************************************/
    
import React, { useEffect } from 'react';
import Notification from '../../components/Notification';

/**
 * PageNotFound
 * 
 * A component that is shown when an Error 404 occurs.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 */
export default function PageNotFound(props) {
    useEffect(() => {
        props.setSidebarActiveItem();
        props.setSidebarActionButton();
    }, []);

    return (
        <div className="mx-6 mt-6 md:ml-0 w-full md:rounded-3xl md:max-w-[450px]">
            <Notification
                icon="error"
                color="red"
                title="Fehler 404"
            >
                Die angeforderte Seite konnte nicht gefunden werden. Bitte wende dich an den Administrator, falls der Fehler weiterhin auftreten sollte.
            </Notification>
        </div>
    );
}
