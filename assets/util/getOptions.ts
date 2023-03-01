/*******************************
 * ./assets/util/getOptions.ts *
 *******************************/

import EntityWithOption from '@/types/EntityWithOption'

/**
 * @template OptionType A type that describes an option, e.g. SelectOption or RadioOption.
 * @template EntityModel An entity type that extends EntityWithOption<OptionType>.
 * @param entities An array of entities of type EntityModel.
 * @returns An array of the option properties of each entity.
 * 
 * @example getOptionsForEntities(recipes.data) = [recipes.data[0].option, ...]
 */
export default function getOptions<OptionType, EntityModel extends EntityWithOption<OptionType>>(
    entities: Array<EntityModel>
): Array<OptionType> {
    return (Object.keys(entities).length !== 0 ? entities : []).map(entity => entity.option)
}
