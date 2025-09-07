import { useFormChange } from "@/hooks/useFormChange"
import { Form } from "@/types/forms/Form"
import { RadioOption } from "@/types/options/RadioOption"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"
import { validateFormWidgetProps } from "@/util/forms/validateFormWidgetProps"
import { StringBuilder } from "@/util/StringBuilder"
import { ReactElement } from "react"

type OptionLabelMapper = (option: RadioOption) => ReactElement

type RadioWidgetProps<T extends Form> = FormWidgetProps<T> & {
    options: RadioOption[]
    optionLabelMapper?: OptionLabelMapper
    required?: boolean
    gridStyling?: string
}

export const RadioWidget = <T extends Form>(props: RadioWidgetProps<T>): ReactElement => {
    validateFormWidgetProps(props)

    const gridStyling = props.gridStyling ?? `flex flex-wrap justify-between gap-1`

    const defaultOptionLabelMapper: OptionLabelMapper = option => (
        <label
            htmlFor={option.id}
            className={StringBuilder.cn(
                "cursor-pointer overflow-ellipsis rounded-lg peer-checked:rounded-full h-9 px-2 font-semibold text-sm transition",
                "duration-300 flex items-center active:scale-95",
                "text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100",
                "peer-checked:text-white dark:peer-checked:text-primary-dark-100",
                "bg-secondary-200 dark:bg-secondary-dark-200",
                "peer-checked:bg-primary-100 dark:peer-checked:bg-primary-dark-200",
            )}
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
