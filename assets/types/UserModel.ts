import { Role } from "@/types/Role"

export type UserModel = {
    id?: number
    username?: string
    email?: string
    roles: Role[]
    active?: boolean
}
