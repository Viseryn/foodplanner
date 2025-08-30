import { Spinner } from "@/components/ui/Spinner"
import { AuthenticationContext } from "@/context/AuthenticationContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { Authentication } from "@/types/Authentication"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement, useEffect } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

export const Logout = (): ReactElement => {
    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const navigate: NavigateFunction = useNavigate()

    useEffect(() => {
        if (authentication.isAuthenticated) {
            ApiRequest.get("/api/logout").ifSuccessful(() => location.reload())
        } else {
            navigate("/login")
        }
    }, [])

    useEffect(() => {
        sidebar.useDefault()
        topbar.useDefault("Logout")
    }, [])

    return (
        <StandardContentWrapper className="md:w-[450px]">
            <Spinner />
        </StandardContentWrapper>
    )
}
