import { ApiResource } from "@/types/api/ApiResource"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { ModelOption } from "@/types/options/ModelOption"
import { WidgetOption } from "@/types/options/WidgetOption"

/**
 * This function takes an `ManagedResourceCollection` and returns an array of corresponding `ModelOption` objects.
 *
 * @template T An `ApiResource`.
 * @template OptionType A `WidgetOption`.
 * @template S A class type that extends `ModelOption<T, OptionType>` (output type).
 *
 * @param entities An array of entities of type `T`.
 * @param modelOptionClass A class of type `S` that extends `ModelOption<T, OptionType>`.
 * @returns An array of `S` objects.
 */
export const getEntityOptions = <T extends ApiResource, OptionType extends WidgetOption, S extends ModelOption<T, OptionType>>(
    entities: ManagedResourceCollection<T>,
    modelOptionClass: new (entity: T) => S,
): S[] => {
    return (entities.isLoading ? [] : entities.data).map(entity => new modelOptionClass(entity))
}
