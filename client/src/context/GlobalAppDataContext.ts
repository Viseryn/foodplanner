import { GlobalAppData } from "@/types/GlobalAppData"
import { Nullish } from "@/types/Nullish"
import { NullishContext } from "@/types/NullishContext"
import { createContext } from "react"

/**
 * Contains global app data, i.e. the most used entities that are used among all major pages.
 */
export const GlobalAppDataContext: NullishContext<GlobalAppData> =
    createContext<Nullish<GlobalAppData>>(null)
