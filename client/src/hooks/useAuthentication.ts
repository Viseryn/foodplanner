import { useUnauthenticatedApiResource } from "@/hooks/useUnauthenticatedApiResource"
import { User } from "@/types/api/User"
import { Authentication } from "@/types/Authentication"
import { ManagedResource } from "@/types/ManagedResource"
import { Role } from "@/types/Role"
import { useEffect, useState } from "react"

/**
 * Returns the current state of the user data state variable and the authentication, especially
 * whether the user is authenticated at the moment and whether the authentication is done loading.
 *
 * @returns An array of a ManagedResource<User> and an Authentication object.
 */
export const useAuthentication = (): [ManagedResource<User>, Authentication] => {
    // Whether the authentication process is still loading. This will only be false after the user
    // data has been loaded and isAuthenticated has been set for the last time.
    const [isLoading, setLoading] = useState<boolean>(true)

    const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
    const [roles, setRoles] = useState<Role[]>([])

    const user: ManagedResource<User> = useUnauthenticatedApiResource("/api/users/me")
    const authentication: Authentication = { isAuthenticated, isLoading, roles }

    // Each time the user data changes, check if authenticated
    useEffect(() => {
        const authenticated: boolean = !user.isLoading ? user.data?.roles?.includes("ROLE_ADMIN") : false

        setAuthenticated(authenticated)
        setLoading(true)
        setRoles(user.data?.roles ?? [])

        // The loading of the authentication will only be stopped once the user data is loaded
        if (!user.isLoading) {
            setLoading(false)
        }
    }, [user.data, user.isLoading])

    return [user, authentication]
}
