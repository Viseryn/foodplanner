import { useGenericApiResourceImplementation } from "@/hooks/useGenericApiResourceImplementation"
import { ApiResource } from "@/types/api/ApiResource"
import { ManagedResource } from "@/types/ManagedResource"

/**
 * Does the same as `useApiResource`, but can be called outside `AuthenticationContext`.
 *
 * @see useApiResource
 *
 * @param {string} apiUrl The URL of the API endpoint, e.g. `/api/installation_status`, without the base.
 * @param {boolean[]} dependencies If any of the boolean values in this array changes to true, a reload of the resource is triggered.
 */
export const useUnauthenticatedApiResource = <T extends ApiResource>(
    apiUrl: string,
    dependencies?: boolean[],
): ManagedResource<T> => {
    return useGenericApiResourceImplementation(apiUrl, dependencies)
}
