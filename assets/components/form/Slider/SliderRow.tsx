/*************************************************
 * ./assets/components/form/Slider/SliderRow.tsx *
 *************************************************/

import React from 'react'
import { Slider } from '@mui/material'
import Label from '../Label'
import nameFromId from '../util/nameFromId'
import rowStyle from '../util/rowStyle'

/**
 * SliderRow
 * 
 * A component that renders slider input field with a corresponding label inside a div container.
 * 
 * @component
 * @param props
 * @param props.id The id of the slider input field.
 * @param props.label The label of the slider input field.
 * @param props.style Optional alternative styling classes for the div container.
 * 
 * @example widgetProps = { min: number, max: number, step: number, marks: Array<{ value: any, label: string }> }
 * 
 * @todo Create custom SliderWidget component.
 */
export default function SliderRow({ id, label, style = rowStyle, ...widgetProps }: {
    id: string
    label: string
    style?: string
}) {
    return <div className={style}>
        <Label htmlFor={id}>{label}</Label>
        <div className="px-2">
            <Slider
                id={id}
                name={nameFromId(id)}
                sx={{ color: '#2563EB' }}
                {...widgetProps}
            />
        </div>
    </div>
}
