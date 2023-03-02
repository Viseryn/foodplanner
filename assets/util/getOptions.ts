/*******************************
 * ./assets/util/getOptions.ts *
 *******************************/

import EntityWithOption from '@/types/EntityWithOption'

/**
 * Given some entities, returns an appropriate array of option objects for form input widgets.
 * 
 * @template OptionType A type that describes an option, e.g. SelectOption or RadioOption.
 * @template EntityModel An entity model type that extends EntityWithOption<OptionType>.
 * @param entities An array of entities of type EntityModel.
 * @returns An array of the option properties of each entity.
 * 
 * @example getOptionsForEntities<SelectOption>(recipes.data) = [recipes.data[0].option, ...]
 * 
 * @todo There shouldn't be a need to null check the argument. Instead, the EntityModels should have some null-safety.
 * @see useFetch
 */
export default function getOptions<OptionType>(
    entities: Array<EntityWithOption<OptionType>>
): Array<OptionType> {
    // If the entities are an empty object (e.g. due to not being loaded yet), assume they are an empty array.
    return (Object.keys(entities).length !== 0 ? entities : []).map(entity => entity.option)
}
