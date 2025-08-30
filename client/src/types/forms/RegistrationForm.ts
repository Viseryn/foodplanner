import { Form } from "@/types/forms/Form"

export type RegistrationForm = Form & {
    username: string
    plainPassword: string
}
