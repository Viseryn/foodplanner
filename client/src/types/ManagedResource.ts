import { ApiResource } from "@/types/api/ApiResource"
import { ResourceLoader } from "@/types/ResourceLoader"
import { UnloadedResource } from "@/types/UnloadedResource"

type LoadedResource<T extends ApiResource> = {
    isLoading: false
    data: T
    setData: (value: T) => void
    /**
     * This property will be set to `true` whenever `data` is changed by using the method `setData`.
     * This means that the internal data of this resource is detached from server data (i.e., they are not
     * synced anymore). Will be set to `false` when the resource is loaded from the server again.
     */
    detached: boolean
}

export type ManagedResource<T extends ApiResource, TLoading = boolean> = ResourceLoader & (TLoading extends false ? UnloadedResource : LoadedResource<T>)
