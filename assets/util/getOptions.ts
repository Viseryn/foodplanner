/*******************************
 * ./assets/util/getOptions.ts *
 *******************************/

import ModelWithOption from '@/types/ModelWithOption'

/**
 * Given some entities, returns an appropriate array of option objects for form input widgets.
 * 
 * @template OptionType A type that describes an option, e.g. SelectOption or RadioOption.
 * @template EntityModel An entity model type that extends EntityWithOption<OptionType>.
 * @param entities An array of entities of type EntityModel.
 * @returns An array of the option properties of each entity.
 * 
 * @example getOptionsForEntities<SelectOption>(recipes.data) = [recipes.data[0].option, ...]
 * @see useFetch
 */
function getOptions<OptionType, Model extends ModelWithOption<OptionType>>(
    entities: EntityState<Array<Model>>
): Array<OptionType> {
    // If the entities are not being loaded yet, assume they are an empty array.
    return (entities.isLoading ? [] : entities.data).map(entity => entity.option)
}

export default getOptions
