import { Nullish } from "@/types/Nullish"
import { NullishContext } from "@/types/NullishContext"
import { useContext } from "react"

export const useNullishContext = <T, >(context: NullishContext<T>): T => {
    const contextValue: Nullish<T> = useContext(context)

    if (contextValue === null || contextValue === undefined) {
        throw Error("Context has not been provided.")
    }

    return contextValue
}
