/*****************************************
 * ./assets/components/form/RadioRow.tsx *
 *****************************************/

import React from 'react'
import Label from '../Label'
import rowStyle from '../util/rowStyle'
import RadioWidget from './RadioWidget'

/**
 * RadioRow
 * 
 * A component that renders a radio input field with a corresponding label inside a div container.
 * 
 * @component
 * @param props
 * @param props.id The id of the whole radio input field.
 * @param props.label The label of the select input field.
 * @param props.options An array of objects that represent the radio options.
 * @param props.options.id The id of the option form field. NOT the entity id.
 * @param props.options.value Usually the entity id.
 * @param props.style Optional alternative styling classes for the div container.
 */
export default function RadioRow({ id, label, options, style = rowStyle, ...widgetProps }: {
    id: string
    label: string
    options: Array<{ 
        /**
         * @example mealCategory_nameOfSomeCategory
         */
        id: string
        icon?: string
        label: string 
        /**
         * @example $mealCategory->getId()
         */
        value?: string | number
        checked?: boolean
    }>
    style?: string
}): JSX.Element {
    return <div className={style}>
        <Label htmlFor={id}>{label}</Label>
        <RadioWidget id={id} options={options} {...widgetProps} />
    </div>
}
