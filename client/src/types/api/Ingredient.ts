import { ApiResource } from "@/types/api/ApiResource"
import { Iri } from "@/types/api/Iri"
import { Storage } from "@/types/api/Storage"
import { PANTRY_IRI } from "@/types/constants/PANTRY_IRI"
import { SHOPPINGLIST_IRI } from "@/types/constants/SHOPPINGLIST_IRI"

/**
 * This type mirrors the ApiResource `Ingredient`.
 *
 * @see api/src/Entity/Ingredient.php
 */
export type Ingredient = ApiResource & {
    "@type": "Ingredient"
    id: number
    name: string
    storage?: Iri<Storage> & typeof PANTRY_IRI | typeof SHOPPINGLIST_IRI
    quantityValue?: string
    quantityUnit?: string
    position?: number
    checked?: boolean
}
