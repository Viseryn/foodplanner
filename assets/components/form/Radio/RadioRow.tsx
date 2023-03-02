/*****************************************
 * ./assets/components/form/RadioRow.tsx *
 *****************************************/

import React from 'react'

import RadioOption from '@/types/RadioOption'
import Label from '../Label'
import RadioWidget from './RadioWidget'

/**
 * A component that renders a radio input field with a corresponding label inside a div container.
 * 
 * @component
 * @param props
 * @param props.id The id of the whole radio input field.
 * @param props.label The label of the select input field.
 * @param props.options An array of objects that represent the radio options.
 * @param props.style Optional: Styling classes for the div container.
 */
export default function RadioRow({ id, label, options, style, ...widgetProps }: {
    id: string
    label: string
    options: Array<RadioOption>
    style?: string
}): JSX.Element {
    return <div className={style}>
        <Label htmlFor={id}>{label}</Label>
        <RadioWidget id={id} options={options} {...widgetProps} />
    </div>
}
