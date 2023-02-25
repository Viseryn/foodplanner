/*****************************************************
 * ./assets/components/form/Textarea/TextareaRow.tsx *
 *****************************************************/

import React from 'react'
import Label from '../Label'
import TextareaWidget from './TextareaWidget'
import rowStyle from '../util/rowStyle'

/**
 * TextareaRow
 * 
 * A component that renders a textarea field with a corresponding label inside a div container.
 * 
 * @component
 * @param props
 * @param props.id The id of the textarea field.
 * @param props.label The label of the textarea field.
 * @param props.style Optional alternative styling classes for the div container.
 */
export default function TextareaRow({ id, label, style = rowStyle, ...widgetProps }: {
    id: string
    label: string
    style?: string
}): JSX.Element {
    return <div className={style}>
        <Label htmlFor={id}>{label}</Label>
        <TextareaWidget id={id} {...widgetProps} />
    </div>
}
