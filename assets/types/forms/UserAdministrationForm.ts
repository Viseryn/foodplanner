import { SwitchValue } from "@/lang/constants/SwitchValue"
import { Form } from "@/types/forms/Form"
import { Role } from "@/types/Role"

export type UserAdministrationForm = Form & {
    username: string
    roles: Role[]
    email: string
    active: SwitchValue
}
