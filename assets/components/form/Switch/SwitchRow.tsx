/******************************************
 * ./assets/components/form/SwitchRow.tsx *
 ******************************************/

import React from 'react'
import SwitchWidget from './SwitchWidget'

/**
 * SwitchRow
 * 
 * A component that renders a Switch button with a corresponding label inside a div container.
 * 
 * @component
 * @param props
 * @param props.id The id of the switch button.
 * @param props.label The label of the switch button.
 * @param props.checked Optional: Whether the switch is checked or not.
 * @param props.style Optional: Styling classes for the div container.
 */
export default function SwitchRow({ id, label, checked, style, ...widgetProps }: {
    id: string
    label: string
    checked?: boolean
    style?: string
}): JSX.Element {
    return <div className={style}>
        <label htmlFor={id} className="inline-flex items-center relative cursor-pointer">
            <SwitchWidget id={id} checked={checked} {...widgetProps} />

            <span className="ml-3 text-sm font-semibold">
                {label}
            </span>
        </label>
    </div>
}
