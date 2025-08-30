import { useFormChange } from "@/hooks/useFormChange"
import { useFormWidgetStyling } from "@/hooks/useFormWidgetStyling"
import { Form } from "@/types/forms/Form"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"
import { validateFormWidgetProps } from "@/util/forms/validateFormWidgetProps"
import { ReactElement } from "react"

type InputWidgetProps<T extends Form> = FormWidgetProps<T> & {
    type?: "text" | "password" | "email" | "submit"
    required?: boolean
    placeholder?: string
    maxLength?: number
}

export const InputWidget = <T extends Form>(props: InputWidgetProps<T>): ReactElement => {
    validateFormWidgetProps(props)

    return (
        <input
            id={props.field}
            name={props.field}
            type={props.type ?? "text"}
            value={props.formData[props.field]?.toString()}
            required={props.required ?? false}
            placeholder={props.placeholder ?? ""}
            className={useFormWidgetStyling(props)}
            onChange={useFormChange(props.setFormData)}
        />
    )
}
