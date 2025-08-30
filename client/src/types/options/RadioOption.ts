export type RadioOption = {
    /** The id of the option. (NOT the id of the entity!). Could for example be `fieldName_entityId`. */
    id: string

    /** The label (i.e., the displayed text) of the option. */
    label: string

    /** The value of the option. (CAN be the id of the entity!) */
    value?: string

    /** The (optional) icon displayed left to the label of the option. */
    icon?: string

    /** Whether the option is the checked one. */
    checked?: boolean
}
