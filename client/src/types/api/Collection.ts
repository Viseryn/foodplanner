import { ApiResource } from "@/types/api/ApiResource"

/**
 * Base type for entity collections. Since collection of ApiResources are returned as
 * an object and not an array, this wrapper type is needed.
 *
 * @note The property `totalItems` represents the number of items at time of request
 *       and is not updated. DO NOT use this for business logic. Use `length` instead.
 */
export type Collection<T extends ApiResource> = ApiResource & {
    "@type": "Collection"
    totalItems: number
    member: T[]
}
