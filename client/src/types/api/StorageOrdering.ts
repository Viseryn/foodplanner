import { ApiResource } from "@/types/api/ApiResource"
import { Ingredient } from "@/types/api/Ingredient"
import { Iri } from "@/types/api/Iri"

/**
 * This type mirrors the ApiResource `StorageOrdering`.
 *
 * @see api/src/ApiResource/StorageOrdering.php
 */
export type StorageOrdering = ApiResource & {
    "@type": "StorageOrdering"
    ingredients: Iri<Ingredient>[]
}
