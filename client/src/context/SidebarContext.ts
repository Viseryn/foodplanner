import { Nullish } from "@/types/Nullish"
import { NullishContext } from "@/types/NullishContext"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { createContext } from "react"

export const SidebarContext: NullishContext<Sidebar> = createContext<Nullish<Sidebar>>(null)
