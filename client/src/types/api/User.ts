import { ApiResource } from "@/types/api/ApiResource"
import { Iri } from "@/types/api/Iri"
import { Recipe } from "@/types/api/Recipe"
import { Role } from "@/types/Role"

/**
 * This type mirrors the ApiResource `User`.
 *
 * @see api/src/Entity/User.php
 */
export type User = ApiResource & {
    "@type": "User"
    id: number
    username: string
    roles: Role[]
    email?: string
    active: boolean
    recipeFavorites: Iri<Recipe>[]
}
