import Notification from "@/components/ui/Notification"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ReactElement, useEffect } from "react"

export const PageNotFound = (): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)

    useEffect(() => {
        sidebar.useDefault()
        topbar.useDefault("Fehler 404")
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
