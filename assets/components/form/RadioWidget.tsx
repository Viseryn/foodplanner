import { useFormChange } from "@/hooks/useFormChange"
import { Form } from "@/types/forms/Form"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"
import { RadioOption } from "@/types/options/RadioOption"
import { validateFormWidgetProps } from "@/util/forms/validateFormWidgetProps"
import React, { ReactElement } from "react"

type OptionLabelMapper = (option: RadioOption) => ReactElement

type RadioWidgetProps<T extends Form> = FormWidgetProps<T> & {
    options: RadioOption[]
    optionLabelMapper?: OptionLabelMapper
    required?: boolean
    gridStyling?: string
}

export const RadioWidget = <T extends Form>(props: RadioWidgetProps<T>): ReactElement => {
    validateFormWidgetProps(props)

    const gridStyling = props.gridStyling ?? `flex flex-wrap justify-between gap-2`

    const defaultOptionLabelMapper: OptionLabelMapper = option => (
        <label
            htmlFor={option.id}
            className={"cursor-pointer overflow-ellipsis rounded-xl h-9 px-2 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 peer-checked:bg-secondary-200  dark:peer-checked:bg-secondary-dark-200 -dark:peer-checked:text-blue-800 border border-secondary-200 dark:border-secondary-dark-200"}
        >
            <span className="material-symbols-rounded">{option.icon}</span>
            <span className="label-content mr-1 ml-3">{option.label}</span>
        </label>
    )

    const optionLabelMapper: OptionLabelMapper = props.optionLabelMapper ?? defaultOptionLabelMapper

    return (
        <div className={gridStyling}>
            {props.options.map((option: RadioOption) =>
                <div key={option.id} className={"grow"}>
                    <input
                        id={option.id}
                        name={props.field}
                        type={"radio"}
                        className={"peer fixed opacity-0 pointer-events-none"}
                        required={props.required ?? false}
                        defaultValue={option.value}
                        defaultChecked={option.checked}
                        onChange={useFormChange(props.setFormData)}
                    />
                    {optionLabelMapper(option)}
                </div>
            )}
        </div>
    )
}
