import { Nullish } from "@/types/Nullish"
import { Context } from "react"

export type NullishContext<T> = Context<Nullish<T>>
