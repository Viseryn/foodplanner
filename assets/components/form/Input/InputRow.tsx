/**************************************************
 * ./assets/components/form/Textarea/InputRow.tsx *
 **************************************************/

import React from 'react'

import Label from '../Label'
import InputWidget from './InputWidget'

/**
 * A component that renders an input field with a corresponding label inside a div container.
 * 
 * @component
 * @param props
 * @param props.id The id of the input field.
 * @param props.label The label of the input field.
 * @param props.type Optional: The type of the input field. Default is 'text'.
 * @param props.style Optional: Styling classes for the div container.
 * 
 */
export default function InputRow({ id, label, type = 'text', style, ...widgetProps }: {
    id: string
    label: string
    type?: string
    style?: string
}): JSX.Element {
    return <div className={style}>
        <Label htmlFor={id}>{label}</Label>
        <InputWidget id={id} type={type} {...widgetProps} />
    </div>
}
