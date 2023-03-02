/************************************************
 * ./assets/pages/PageNotFound/PageNotFound.tsx *
 ************************************************/

import React, { useEffect } from 'react'

import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'

/**
 * A component that is shown when an Error 404 occurs.
 * 
 * @component
 */
export default function PageNotFound({ setSidebar, setTopbar }: {
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // Load layout
    useEffect(() => {
        setSidebar()
        setTopbar({
            title: "Fehler 404"
        })
    }, [])

    // Render PageNotFound
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
