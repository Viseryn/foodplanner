import { useFormChange } from "@/hooks/useFormChange"
import { SwitchValue } from "@/types/enums/SwitchValue"
import { Form } from "@/types/forms/Form"
import { Maybe } from "@/types/Maybe"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"
import { validateFormWidgetProps } from "@/util/forms/validateFormWidgetProps"
import { ReactElement } from "react"

const { ON, OFF } = SwitchValue

type SwitchWidgetProps<T extends Form> = FormWidgetProps<T> & {
    displayedText: string
    onClick?: (() => void) | (() => Promise<void>)
}

export const SwitchWidget = <T extends Form>(props: SwitchWidgetProps<T>): ReactElement => {
    validateFormWidgetProps(props)
    validateSwitchWidgetField(props)

    return (
        <label htmlFor={props.field} className={"inline-flex items-center relative cursor-pointer"} onClick={props.onClick}>
            <input
                id={props.field}
                name={props.field}
                type={"checkbox"}
                checked={props.formData[props.field] === ON}
                value={props.formData[props.field]}
                className={"sr-only peer"}
                onChange={useFormChange(props.setFormData)}
            />
            <div className={"w-11 h-6 bg-[#e0e4d6] dark:bg-[#43483e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition duration-300 dark:border-gray-600 peer-checked:bg-primary-100 dark:peer-checked:bg-primary-dark-200"} />
            <span className={"ml-3 text-sm font-semibold"}>{props.displayedText}</span>
        </label>
    )
}

const validateSwitchWidgetField = <T extends Form>(props: SwitchWidgetProps<T>): void => {
    const fieldValue: Maybe<string> = props.formData[props.field]?.toString()
    if (fieldValue !== ON && fieldValue !== OFF) {
        throw new Error(`Field ${(props.field)} must be "on" or "off" but is "${props.formData[props.field]}" instead.`)
    }
}
