/**************************************
 * ./assets/types/EntityWithOption.ts *
 **************************************/

/**
 * Model for an entity that can be an option of some form input widget, e.g. select or radio.
 */
type EntityWithOption<OptionType> = {
    option: OptionType
}

export default EntityWithOption
