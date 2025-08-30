import { AuthenticationContext } from "@/context/AuthenticationContext"
import { useGenericApiResourceImplementation } from "@/hooks/useGenericApiResourceImplementation"
import { useNullishContext } from "@/hooks/useNullishContext"
import { ApiResource } from "@/types/api/ApiResource"
import { Authentication } from "@/types/Authentication"
import { ManagedResource } from "@/types/ManagedResource"

/**
 * A container to wrap a ApiResource that is returned from some API endpoint.
 * Comes with the following utility functions:
 * - `load()`: Triggers a reload of the resource.
 * - `setData`: Replaces the resource with a new entity.
 *
 * A reload is also automatically triggered if any of the values in the `dependencies` array
 * changes or the authentication object changes.
 *
 * Note: The `setData` method does not send the data to the server and changes will be overridden on
 * the next reload. It is recommended to not use it and make a copy of the resource instead.
 *
 * @note **Only call this hook inside `AuthenticationContext`.**
 *
 * @param {string} apiUrl The URL of the API endpoint, e.g. `/api/installation_status`, without the base.
 * @param {boolean} authNeeded If set to true, the data will only be loaded if the user is authenticated.
 * @param {boolean[]} dependencies If any of the boolean values in this array changes to true, a reload of the resource is triggered.
 */
export const useApiResource = <T extends ApiResource>(
    apiUrl: string,
    authNeeded?: boolean,
    dependencies?: boolean[],
): ManagedResource<T> => {
    const authentication: Authentication = useNullishContext(AuthenticationContext)

    return useGenericApiResourceImplementation(apiUrl, dependencies, authNeeded ? authentication : undefined)
}