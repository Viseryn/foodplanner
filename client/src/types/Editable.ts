/**
 * The `Editable<T>` type represents a type `T` that can be edited interactively.
 * The property `editMode` should be set to `true` if the object of type `T` is
 * in a state where it can be edited, and false otherwise.
 */
export type Editable<T> = T & { editMode?: boolean }
