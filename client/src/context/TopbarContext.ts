import { Nullish } from "@/types/Nullish"
import { NullishContext } from "@/types/NullishContext"
import { Topbar } from "@/types/topbar/Topbar"
import { createContext } from "react"

export const TopbarContext: NullishContext<Topbar> = createContext<Nullish<Topbar>>(null)
