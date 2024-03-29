/**********************************
 * ./assets/types/RadioOption.ts *
 **********************************/

/**
 * Model for an option of a radio input widget.
 */
type RadioOption = {
    /** The id of the option. (NOT the id of the entity!) */
    id: string

    /** The label (i.e., the displayed text) of the option. */
    label: string

    /** The (optional) icon displayed left to the label of the option. */
    icon?: string

    /** Whether the option is the checked one. */
    checked?: boolean

    /** The value of the option. (CAN be the id of the entity!) */
    value?: string
}

export default RadioOption
