import { App } from "@/types/App"
import { Nullish } from "@/types/Nullish"
import { NullishContext } from "@/types/NullishContext"
import { createContext } from "react"

export const AppContext: NullishContext<App> = createContext<Nullish<App>>(null)
