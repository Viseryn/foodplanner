import { ApiResource } from "@/types/api/ApiResource"
import { Iri } from "@/types/api/Iri"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Maybe } from "@/types/Maybe"

export const findEntityByIri = <T extends ApiResource>(
    iri: Iri<T>,
    collection: ManagedResourceCollection<T>,
): Maybe<T> => {
    return collection.data?.find((entity: T): boolean => entity["@id"] === iri)
}
