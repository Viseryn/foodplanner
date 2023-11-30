import { LINEBREAK } from '@/lang/constants/LINEBREAK'

export class StringBuilder {
    private readonly strings: string[]

    public constructor() {
        this.strings = []
    }

    /** Appends the given string to the StringBuilder. */
    public append(stringToAppend: string): StringBuilder {
        this.strings.push(stringToAppend)
        return this
    }

    /** Appends a linebreak to the StringBuilder. */
    public newLine(): StringBuilder {
        this.strings.push(LINEBREAK)
        return this
    }

    /** Appends a blank space to the StringBuilder. */
    public blank(): StringBuilder {
        this.strings.push(" ")
        return this
    }

    /** Returns the complete string, joined by the (optional) specified separator. */
    public build(separator: string = ""): string {
        return this.strings.join(separator)
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
    public getLast(): string {
        return this.strings[this.strings.length - 1]
    }

    public logToConsole(): void {
        console.log(this.build())
    }

    public logLastToConsole(): void {
        console.log(this.getLast())
    }
}