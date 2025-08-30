import { Authentication } from "@/types/Authentication"
import { Nullish } from "@/types/Nullish"
import { NullishContext } from "@/types/NullishContext"
import { createContext } from "react"

export const AuthenticationContext: NullishContext<Authentication> =
    createContext<Nullish<Authentication>>(null)
