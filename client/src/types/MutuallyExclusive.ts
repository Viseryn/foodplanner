import { Without } from "@/types/Without"

export type MutuallyExclusive<T, S> = (T | S) extends object
    ? (Without<T, S> & S) | (Without<S, T> & T)
    : T | S
