import { Form } from "@/types/forms/Form"

type FormWidgetStylingProps = {
    style?: string
} | {
    styleOverride: string
}

export type FormWidgetProps<T extends Form> = {
    field: string
    formData: T
    setFormData: SetState<T>
} & FormWidgetStylingProps
