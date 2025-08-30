import { ApiResource } from "@/types/api/ApiResource"
import { Ingredient } from "@/types/api/Ingredient"
import { Iri } from "@/types/api/Iri"

/**
 * This type mirrors the ApiResource `Storage`.
 *
 * @see api/src/Entity/Storage.php
 */
export type Storage = ApiResource & {
    "@type": "Storage"
    id: number
    name: string
    ingredients: Iri<Ingredient>[]
}
