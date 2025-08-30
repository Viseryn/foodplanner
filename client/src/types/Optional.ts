import { Nullish } from "@/types/Nullish"

interface OptionalInterface<T> {
    value: T | null
}

export class Optional<T> implements OptionalInterface<T> {
    readonly value: T | null = null

    constructor(initalValue?: T) {
        this.value = initalValue ?? null
    }

    static of<S>(value: S): Optional<S> {
        return new Optional<S>(value)
    }

    static ofNullable<S>(value?: S | null): Optional<S> {
        return value ? Optional.of(value) : Optional.empty<S>()
    }

    static empty<S>(): Optional<S> {
        return new Optional<S>()
    }

    map<R>(callback: (it: T) => R): Optional<R> {
        if (this.value) {
            return Optional.of(callback(this.value))
        } else {
            return Optional.empty<R>()
        }
    }

    get<K extends keyof T>(property: K): Nullish<T[K]> {
        return this.map(it => it[property]).orElse(undefined)
    }

    flatMap<R>(callback: (it: NonNullable<T>) => Optional<R>): Optional<R> {
        if (this.value) {
            return callback(this.value)
        } else {
            return Optional.empty<R>()
        }
    }

    orElse(elseValue: Nullish<T>): Nullish<T> {
        return this.value ?? elseValue
    }

    ifPresent(callback: (it: NonNullable<T>) => void): void {
        if (this.value) {
            callback(this.value)
        }
    }

    isPresent(): boolean {
        return !!this.value
    }

    filter(predicate: (it: T) => boolean): Optional<T> {
        if (this.value && predicate(this.value)) {
            return Optional.of(this.value)
        } else {
            return Optional.empty<T>()
        }
    }
}
