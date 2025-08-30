import { Iri } from "@/types/api/Iri"
import { User } from "@/types/api/User"
import { Form } from "@/types/forms/Form"

export type UserGroupForm = Form & {
    name: string
    icon: string
    users: Iri<User>[]
}
