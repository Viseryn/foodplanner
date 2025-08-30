import { ApiResource } from "@/types/api/ApiResource"
import { Iri } from "@/types/api/Iri"
import { User } from "@/types/api/User"

/**
 * This type mirrors the ApiResource `UserGroup`.
 *
 * @note In contrast to `/types/api/UserGroup`, this type does not unbox the `User` resources and uses `Iri`s instead.
 * @see api/src/Entity/UserGroup.php
 */
export type UserGroup = ApiResource & {
    "@type": "UserGroup"
    id: number
    users: Iri<User>[]
    name: string
    icon: string
    readonly: boolean
    hidden: boolean
}
