/******************************************
 * ./assets/components/form/SelectRow.tsx *
 ******************************************/

import React from 'react'

import SelectOption from '@/types/SelectOption'
import Label from '../Label'
import SelectWidget from './SelectWidget'

/**
 * A component that renders a select input field with a corresponding label inside a div container.
 * 
 * @component
 * @param props
 * @param props.id The id of the select input field.
 * @param props.label The label of the select input field.
 * @param props.options An array of objects that represent the select options.
 * @param props.disabledOption Optional: The text of the disabled first option.
 * @param props.style Optional: Styling classes for the div container.
 */
export default function SelectRow({ id, label, options, disabledOption, style, ...widgetProps }: {
    id: string
    label: string
    options: Array<SelectOption>
    disabledOption?: string
    style?: string
}): JSX.Element {
    return <div className={style}>
        <Label htmlFor={id}>{label}</Label>
        <SelectWidget id={id} options={options} disabledOption={disabledOption} {...widgetProps} />
    </div>
}
