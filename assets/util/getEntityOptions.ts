/*************************************
 * ./assets/util/getEntityOptions.ts *
 *************************************/

import ModelOption from '@/types/ModelOption'

/**
 * @template Model An entity model type.
 * @template OptionType Either SelectOption or RadioOption.
 * @template T A class type that extends ModelOption<Model, OptionType>
 * @param entities An array of entities of type Model.
 * @param modelOptionClass A class of type T that extends ModelOption<Model, OptionType>.
 * @returns An array of T objects.
 */
function getEntityOptions<Model, OptionType, T extends ModelOption<Model, OptionType>>(
    entities: EntityState<Array<Model>>,
    modelOptionClass: new (entity: Model) => T,
): Array<T> {
    return (entities.isLoading ? [] : entities.data).map(entity => new modelOptionClass(entity))
}

export default getEntityOptions;
