import { ModelOption } from '@/types/ModelOption'
import { WidgetOption } from "@/types/WidgetOption"

/**
 * This function takes an `EntityState` object of an entity array and returns an array of corresponding
 * `ModelOption` objects.
 *
 * @template T An entity model type (input type).
 * @template OptionType A `WidgetOption`.
 * @template S A class type that extends `ModelOption<T, OptionType>` (output type).
 *
 * @param entities An array of entities of type `T`.
 * @param modelOptionClass A class of type `S` that extends `ModelOption<T, OptionType>`.
 * @returns An array of `S` objects.
 */
export const getEntityOptions = <T, OptionType extends WidgetOption, S extends ModelOption<T, OptionType>>(
    entities: EntityState<T[]>,
    modelOptionClass: new (entity: T) => S,
): S[] => {
    return (entities.isLoading ? [] : entities.data).map(entity => new modelOptionClass(entity))
}
