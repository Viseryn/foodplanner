import { Spinner } from "@/components/ui/Spinner"
import { AuthenticationContext } from "@/context/AuthenticationContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { Authentication } from "@/types/Authentication"
import { ComponentLoadingState } from "@/types/enums/ComponentLoadingState"
import { ReactElement, useEffect, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

type AuthCheckerProps = {
    /** The React component that shall be locked behind authentication. */
    component: ReactElement
}

/**
 * A wrapper component that can be used to hide a component behind authentication (i.e., having the
 * ROLE_ADMIN role). Shows a spinner while the authentication is loading and will then redirect the
 * user to either the login screen if not authenticated or the component if authenticated.
 */
export const AuthChecker = (props: AuthCheckerProps): ReactElement => {
    const { component } = props

    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const navigate: NavigateFunction = useNavigate()

    const [componentLoadingState, setComponentLoadingState] =
        useState<ComponentLoadingState>(ComponentLoadingState.LOADING)

    useEffect(() => {
        if (authentication.isLoading) {
            return
        }

        if (!authentication.isAuthenticated) {
            navigate("/login")
        } else {
            setComponentLoadingState(ComponentLoadingState.WAITING)
        }
    }, [authentication.isLoading])

    return componentLoadingState === ComponentLoadingState.WAITING
        ? component
        : (
            <div className="pb-24 md:pb-4">
                <div className="min-w-[400px]"></div>
                <Spinner />
            </div>
        )
}
