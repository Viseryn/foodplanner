import { useFormChange } from "@/hooks/useFormChange"
import { useFormWidgetStyling } from "@/hooks/useFormWidgetStyling"
import { Form } from "@/types/forms/Form"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"
import { validateFormWidgetProps } from "@/util/forms/validateFormWidgetProps"
import { ReactElement } from "react"

type TextareaWidgetProps<T extends Form> = FormWidgetProps<T> & {
    required?: boolean
    placeholder?: string
    rows?: number
}

export const TextareaWidget = <T extends Form>(props: TextareaWidgetProps<T>): ReactElement => {
    validateFormWidgetProps(props)

    const defaultStyling: string = `dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 block border border-gray-300 dark:border-none rounded-md px-4 py-2 w-full transition duration-300 focus:border-primary-100 resize-none`

    return (
        <textarea
            id={props.field}
            name={props.field}
            value={props.formData[props.field]?.toString()}
            required={props.required ?? false}
            rows={props.rows ?? 5}
            placeholder={props.placeholder ?? ""}
            className={useFormWidgetStyling(props, defaultStyling)}
            onChange={useFormChange(props.setFormData)}
        />
    )
}
