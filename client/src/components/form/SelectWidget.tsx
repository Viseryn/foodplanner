import { useFormChange } from "@/hooks/useFormChange"
import { useFormWidgetStyling } from "@/hooks/useFormWidgetStyling"
import { Form } from "@/types/forms/Form"
import { Maybe } from "@/types/Maybe"
import { SelectOption } from "@/types/options/SelectOption"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"
import { validateFormWidgetProps } from "@/util/forms/validateFormWidgetProps"
import { ReactElement } from "react"

type SelectWidgetProps<T extends Form> = FormWidgetProps<T> & {
    options: SelectOption[]
    disabledOption?: string
    multiple?: boolean
    required?: boolean
    size?: number
}

export const SelectWidget = <T extends Form>(props: SelectWidgetProps<T>): ReactElement => {
    validateFormWidgetProps(props)

    return (
        <select
            id={props.field}
            name={props.field}
            size={props.size ?? props.options.length}
            multiple={props.multiple ?? false}
            required={props.required ?? false}
            value={props.formData[props.field] as Maybe<string | number | readonly string[]>}
            className={useFormWidgetStyling(props)}
            onChange={useFormChange(props.setFormData)}
        >
            {props.disabledOption != undefined && <option disabled={true}>{props.disabledOption}</option>}
            {props.options.map((option, index) =>
                <option key={index} value={option.id}>{option.label}</option>
            )}
        </select>
    )
}
