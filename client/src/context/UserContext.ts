import { User } from "@/types/api/User"
import { ManagedResource } from "@/types/ManagedResource"
import { Nullish } from "@/types/Nullish"
import { NullishContext } from "@/types/NullishContext"
import { createContext } from "react"

export const UserContext: NullishContext<ManagedResource<User>> =
    createContext<Nullish<ManagedResource<User>>>(null)
