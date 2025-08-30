import { Maybe } from "@/types/Maybe"

export interface Appendable {
    /**
     * Appends the given string.
     * Does nothing if `stringToAppend` is falsy.
     */
    append(stringToAppend: Maybe<string>): Appendable

    /**
     * Appends a line break.
     */
    newLine(): Appendable

    /**
     * Appends a blank space.
     */
    blank(): Appendable
}
