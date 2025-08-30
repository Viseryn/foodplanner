export interface Builder<T> {
    /**
     * Terminates the Builder and returns something of the `Builder`'s generic type.
     */
    build(): T

    /**
     * Clears the internal data of the `Builder` implementation.
     */
    clear(): Builder<T>
}
