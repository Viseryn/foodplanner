import { ApiResource } from "@/types/api/ApiResource"
import { User } from "@/types/api/User"

/**
 * This type mirrors the ApiResource `UserGroup`.
 *
 * @see api/src/Entity/UserGroup.php
 */
export type UserGroup = ApiResource & {
    "@type": "UserGroup"
    id: number
    users: Pick<User, "@type" | "@id" | "id" | "username">[]
    name: string
    icon: string
    readonly: boolean
    hidden: boolean
}
