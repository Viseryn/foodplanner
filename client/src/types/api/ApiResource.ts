import { Iri } from "@/types/api/Iri"

/**
 * Base entity type. Every ApiResource that is requested from the server
 * should have its own type definition that inherits from this type.
 *
 * A type that inherits from this type should overwrite "@type" properly.
 */
export type ApiResource = {
    /** The type of the resource. Corresponds to its ApiResource PHP class name. */
    "@type": string

    /** The API identifier of the resource (its IRI). */
    "@id": Iri<ApiResource>
}
