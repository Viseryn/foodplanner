export type Without<T, S> = {
    [P in Exclude<keyof T, keyof S>]?: never
}
