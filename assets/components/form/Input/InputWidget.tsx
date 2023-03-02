/*****************************************************
 * ./assets/components/form/Textarea/InputWidget.tsx *
 *****************************************************/

import React from 'react'

import nameFromId from '../util/nameFromId'
import widgetStyle from '../util/widgetStyle'

/**
 * A component that renders an input field.
 * 
 * @component
 * @param props
 * @param props.id The id of the input field.
 * @param props.type Optional: The type of the input field. Default is 'text'.
 * @param props.style Optional: Alternative styling classes.
 * 
 */
export default function InputWidget({ id, type = 'text', style = widgetStyle, ...props }: {
    id: string
    type?: string
    style?: string
}): JSX.Element {
    return <input
        id={id}
        name={nameFromId(id)}
        type={type}
        className={style}
        {...props}
    />
}
