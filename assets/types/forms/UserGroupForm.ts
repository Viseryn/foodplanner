import { Form } from "@/types/forms/Form"

export type UserGroupForm = Form & {
    name: string
    icon: string
    users: string[]
}
