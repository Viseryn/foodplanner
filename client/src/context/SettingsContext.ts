import { Settings } from "@/types/api/Settings"
import { ManagedResource } from "@/types/ManagedResource"
import { Nullish } from "@/types/Nullish"
import { NullishContext } from "@/types/NullishContext"
import { createContext } from "react"

export const SettingsContext: NullishContext<ManagedResource<Settings>> =
    createContext<Nullish<ManagedResource<Settings>>>(null)
