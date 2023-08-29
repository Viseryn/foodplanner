/*******************************
 * ./assets/util/getOptions.ts *
 *******************************/

import ModelOption from '@/types/ModelOption'

/**
 * @template Model An entity model type.
 * @template OptionType Either SelectOption or RadioOption.
 * @param entityOptions An array of ModelOption objects.
 * @returns An array of OptionType objects.
 */
function getOptions<Model, OptionType>(entityOptions: Array<ModelOption<Model, OptionType>>): Array<OptionType> {
    return entityOptions.map(entityOption => entityOption.getOption())
}

export default getOptions
