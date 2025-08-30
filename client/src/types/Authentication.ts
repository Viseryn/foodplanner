import { Role } from "@/types/Role"

export type Authentication = {
    isAuthenticated: boolean
    isLoading: boolean
    roles: Role[]
}
