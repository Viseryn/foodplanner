import Notification from '@/components/ui/Notification'
import { StandardContentWrapper } from "@/components/ui/StandardContentWrapper"
import React, { ReactElement, useEffect } from 'react'

type PageNotFoundProps = {
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}

export const PageNotFound = ({ setSidebar, setTopbar }: PageNotFoundProps): ReactElement => {
    useEffect(() => {
        setSidebar()
        setTopbar({
            title: "Fehler 404"
        })
    }, [])

    return (
        <StandardContentWrapper className="md:max-w-[450px]">
            <Notification
                icon="error"
                color="red"
                title="Fehler 404 ¯\_(ツ)_/¯"
            >
                Die angeforderte Seite konnte nicht gefunden werden. Bitte wende dich an den Administrator, falls der
                Fehler weiterhin auftreten sollte.
            </Notification>
        </StandardContentWrapper>
    )
}
