/*************************************
 * ./assets/types/ModelWithOption.ts *
 *************************************/

/**
 * Model for an entity that can be an option of some form input widget, e.g. select or radio.
 */
type ModelWithOption<OptionType> = {
    option: OptionType
}

export default ModelWithOption
