import { WidgetOption } from "@/types/options/WidgetOption"

/**
 * For an entity represented by the type `T`, a `ModelOption<T, OptionType>` subclass needs to be implemented if the
 * entity is wished to be used in, e.g., a `SelectWidget` or `RadioWidget` list. The method `getOption` is the only one
 * that needs to be implemented. It returns the corresponding `OptionType`.
 *
 * For example, if a `SelectWidget` should have all Recipe entities as options, a subclass `RecipeOption` should
 * be created that extends `ModelOption<RecipeModel, SelectOption>` and implements `getOption` by returning a fitting
 * `SelectOption` object.
 *
 * @template T The entities' type, e.g. RecipeModel.
 * @template OptionType The desired `WidgetOption`.
 */
export abstract class ModelOption<T, OptionType extends WidgetOption> {
    entity: T

    constructor(entity: T) {
        this.entity = entity
    }

    abstract getOption(): OptionType
}
