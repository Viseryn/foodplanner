import { Iri } from "@/types/api/Iri"
import { Recipe } from "@/types/api/Recipe"
import { AddMealForm } from "@/types/forms/AddMealForm"
import { Form } from "@/types/forms/Form"
import { RadioOption } from "@/types/options/RadioOption"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"
import { validateFormWidgetProps } from "@/util/forms/validateFormWidgetProps"
import { ReactElement } from "react"

type OptionLabelMapper = (option: RadioOption) => ReactElement

type SideDishesWidgetProps<T extends Form> = FormWidgetProps<T> & {
    options: RadioOption[]
    optionLabelMapper: OptionLabelMapper
    gridStyling?: string
}

export const SideDishesWidget = <T extends AddMealForm>(props: SideDishesWidgetProps<T>): ReactElement => {
    validateFormWidgetProps(props)

    const gridStyling = props.gridStyling ?? `flex flex-wrap justify-between gap-1`

    return (
        <div className={gridStyling}>
            {props.options.map((option: RadioOption) =>
                <div key={option.id} className={"grow"}>
                    <input
                        id={option.id}
                        name={props.field}
                        type={"checkbox"}
                        className={"peer fixed opacity-0 pointer-events-none"}
                        defaultValue={option.value}
                        defaultChecked={option.checked}
                        onChange={() => {
                            const value: Iri<Recipe> = option.value as Iri<Recipe>
                            const newSideDishes: Iri<Recipe>[] = props.formData.sideDishes.includes(value)
                                ? props.formData.sideDishes.filter(it => it !== value)
                                : [...props.formData.sideDishes, value]

                            props.setFormData(prev => ({
                                ...prev,
                                sideDishes: newSideDishes,
                            }))
                        }}
                    />
                    {props.optionLabelMapper(option)}
                </div>
            )}
        </div>
    )
}
