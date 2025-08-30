import { LINEBREAK } from "@/types/constants/LINEBREAK"
import { Maybe } from "@/types/Maybe"
import { Builder } from "@/types/util/Builder"
import { Loggable } from "@/types/util/Loggable"
import { Appendable } from "@/types/util/strings/Appendable"

import { IterableAppendable } from "@/types/util/strings/IterableAppendable"

export class StringBuilder implements IterableAppendable, Builder<string>, Loggable<StringBuilder> {
    private strings: string[]

    public constructor() {
        this.strings = []
    }

    static create(): StringBuilder {
        return new StringBuilder()
    }

    static of(startingString: string): StringBuilder {
        return new StringBuilder().append(startingString)
    }

    /**
     * A utility method for generating a `className` string with a variable amount of entries.
     * An entry can also be an array, where the first entry is a condition that has to be fulfilled for the second entry to be appended.
     * Returns the built string with a blank space as separator.
     */
    static cn(...args: (Maybe<string> | [boolean, Maybe<string>])[]): string {
        return new StringBuilder()
            .forEach(args, (sb, item) => {
                if (typeof item === "string") {
                    return sb.append(item)
                } else if (item !== undefined) {
                    return sb.when(item[0] && !!item[1]).append(item[1])
                } else {
                    return sb
                }
            })
            .build(" ")
    }

    /** Returns the complete string, joined by the (optional) specified separator. */
    public build(separator: string = ""): string {
        return this.strings.join(separator)
    }

    public clear(): StringBuilder {
        this.strings = []
        return this
    }

    public logToConsole(): StringBuilder {
        console.log(this.build())
        return this
    }

    /** Appends the given string to the StringBuilder. Does nothing if `stringToAppend` is falsy. */
    public append(stringToAppend: Maybe<string>): StringBuilder {
        if (stringToAppend) {
            this.strings.push(stringToAppend)
        }

        return this
    }

    public newLine(): StringBuilder {
        this.strings.push(LINEBREAK)
        return this
    }

    public blank(): StringBuilder {
        this.strings.push(" ")
        return this
    }

    public forEach<T>(items: T[], iterationFn: (sb: StringBuilder, item: T, index: number) => StringBuilder): StringBuilder {
        let index = 0

        items.forEach((item: T) => {
            iterationFn(this, item, index)
            index++
        })

        return this
    }

    public when(condition: boolean): ConditionalStringBuilder {
        return new ConditionalStringBuilder(this, condition)
    }

    public isEmpty(): boolean {
        return this.strings.length === 0
    }

    public isNotEmpty(): boolean {
        return !this.isEmpty()
    }

    /** Returns the internal array of strings. */
    public getInternalArray(): string[] {
        return this.strings
    }

    /** Returns the last added string, including internally added strings like linebreaks or blank spaces. */
    public getLast(): Maybe<string> {
        return this.strings.length > 0 ? this.strings[this.strings.length - 1] : undefined
    }
}

class ConditionalStringBuilder implements Appendable {
    public constructor(
        private readonly sb: StringBuilder,
        private readonly condition: boolean,
    ) {
    }

    /**
     * Appends the given string if the condition of the `ConditionalStringBuilder` is `true`.
     * Does nothing if `stringToAppend` is falsy.
     */
    append(stringToAppend: Maybe<string>): StringBuilder {
        return this.condition ? this.sb.append(stringToAppend) : this.sb
    }

    /**
     * Appends a line break if the condition of the `ConditionalStringBuilder` is `true`.
     */
    newLine(): StringBuilder {
        return this.condition ? this.sb.newLine() : this.sb
    }

    /**
     * Appends a blank space if the condition of the `ConditionalStringBuilder` is `true`.
     */
    blank(): StringBuilder {
        return this.condition ? this.sb.blank() : this.sb
    }
}
