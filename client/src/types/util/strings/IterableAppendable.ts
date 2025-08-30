import { Appendable } from "@/types/util/strings/Appendable"

export interface IterableAppendable extends Appendable {
    /**
     * Iterates the `iteratorFn` over all `items`.
     * The `appendable` argument of the function refers to the `Appendable` on which this `forEach` is called on.
     *
     * @example
     * const foo: Appendable
     * foo.forEach(["1", "2", "3"], (sb, item, index) => sb
     *         .when(index !== 0).newLine()
     *         .append(item))
     *     .append("End")`
     */
    forEach<T>(items: T[], iterationFn: (appendable: Appendable, item: T, index: number) => Appendable): Appendable
}
