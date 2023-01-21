/***********************************************
 * ./assets/pages/PageNotFound/PageNotFound.js *
 ***********************************************/

import React, { useEffect } from 'react'

import Notification from '../../components/ui/Notification'
import Spacer       from '../../components/ui/Spacer'

/**
 * PageNotFound
 * 
 * A component that is shown when an Error 404 occurs.
 * 
 * @component
 * @param {function} props.setSidebar
 * @param {function} props.setTopbar
 */
export default function PageNotFound(props) {
    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebar()

        // Load topbar
        props.setTopbar({})
    }, [])

    /** 
     * Render
     */
    return (
        <div className="pb-24 md:pb-4 md:max-w-[450px]">
            <Spacer height="6" />

            <div className="mx-4 md:mx-0">
                <Notification
                    icon="error"
                    color="red"
                    title="Fehler 404 ¯\_(ツ)_/¯"
                >
                    Die angeforderte Seite konnte nicht gefunden werden. Bitte wende dich an den Administrator, falls der Fehler weiterhin auftreten sollte.
                </Notification>
            </div>
        </div>
    )
}
