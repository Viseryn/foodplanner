import { ModelOption } from "@/types/options/ModelOption"
import { WidgetOption } from "@/types/options/WidgetOption"

/**
 * This function takes an array of `ModelOption<Model, OptionType>` objects and returns a fitting array of `OptionType`
 * objects, which can e.g. be used as option argument for a `SelectWidget` (when `OptionType = SelectOption`) or
 * `RadioWidget` (when `OptionType = RadioOption`).
 *
 * @template T The entities' type, e.g. `RecipeModel`.
 * @template OptionType A `WidgetOption`.
 * @param modelOptions An array of `ModelOption` objects.
 * @returns An array of `OptionType` objects.
 */
export const getFormOptions = <T, OptionType extends WidgetOption>(
    modelOptions: ModelOption<T, OptionType>[],
): OptionType[] => {
    return modelOptions.map(modelOption => modelOption.getOption())
}
