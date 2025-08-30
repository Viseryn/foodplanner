import { useApiResource } from "@/hooks/useApiResource"
import { ApiResource } from "@/types/api/ApiResource"
import { Collection } from "@/types/api/Collection"
import { ManagedResource } from "@/types/ManagedResource"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"

/**
 * A container to wrap a collection of ApiResources that is returned from some API endpoint.
 * Comes with the following utility functions:
 * - `load()`: Triggers a reload of the collection.
 * - `setData`: Updates the `member` property of the ApiResource with a new array of entities.
 *
 * A reload is also automatically triggered if any of the values in the `dependencies` array
 * changes or the authentication object changes.
 *
 * Note: The `setData` method does not send the data to the server and changes will be overridden on
 * the next reload. It is recommended to not use it and make a copy of the collection instead.
 *
 * @note **Only call this hook inside `AuthenticationContext`.**
 *
 * @param {string} apiUrl The URL of the API endpoint, e.g. `/api/meal_categories`, without the base.
 * @param {boolean} authNeeded If set to true, the data will only be loaded if the user is authenticated.
 * @param {boolean[]} dependencies If any of the boolean values in this array changes to true, a reload of the collection is triggered.
 */
export const useApiResourceCollection = <T extends ApiResource>(
    apiUrl: string,
    authNeeded?: boolean,
    dependencies?: boolean[]
): ManagedResourceCollection<T> => {
    const managedApiResourceCollection: ManagedResource<Collection<T>> = useApiResource(apiUrl, authNeeded, dependencies)

    const setData = (value: T[]): void => {
        if (managedApiResourceCollection.isLoading || managedApiResourceCollection.data === undefined) {
            throw new Error("Attempted to update a collection while it is loading.")
        }

        managedApiResourceCollection.setData({
            ...managedApiResourceCollection.data,
            totalItems: value.length,
            member: value,
        })
    }

    return (managedApiResourceCollection.isLoading || managedApiResourceCollection.data === undefined)
        ? { data: undefined, isLoading: true, load: managedApiResourceCollection.load }
        : { data: managedApiResourceCollection.data.member, setData: setData, isLoading: false, load: managedApiResourceCollection.load, detached: managedApiResourceCollection.detached }
}
