import { ApiResource } from "@/types/api/ApiResource"

/**
 * This type equals its generics `ApiResource` type `T` but erases any identifiers (`id` and `"@id"`), making it
 * detached from any resource on the server. This also detaches all nested `ApiResource` and `ApiResource[]` types.
 *
 * This type can e.g. be used for `POST` requests.
 */
export type Detached<T extends ApiResource> = DetachedInternal<T>

type DetachedInternal<T> =
    T extends Array<infer U>
        ? DetachedInternal<U>[]
        : T extends ApiResource
            ? { [K in keyof Omit<T, "id" | "@id">]: DetachedInternal<T[K]> }
            : T extends object
                ? { [K in keyof T]: DetachedInternal<T[K]> }
                : T